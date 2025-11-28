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

async function onUpdateLastSeen(socket, io, roomId, gameId, lastSeenIdx) {
  const playerId = socket.user._id.toString();
  const name = socket.user.name || "نامشخص";
  console.log(
    `🔗 Player ${playerId} (${name}) has updated last seen in room ${roomId}`
  );
  console.log("lastSeenIdx: ", lastSeenIdx);
  console.log("roomId: ", roomId);
  console.log("gameId: ", gameId);

  const room = rooms.get(roomId);
  if (!gameId) {
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }
    console.log("room.seen: ", room.seen);
    const prev = room.seen[playerId] ?? -1;
    if (lastSeenIdx > prev) {
      room.seen[playerId] = lastSeenIdx;
    }
    // const player = room.seen.find((item) => item.playerId === playerId);
    // if (player) {
    //   console.log("player ", player);
    //   player.lastSeenIdx = lastSeenIdx;
    // } else {
    //   console.log("player Not found", player);
    //   room.seen.push({ playerId, name, lastSeenIdx });
    // }
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
    const prev = game.seen[playerId] ?? -1;
    if (lastSeenIdx > prev) {
      game.seen[playerId] = lastSeenIdx;
      gameState.seen[playerId] = lastSeenIdx;
    }

    // const player = game.seen.find((item) => item.playerId === playerId);
    // if (player) {
    //   player.lastSeenIdx = lastSeenIdx;
    // } else {
    //   room.seen.push({ playerId, name, lastSeenIdx });
    // }
    console.log("gammmmmmmme:", game);

    updateAndBroadcastGame(
      games,
      gameId,
      gameState,
      roomId,
      room,
      userSocketMap,
      io,
      true,
      true,
      true,
      false
    );
  }
}

module.exports = {
  onUpdateLastSeen,
};
