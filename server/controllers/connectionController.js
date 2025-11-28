const Connection = require("../models/ConnectionModel");
const User = require("../models/UserModel");

// 📌 ایجاد یا آپدیت اتصال کاربر
async function createConnection(
  userId,
  socketId,
  userRooms = [],
  currentRoomId = null,
  currentGameId = null
) {
  const user = await User.findById(userId); // یا هر روشی که داری

  const updates = {
    name: user.name,
    playerId: user._id.toString(), // یا user.playerId اگر داری
    socketId,
    userRooms,
    currentRoomId,
    currentGameId,
  };

  return await Connection.findOneAndUpdate(
    { playerId: user._id.toString() },
    updates,
    {
      upsert: true,
      new: true,
    }
  );
}

// 📌 گرفتن اتصال با آیدی بازیکن
async function getConnectionByPlayerId(playerId) {
  return await Connection.findOne({ playerId });
}

// 📌 گرفتن اتصال با socketId
async function getConnectionBySocketId(socketId) {
  return await Connection.findOne({ socketId });
}

// 📌 گرفتن همه اتصال‌ها (مثلاً برای logAllUsers)
async function getAllConnections() {
  return await Connection.find({});
}

// 📌 حذف اتصال وقتی پلیر disconnect میشه (اختیاری)
async function deleteConnectionByPlayerId(playerId) {
  await Connection.deleteOne({ playerId });
}

// 📌 آپدیت جزئی (مثلاً فقط currentGameId رو تغییر بدی)
async function updateConnection(playerId, updates) {
  return await Connection.findOneAndUpdate({ playerId }, updates, {
    new: true,
  });
}

// گرفتن انرژی و سابسکریپشن کاربر
async function getEnergyAndSubscription(playerId) {
  console.log("getEnergyAndSubscription", playerId);
  const users = await Connection.find();
  console.log("users", users);
  const user = await Connection.findOne({ playerId });
  console.log("user", user);
  if (!user) return null;
  return {
    energy: user.energy,
    subscription: user.subscription,
  };
}

// فایل: Server/controllers/connectionController.js
async function consumeEnergy(playerId, amount = 1) {
  const user = await Connection.findOne({ playerId });
  if (!user) return null;
  user.energy = Math.max(0, user.energy - amount);
  await user.save();
  return user;
}

// افزایش انرژی (مثلاً بعد از تبلیغ)
async function rewardEnergy(playerId) {
  const user = await Connection.findOne({ playerId });
  if (!user) return null;

  // محدودیت تعداد تبلیغ در هر session
  if (user.adSessionCount >= 5) {
    return {
      error: "Ad limit reached",
      energy: user.energy,
      adSessionCount: user.adSessionCount,
    };
  }

  if (user.energy < 10) {
    user.energy += 1;
    user.adSessionCount += 1;
    await user.save();
  }
  return { energy: user.energy, adSessionCount: user.adSessionCount };
}

// آپدیت وضعیت سابسکریپشن
async function updateSubscription(playerId, subscription) {
  return await Connection.findOneAndUpdate(
    { playerId },
    { subscription },
    { new: true }
  );
}

// افزایش شمارنده تبلیغ (adSessionCount)
async function incrementAdSessionCount(playerId) {
  return await Connection.findOneAndUpdate(
    { playerId },
    { $inc: { adSessionCount: 1 } },
    { new: true }
  );
}

// ریست شمارنده تبلیغ (مثلاً هر روز)
async function resetAdSessionCount(playerId) {
  return await Connection.findOneAndUpdate(
    { playerId },
    { adSessionCount: 0 },
    { new: true }
  );
}

module.exports = {
  createConnection,
  getConnectionByPlayerId,
  getConnectionBySocketId,
  getAllConnections,
  deleteConnectionByPlayerId,
  updateConnection,
  getEnergyAndSubscription,
  consumeEnergy,
  rewardEnergy,
  updateSubscription,
  incrementAdSessionCount,
  resetAdSessionCount,
};
