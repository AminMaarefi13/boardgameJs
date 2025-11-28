// فایل: d:\Udemy\MyProjects\feed-the-kraken-app\Server\socketHandlers\friends.js
const User = require("../models/UserModel");
const { userSocketMap } = require("../utils/memoryStore");

// ارسال درخواست دوستی
async function sendFriendRequest(socket, targetId, callback) {
  const userId = socket.user._id.toString();
  if (userId === targetId)
    return callback({
      success: false,
      message: "نمی‌توانید خودتان را اضافه کنید.",
    });

  const user = await User.findById(userId);
  const target = await User.findById(targetId);
  if (!target) return callback({ success: false, message: "کاربر پیدا نشد." });

  if (
    user.friends.includes(targetId) ||
    user.pendingRequests.includes(targetId) ||
    target.requests.includes(userId)
  ) {
    return callback({
      success: false,
      message: "درخواست قبلاً ارسال شده یا دوست هستید.",
    });
  }

  user.pendingRequests.push(targetId);
  target.requests.push(userId);
  await user.save();
  await target.save();

  // اطلاع real-time به کاربر هدف
  const targetSocketId = userSocketMap.get(targetId);
  if (targetSocketId) {
    socket.to(targetSocketId).emit("friend_request_received", {
      from: userId,
      name: user.name,
    });
  }

  callback({ success: true, message: "درخواست ارسال شد." });
}

// دریافت لیست دوستان و درخواست‌ها
// فایل: Server/socketHandlers/friends.js
async function getFriendsData(socket, callback) {
  const userId = socket.user._id;
  const user = await User.findById(userId)
    .populate("friends", "name _id")
    .populate("requests", "name _id")
    .populate("pendingRequests", "name _id");

  // پیدا کردن دوستان آنلاین
  const onlineFriends = user.friends
    .filter((f) => userSocketMap.has(f._id.toString()))
    .map((f) => f._id.toString());

  callback({
    friends: user.friends,
    requests: user.requests,
    pendingRequests: user.pendingRequests,
    onlineFriends, // اضافه شد
  });
}
// پاسخ به درخواست دوستی (قبول یا رد)
async function respondFriendRequest(socket, { fromId, accept }, callback) {
  const userId = socket.user._id.toString();
  const user = await User.findById(userId);
  const fromUser = await User.findById(fromId);

  if (!user.requests.includes(fromId)) {
    return callback({
      success: false,
      message: "درخواستی از این کاربر ندارید.",
    });
  }

  // حذف از requests و pendingRequests
  user.requests = user.requests.filter((id) => id.toString() !== fromId);
  fromUser.pendingRequests = fromUser.pendingRequests.filter(
    (id) => id.toString() !== userId
  );

  if (accept) {
    // اضافه به friends هر دو
    user.friends.push(fromId);
    fromUser.friends.push(userId);
    await user.save();
    await fromUser.save();

    // اطلاع به هر دو کاربر
    const fromSocketId = userSocketMap.get(fromId);
    if (fromSocketId) {
      socket.to(fromSocketId).emit("friend_request_accepted", { by: userId });
    }
    callback({ success: true, message: "درخواست پذیرفته شد." });
  } else {
    await user.save();
    await fromUser.save();

    // اطلاع به کاربر درخواست‌دهنده
    const fromSocketId = userSocketMap.get(fromId);
    if (fromSocketId) {
      socket.to(fromSocketId).emit("friend_request_rejected", { by: userId });
    }
    callback({ success: true, message: "درخواست رد شد." });
  }
}

// لغو درخواست دوستی (از سمت درخواست‌دهنده)
async function cancelFriendRequest(socket, targetId, callback) {
  const userId = socket.user._id.toString();
  const user = await User.findById(userId);
  const target = await User.findById(targetId);

  // حذف از pendingRequests خودت و requests طرف مقابل
  user.pendingRequests = user.pendingRequests.filter(
    (id) => id.toString() !== targetId
  );
  target.requests = target.requests.filter((id) => id.toString() !== userId);

  await user.save();
  await target.save();

  // اطلاع به طرف مقابل اگر آنلاین است
  const targetSocketId = userSocketMap.get(targetId);
  if (targetSocketId) {
    socket.to(targetSocketId).emit("friend_request_cancelled", { by: userId });
  }

  callback({ success: true, message: "درخواست لغو شد." });
}

module.exports = {
  sendFriendRequest,
  getFriendsData,
  respondFriendRequest,
  cancelFriendRequest,
};
