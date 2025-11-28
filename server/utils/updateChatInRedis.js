// utils/gameUtils.js
const redisClient = require("./redisClient.js");

async function updateChatInRedis(chatId, chatState) {
  await redisClient.set(`chat:${chatId}`, JSON.stringify(chatState));
}

module.exports = { updateChatInRedis };
