const connectionController = require("../controllers/connectionController");
const { logAllUsers } = require("../utils/logAllusers");
const roomController = require("../controllers/roomController");
const {
  rooms,
  games,
  userSocketMap,
  connectionsArr,
} = require("../utils/memoryStore");
const { updateAndBroadcastGame } = require("../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../utils/getValidGameAndRoom");

async function onSendMessage(socket, io, roomId, gameId, type, message, time) {
  const playerId = socket.user._id.toString();
  const name = socket.user.name || "نامشخص";
  console.log(
    `🔗 Player ${playerId} (${name}) has sent a message (${message}) in room ${roomId} at ${time}`
  );

  const room = rooms.get(roomId);
  if (type === "room") {
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    room.chat.push({ senderId: playerId, senderName: name, text: message });
    console.log("roommmmmmmm:", room);
    rooms.set(roomId, room);
    // بروزرسانی دیتابیس
    try {
      await roomController.updateRoom(roomId, room);
    } catch (err) {
      console.error("❌ Failed to update room in DB:", err);
      socket.emit("error", { message: "خطا در اضافه کردن چت به روم." });
      return;
    }

    io.to(roomId).emit("receive_message", {
      type: "room",
      id: roomId,
      chat: room.chat,
    });
  } else {
    const { gameState } = getValidGameAndRoom({
      gameId,
      games,
      rooms,
    });
    const game = games.get(gameId);
    if (!game) {
      socket.emit("error", { message: "Game not found" });
      return;
    }
    game.chat.push({ senderId: playerId, senderName: name, text: message });
    console.log("gammmmmmmme:", game);

    for (const p of gameState.players) {
      const socketId = userSocketMap.get(p.id);
      if (!socketId) continue;
      io.to(socketId).emit("receive_message", {
        type: "game",
        id: gameId,
        chat: game.chat,
      });
    }

    updateAndBroadcastGame(
      games,
      gameId,
      gameState,
      roomId,
      room,
      userSocketMap,
      io,
      true,
      false,
      true,
      false
    );
  }
}

module.exports = {
  onSendMessage,
};
