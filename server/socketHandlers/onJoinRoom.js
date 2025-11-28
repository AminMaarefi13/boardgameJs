const connectionController = require("../controllers/connectionController");
const { logAllUsers } = require("../utils/logAllusers");
const roomController = require("../controllers/roomController");
const {
  rooms,
  connectionsArr,
  userSocketMap,
} = require("../utils/memoryStore");

async function onJoinRoom(roomId, socket, io) {
  const playerId = socket.user._id.toString();
  const name = socket.user.name || "نامشخص";
  console.log(`🔗 Player ${playerId} (${name}) is joining room ${roomId}`);
  // console.log(rooms, connectionsArr, userSocketMap);
  // console.log("rooms, connectionsArr, userSocketMap");
  const connectionUser =
    connectionsArr.get(playerId) ||
    (await connectionController.getConnectionByPlayerId(playerId));
  const room = rooms.get(roomId);

  if (!room) {
    socket.emit("error", { message: "Room not found" });
    return;
  }
  connectionUser.currentRoomId = room.roomId;
  connectionUser.socketId = socket.id;

  // بررسی اینکه آیا بازیکن قبلاً در لیست هست یا نه
  let player = room.players.find((p) => p.playerId === playerId);
  const isReconnect = Boolean(player);

  if (isReconnect) {
    // ✅ بازیکن قبلاً در لیست بوده، فقط مقادیر جدید رو merge می‌کنیم
    player.nickname = name;
    player.socketId = socket.id;
    console.log(`🔄 ${name} (ID: ${playerId}) reconnected to room ${roomId}`);
  } else {
    // ✅ بازیکن جدید، اضافه به لیست بدون overwrite
    player = {
      playerId: playerId,
      nickname: name,
      socketId: socket.id,
      isReady: false,
    };
    room.players.push(player);
    console.log(`➕ ${name} joined room ${roomId}`);
  }

  // بروزرسانی دیتابیس
  try {
    await roomController.updateRoom(roomId, {
      players: room.players.map((p) => ({
        playerId: p.playerId,
        nickname: p.nickname,
        isReady: p.isReady,
        socketId: p.socketId,
      })),
    });
  } catch (err) {
    console.error("❌ Failed to update room in DB:", err);
    socket.emit("error", { message: "خطا در پیوستن به روم." });
    return;
  }

  // اتصال به سوکت روم
  socket.join(roomId);

  io.to(socket.id).emit("joined_room", {
    roomId,
    roomPlayers: room.players,
    roomName: room.roomName,
    hostName: room.hostName,
    hostId: room.hostId,
    roomGames: room.games || [],
    chat: room.chat,
    seen: room.seen,
  });
  // console.log("room.players", room.players);
  // console.log("room.players eeeee", room.players);

  io.to(roomId).emit("players_updated", {
    roomId,
    roomPlayers: room.players,
  });

  // اطمینان از وجود Set برای roomIds و اضافه کردن roomId جدید
  // تبدیل آرایه به Set موقت، افزودن roomId و تبدیل مجدد به آرایه
  const userRoomsSet = new Set(connectionUser.userRooms || []);
  userRoomsSet.add({
    roomId,
    hostName: room.hostName,
    hostId: room.hostId,
    roomName: room.roomName,
    roomPlayers: room.players,
    chat: room.chat,
    seen: room.seen,
  });
  connectionUser.userRooms = [...userRoomsSet];

  // ثبت اتصال
  userSocketMap.set(playerId, socket.id);

  // لاگ برای بررسی
  logAllUsers(userSocketMap, rooms);

  const roomIds = new Set(
    Array.from(connectionUser?.userRooms || []).map((room) => room.roomId)
  );
  const result = Array.from(roomIds)
    .map((id) => {
      const r = rooms.get(id);
      if (!r) return null;
      return {
        roomId: id,
        roomPlayers: r.players,
        roomName: r.roomName,
        hostName: r.players[0]?.nickname || "نامشخص",
        hostId: r.hostId,
        roomGames: r.games,
        chat: r.chat,
        seen: r.seen,
      };
    })
    .filter(Boolean);

  io.to(socket.id).emit("user_rooms_updated", result);

  const userRoomsArr = Array.from(roomIds)
    .map((roomId) => {
      const room = rooms.get(roomId);
      if (!room) return null;

      return {
        roomId,
        hostName: room.players[0]?.nickname || "نامشخص",
        hostId: room.hostId,
        roomName: room.roomName,
        roomPlayers: room.players,
        chat: room.chat,
        seen: room.seen,
      };
    })
    .filter(Boolean);

  await connectionController.updateConnection(playerId, {
    currentRoomId: room.roomId,
    socketId: socket.id,
    name: connectionUser.name,
    userRooms: userRoomsArr,
  });
}

module.exports = {
  onJoinRoom,
};
