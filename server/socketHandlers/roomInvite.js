const { userSocketMap, rooms } = require("../utils/memoryStore");
const User = require("../models/UserModel");
const { onJoinRoom } = require("./onJoinRoom");

async function inviteFriendToRoom(socket, { friendId, roomId }, callback) {
  const userId = socket.user._id.toString();
  const userName = socket.user.name;
  if (userId === friendId)
    return callback({
      success: false,
      message: "نمی‌توانید خودتان را دعوت کنید.",
    });

  const room = rooms.get(roomId);
  if (!room) return callback({ success: false, message: "روم پیدا نشد." });

  // چک کن دوست عضو روم نباشد
  if (room.players.some((p) => p.playerId?.toString() === friendId))
    return callback({
      success: false,
      message: "این کاربر هم‌اکنون عضو روم است.",
    });

  // چک کن قبلاً اینوایت نشده باشد
  if (room.pendingInvites?.some((inv) => inv.to === friendId))
    return callback({ success: false, message: "قبلاً دعوت شده است." });

  // گرفتن نام دوست (اختیاری)
  const friend = await User.findById(friendId);
  if (!friend) return callback({ success: false, message: "کاربر پیدا نشد." });

  // اضافه به لیست پندینگ روم
  if (!room.pendingInvites) room.pendingInvites = [];
  room.pendingInvites.push({
    from: userId,
    fromName: userName,
    to: friendId,
    toName: friend.name,
    createdAt: new Date(),
  });
  console.log("room.pendingInvites");
  console.log(room.pendingInvites);
  // اطلاع real-time اگر آنلاین است
  const friendSocketId = userSocketMap.get(friendId);
  if (friendSocketId) {
    socket.to(friendSocketId).emit("room_invite_received", {
      roomId,
      from: userId,
      fromName: userName,
    });
  }

  callback({ success: true, message: "دعوت ارسال شد." });
}

function getRoomInvites(socket, callback) {
  const userId = socket.user._id.toString();
  console.log("getRoomInvites for userId:", userId);
  const invites = [];

  // فرض: rooms یک Map است که همه روم‌ها را نگه می‌دارد
  for (const [roomId, room] of rooms.entries()) {
    (room.pendingInvites || []).forEach((inv) => {
      if (inv.to === userId) {
        invites.push({
          roomId,
          from: { _id: inv.from, name: inv.fromName },
          to: { _id: inv.to, name: inv.toName },
          createdAt: inv.createdAt,
        });
      }
    });
  }
  console.log("invites:", invites);
  callback(invites);
}

async function respondRoomInvite(
  socket,
  io,
  { roomId, fromId, accept },
  callback
) {
  const userId = socket.user._id.toString();
  const room = rooms.get(roomId);
  if (!room) {
    return callback({
      success: false,
      message: "روم پیدا نشد.",
      joined: false,
    });
  }

  // حذف اینوایت از لیست پندینگ روم (در هر دو حالت)
  room.pendingInvites = (room.pendingInvites || []).filter(
    (inv) => !(inv.to === userId && inv.from === fromId)
  );

  // اطلاع به دعوت‌کننده و دعوت‌شونده برای رفرش لیست اینوایت‌ها
  const inviterSocketId = userSocketMap.get(fromId);
  if (inviterSocketId) {
    socket.to(inviterSocketId).emit("room_invite_received");
  }
  const inviteeSocketId = userSocketMap.get(userId);
  if (inviteeSocketId) {
    socket.to(inviteeSocketId).emit("room_invite_received");
  }

  if (accept) {
    // اضافه کردن کاربر به روم در Map حافظه (منطق فعلی تو)
    const alreadyInRoom = room.players.some(
      (p) => p.playerId?.toString() === userId
    );
    if (!alreadyInRoom) {
      onJoinRoom(roomId, socket, io);
    }
    callback({ success: true, message: "به روم اضافه شدید.", joined: true });
  } else {
    callback({ success: true, message: "دعوت رد شد.", joined: false });
  }
}

function cancelRoomInvite(socket, { friendId, roomId }, callback) {
  const room = rooms.get(roomId);
  if (!room) return callback({ success: false, message: "روم پیدا نشد." });

  room.pendingInvites = (room.pendingInvites || []).filter(
    (inv) => inv.to !== friendId
  );

  // اطلاع real-time به کاربر دعوت‌شونده برای رفرش لیست اینوایت‌ها
  const friendSocketId = userSocketMap.get(friendId);
  if (friendSocketId) {
    socket.to(friendSocketId).emit("room_invite_received");
  }

  callback({ success: true, message: "اینوایت حذف شد." });
}

function getPendingRoomInvites(socket, { roomId }, callback) {
  const room = rooms.get(roomId);
  callback(room?.pendingInvites || []);
}

module.exports = {
  inviteFriendToRoom,
  getRoomInvites,
  respondRoomInvite,
  cancelRoomInvite,
  getPendingRoomInvites,
};
