const { rooms } = require("../utils/memoryStore");
const roomController = require("../controllers/roomController");

async function onEnterGameLobby(socket, roomId, gameId, callback) {
  const playerId = socket.user._id.toString();

  const room = rooms.get(roomId);
  if (!room) return callback({ success: false, message: "روم پیدا نشد." });

  const game = room.games?.find((g) => g.gameId === gameId);
  if (!game) return callback({ success: false, message: "بازی پیدا نشد." });

  // دیگر بازیکن جدید اضافه نمی‌شود
  callback({ success: true, game });
}

module.exports = { onEnterGameLobby };
