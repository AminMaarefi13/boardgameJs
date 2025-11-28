const redisClient = require("./redisClient");

// ذخیره state بازی در Redis
async function saveGameStateToRedis(gameId, gameState) {
  await redisClient.set(`game:${gameId}`, JSON.stringify(gameState));
}

// خواندن state بازی از Redis
async function getGameStateFromRedis(gameId) {
  const data = await redisClient.get(`game:${gameId}`);
  return data ? JSON.parse(data) : null;
}

module.exports = {
  saveGameStateToRedis,
  getGameStateFromRedis,
};
