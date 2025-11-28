const { broadcastChatHandler } = require("./broadcastChatHandler.js");
const { updateChatInDB } = require("./updateChatInDB.js");
const { updateChatInMemory } = require("./updateChatInMemory.js");
const { updateChatInRedis } = require("./updateChatInRedis.js");

/**
 * به‌روزرسانی چت در حافظه، دیتابیس، و ارسال وضعیت به بازیکنان
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

async function updateAndBroadcastChat(
  chats,
  chatId,
  chatState,
  userSocketMap,
  io,
  saveToMemory = true,
  saveToDB = false,
  saveToRedis = true,
  broadcast = true
) {
  if (saveToMemory) {
    updateChatInMemory(chats, chatId, chatState);
  }

  if (saveToRedis) {
    await updateChatInRedis(chatId, chatState);
  }

  if (saveToDB) {
    await updateChatInDB(chatId, chatState);
  }

  if (broadcast) {
    broadcastChatHandler(io, chatState, userSocketMap);
  }
}

module.exports = { updateAndBroadcastChat };
