const roomController = require("../controllers/roomController");
const gameController = require("../controllers/gameController");
const connectionController = require("../controllers/connectionController");
const {
  rooms,
  games,
  userSocketMap,
  connectionsArr,
} = require("../utils/memoryStore");
const { getPlayerLimits } = require("../utils/gamePlayerLimits");

const { gameControllers } = require("../utils/gameControllers");
const { gameStartMap } = require("../utils/gameStartMap");
const { logAllUsers } = require("../utils/logAllusers");

async function onStartGame(roomId, gameId, socket, io) {
  const playerId = socket.user._id.toString();
  const room = rooms.get(roomId);
  if (!room) return socket.emit("error_message", "اتاق مورد نظر یافت نشد.");

  const game = room.games.find((g) => g.gameId === gameId);
  if (!game || game.gameStatus !== "waiting") return;

  const readyPlayers = game.players.filter((p) => p.isReady);
  const { min, max } = getPlayerLimits(game.type);
  if (readyPlayers.length < min || readyPlayers.length > max) {
    const msg =
      min === max
        ? `تعداد بازیکنان باید دقیقا ${min} نفر باشد.`
        : `تعداد بازیکنان آماده باید بین ${min} تا ${max} نفر باشد.`;
    return socket.emit("error_message", msg);
  }

  try {
    // انتخاب تابع شروع بازی بر اساس نوع بازی
    const startGameFn = gameStartMap[game.type];
    if (!startGameFn) {
      return socket.emit("error_message", "نوع بازی پشتیبانی نمی‌شود.");
    }

    const type = game.type;
    const controller = gameControllers[type];

    // اجرای تابع مخصوص بازی و دریافت وضعیت اولیه بازی
    await startGameFn({
      readyPlayers,
      roomId,
      gameId,
      room,
      io,
      userSocketMap,
      gameController: controller,
      games,
      rooms,
    });

    // // ثبت در حافظه
    // games.delete(gameId);
    // games.set(gameId, game);

    // console.log("games");
    // // console.log(games);
    // if (!room.games) {
    //   room.games = [];
    // }

    // const filteredRoomGames = room.games.filter(
    //   (game) => game.gameId !== gameId
    // );
    // const gamesSet = new Set(filteredRoomGames);
    // gamesSet.add(game);
    // room.games = [...gamesSet];
    // // بروزرسانی دیتابیس روم
    // await roomController.updateRoom(roomId, {
    //   games: [...room.games],
    // });
    // console.log("game");

    // console.log(room);

    // console.log(room.games);
    // console.log("room");

    // console.log("room.roomGames");
    // room.players.forEach(async (player) => {
    //   const playerId = player.playerId;
    //   const socketId = userSocketMap.get(playerId);

    //   const connectionUser = connectionsArr.get(playerId);
    //   //  ||
    //   // (await connectionController.getConnectionByPlayerId(playerId));
    //   if (!connectionUser) return;
    //   console.log(socketId);
    //   // مرحله ارسال وضعیت کامل اولیه
    //   io.to(socketId).emit("room_updated", room);
    // });
  } catch (err) {
    console.error("❌ خطا در شروع بازی:", err);
    socket.emit("error_message", "خطا در شروع بازی.");
  }
}

module.exports = {
  onStartGame,
};
