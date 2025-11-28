const roomController = require("../controllers/roomController");
const { rooms } = require("../utils/memoryStore");

async function onToggleReady(socket, roomId, gameId, io, callback) {
  const playerId = socket.user._id.toString();
  const nickname = socket.user.name || "نامشخص";
  const room = rooms.get(roomId);
  if (!room) return;
  const game = room.games.find((g) => g.gameId === gameId);
  if (!game || game.gameStatus !== "waiting") return;

  let player = game.players.find((p) => p.playerId === playerId);

  if (!player) {
    player = {
      playerId,
      nickname,
      socketId: socket.id,
      isReady: true,
    };
    game.players.push(player);
  } else if (player.isReady) {
    game.players = game.players.filter((p) => p.playerId !== playerId);
  } else {
    player.isReady = true;
  }

  // ذخیره فقط games
  await roomController.updateRoom(roomId, { games: room.games });

  // مقدار جدید room را از حافظه بخوان (یا اگر room.games در حافظه sync است، همین را استفاده کن)
  const updatedRoom = rooms.get(roomId);
  const updatedGame = updatedRoom.games.find((g) => g.gameId === gameId);

  io.to(roomId).emit("game_players_updated", {
    roomId,
    gameId,
    gamePlayers: updatedGame.players,
  });

  // ارسال کل لیست بازی‌های روم برای همه
  io.to(roomId).emit("room_games_updated", {
    roomId,
    games: updatedRoom.games,
  });

  callback?.({
    success: true,
    gamePlayers: updatedGame.players,
    games: updatedRoom.games,
  });
}

module.exports = {
  onToggleReady,
};

// const roomController = require("../controllers/roomController");
// const { rooms } = require("../utils/memoryStore");

// async function onToggleReady(socket, roomId, gameId, io, callback) {
//   const playerId = socket.user._id.toString();
//   const nickname = socket.user.name || "نامشخص";
//   const room = rooms.get(roomId);
//   if (!room) return;
//   const game = room.games.find((g) => g.gameId === gameId);
//   if (!game || game.gameStatus !== "waiting") return;

//   let player = game.players.find((p) => p.playerId === playerId);

//   if (!player) {
//     // اگر بازیکن عضو بازی نیست، اضافه کن و آماده باشد
//     player = {
//       playerId,
//       nickname,
//       socketId: socket.id,
//       isReady: true,
//     };
//     game.players.push(player);
//   } else if (player.isReady) {
//     // اگر آماده بود و بی‌خیال زد، حذفش کن
//     game.players = game.players.filter((p) => p.playerId !== playerId);
//   } else {
//     // اگر عضو بود و آماده نبود، فقط آماده‌اش کن
//     player.isReady = true;
//   }

//   // فقط games را ذخیره کن
//   await roomController.updateRoom(roomId, { games: room.games });

//   io.to(roomId).emit("game_players_updated", {
//     roomId,
//     gameId,
//     gamePlayers: game.players,
//   });
//   callback?.({ success: true, gamePlayers: game.players });
// }

// module.exports = {
//   onToggleReady,
// };

// // const roomController = require("../controllers/roomController");
// // const { rooms } = require("../utils/memoryStore");

// // async function onToggleReady(socket, roomId, gameId, io, callback) {
// //   const playerId = socket.user._id.toString();
// //   const nickname = socket.user.name || "نامشخص";
// //   const room = rooms.get(roomId);
// //   if (!room) return;
// //   const game = room.games.find((g) => g.gameId === gameId);
// //   if (!game || game.gameStatus !== "waiting") return;

// //   let player = game.players.find((p) => p.playerId === playerId);

// //   if (!player) {
// //     // اگر بازیکن عضو بازی نیست، اضافه کن و آماده باشد
// //     player = {
// //       playerId,
// //       nickname,
// //       socketId: socket.id,
// //       isReady: true,
// //     };
// //     game.players.push(player);
// //   } else if (player.isReady) {
// //     // اگر آماده بود و بی‌خیال زد، حذفش کن
// //     game.players = game.players.filter((p) => p.playerId !== playerId);
// //   } else {
// //     // اگر عضو بود و آماده نبود، فقط آماده‌اش کن
// //     player.isReady = true;
// //   }

// //   await roomController.updateRoom(roomId, room);

// //   io.to(roomId).emit("game_players_updated", {
// //     roomId,
// //     gameId,
// //     gamePlayers: game.players,
// //   });
// //   callback?.({ success: true, gamePlayers: game.players });
// // }

// // module.exports = {
// //   onToggleReady,
// // };

// // // const roomController = require("../controllers/roomController");
// // // const { rooms } = require("../utils/memoryStore");

// // // async function onToggleReady(socket, roomId, gameId, io, callback) {
// // //   const playerId = socket.user._id.toString();
// // //   console.log(
// // //     `🔄 Player ${playerId} toggling ready status in room ${roomId} for game ${gameId}`
// // //   );
// // //   console.log(rooms);
// // //   console.log("rooms onToggleReady");
// // //   const room = rooms.get(roomId);
// // //   if (!room) return;
// // //   const game = room.games.find((g) => g.gameId === gameId);
// // //   if (!game || game.gameStatus !== "waiting") return;

// // //   const player = game.players.find((p) => p.playerId === playerId);
// // //   if (!player) return;

// // //   player.isReady = !player.isReady;
// // //   // به‌روزرسانی دیتابیس
// // //   await roomController.updateRoom(roomId, room);
// // //   // ارسال وضعیت جدید به همه‌ی اعضای روم
// // //   io.to(roomId).emit("game_players_updated", {
// // //     roomId,
// // //     gameId,
// // //     gamePlayers: game.players,
// // //   });
// // //   callback?.({ success: true, gamePlayers: game.players });
// // // }

// // // module.exports = {
// // //   onToggleReady,
// // // };
