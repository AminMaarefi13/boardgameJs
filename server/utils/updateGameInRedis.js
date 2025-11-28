// utils/gameUtils.js
const redisClient = require("./redisClient.js");

async function updateGameInRedis(gameId, gameState) {
  await redisClient.set(`game:${gameId}`, JSON.stringify(gameState));
}

module.exports = { updateGameInRedis };
