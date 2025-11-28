// utils/gameUtils.js
const { updateGameInMemory } = require("./updateGameInMemory.js");
const { updateGameInDB } = require("./updateGameInDB.js");
// const {
//   broadcastGameStateToPlayers,
// } = require("../games/feedTheKraken/utils/broadcastGameStateToPlayers.js");
const { updateGameInRedis } = require("./updateGameInRedis.js");
const { broadcastHandlers } = require("./broadcastHandlers.js");

/**
 * به‌روزرسانی بازی در حافظه، دیتابیس، و ارسال وضعیت به بازیکنان
 * @param {Object} options
 * @param {Map} options.games - نقشه‌ی بازی‌ها
 * @param {string} options.gameId - شناسه بازی
 * @param {Object} options.gameState - وضعیت بازی
 * @param {string} options.roomId - شناسه اتاق
 * @param {Object} options.room - شیء اتاق
 * @param {Map} options.userSocketMap - مپ socketIdها
 * @param {Object} options.io - شیء اصلی Socket.io
 * @param {boolean} [options.saveToMemory=true]
 * @param {boolean} [options.saveToDB=true]
 * @param {boolean} [options.broadcast=true]
 */

async function updateAndBroadcastGame(
  games,
  gameId,
  gameState,
  roomId,
  room,
  userSocketMap,
  io,
  saveToMemory = true,
  saveToDB = false,
  saveToRedis = true,
  broadcast = true
) {
  if (saveToMemory) {
    updateGameInMemory(games, gameId, gameState);
  }

  if (saveToRedis) {
    await updateGameInRedis(gameId, gameState);
  }

  if (saveToDB) {
    await updateGameInDB(gameId, gameState);
  }

  if (broadcast) {
    const type = gameState.type;
    const handler = broadcastHandlers[type];
    if (handler) {
      handler(io, gameState, userSocketMap);
    } else {
      console.warn(`No broadcast handler found for game type: ${type}`);
    }
  }
  // if (broadcast) {
  //   broadcastGameStateToPlayers(io, gameState, userSocketMap);
  // }
}

module.exports = { updateAndBroadcastGame };
