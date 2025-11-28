const redisClient = require("./redisClient.js");
const { updateGameInDB } = require("./updateGameInDB.js");

function startPeriodicDBSave(games, intervalMs = 500 * 60 * 1000) {
  setInterval(async () => {
    console.log("Saving game states to DB...");
    for (const [gameId] of games) {
      const data = await redisClient.get(`game:${gameId}`);
      if (data) {
        const gameState = JSON.parse(data);
        await updateGameInDB(gameId, gameState);
      }
    }
  }, intervalMs);
}

module.exports = { startPeriodicDBSave };
