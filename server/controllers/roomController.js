const Room = require("../models/RoomModel");

// ایجاد یک روم جدید
async function createRoom(roomId, hostId, hostName, players = []) {
  const room = new Room({
    roomId,
    hostId,
    roomName: `روم ${roomId}`,
    hostName,
    players,
    games: [],
    chat: [],
    seen: {},
  });

  await room.save();
  console.log("✅ Room created and saved in DB:", roomId);
  return room;
}

// گرفتن روم بر اساس ID
async function getRoomById(roomId) {
  return await Room.findOne({ roomId });
}

// آپدیت روم (مثلاً تغییر playerها، وضعیت ready، یا currentGameId)
async function updateRoom(roomId, updates) {
  return await Room.findOneAndUpdate({ roomId }, updates, { new: true });
}

// گرفتن همه روم‌ها (مثلاً هنگام ریکاوری بعد از ری‌استارت)
async function getAllRooms() {
  return await Room.find({});
}

// جدید: گرفتن همه بازی‌ها
async function getAllGamesByRoomId(roomId) {
  return await Room.find({ roomId });
}

// حذف روم (مثلاً وقتی کاربر لابی رو پاک می‌کنه)
async function deleteRoom(roomId) {
  await Room.deleteOne({ roomId });
}

module.exports = {
  createRoom,
  getRoomById,
  updateRoom,
  getAllGamesByRoomId,
  getAllRooms,
  deleteRoom,
};
