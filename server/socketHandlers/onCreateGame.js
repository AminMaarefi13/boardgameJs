const roomController = require("../controllers/roomController");
const gameController = require("../controllers/gameController");
const connectionController = require("../controllers/connectionController");
const {
  rooms,
  games,
  connectionsArr,
  userSocketMap,
} = require("../utils/memoryStore");

async function onCreateGame(roomId, type, socket, io) {
  const name = socket.user.name || "نامشخص";
  const playerId = socket.user._id.toString();
  console.log(
    `🔗 Player ${playerId} is creating a game in room ${roomId} of type ${type}`
  );
  console.log(rooms, games, userSocketMap);
  console.log("rooms, games, userSocketMap");

  const connectionUser =
    connectionsArr.get(playerId) ||
    (await connectionController.getConnectionByPlayerId(playerId));
  console.log("connectionUser");
  console.log(connectionUser);
  const room = rooms.get(roomId);

  if (!room) {
    return socket.emit("error_message", "اتاق مورد نظر یافت نشد.");
  }

  // if (room.hostId !== playerId) {
  //   return socket.emit(
  //     "error_message",
  //     "فقط میزبان می‌تواند بازی را شروع کند."
  //   );
  // }

  // const readyPlayers = room.players.filter((p) => p.isReady);
  // if (readyPlayers.length < 5 || readyPlayers.length > 11) {
  //   return socket.emit(
  //     "error_message",
  //     "تعداد بازیکنان آماده باید بین ۵ تا ۱۱ نفر باشد."
  //   );
  // }

  try {
    const gameId = Math.random().toString(36).substring(2, 10);
    // const gameState = gameStartPhase(readyPlayers, "quick", roomId);
    const newPlayer = {
      nickname: name,
      playerId: playerId,
      socketId: socket.id,
      isReady: true,
    };
    const game = {
      gameId,
      roomId,
      type,
      players: [newPlayer],
      gameCreatorId: playerId,
      gameCreatorName: name,
      gameStatus: "waiting",
    };
    // ثبت در حافظه
    games.set(gameId, game);

    console.log("games");
    // console.log(games);
    if (!room.games) {
      room.games = [];
    }

    const gamesSet = new Set(room.games);
    gamesSet.add(game);
    room.games = [...gamesSet];
    // بروزرسانی دیتابیس روم
    await roomController.updateRoom(roomId, {
      games: [...room.games],
    });
    console.log("game");

    // console.log(game);

    // try {
    //   await gameController.createGame(game);
    // } catch (err) {
    //   console.error("❌ Failed to persist game:", err);
    //   socket.emit("error", { message: "خطا در ساختن بازی." });
    //   return;
    // }

    // game.players.forEach((p) => {
    //   p.isReady = false;
    // });

    // به‌روزرسانی دیتابیس
    // await roomController.updateRoom(roomId, {
    //   players: room.players.map((p) => ({
    //     playerId: p.playerId,
    //     nickname: p.nickname,
    //     isReady: p.isReady,
    //     socketId: p.socketId,
    //   })),
    // });
    // ارسال وضعیت جدید به همه‌ی اعضای روم
    // io.to(roomId).emit("players_updated", {
    //   roomId,
    //   roomPlayers: room.players,
    // });
    console.log(room);

    console.log(room.games);
    console.log("room");

    console.log("room.roomGames");
    for (const p of room.players) {
      const socketId = userSocketMap.get(p.playerId);
      console.log("socketIdsssssssssssssssssssssssssssss");

      console.log(socketId);
      // مرحله ارسال وضعیت کامل اولیه
      io.to(socketId).emit("room_updated", room);
    }

    socket.emit("game_created", {
      game,
    });
  } catch (err) {
    console.error("❌ خطا در ساخت بازی:", err);
    socket.emit("error_message", "خطا در ساخت بازی.");
  }
}

module.exports = {
  onCreateGame,
};
