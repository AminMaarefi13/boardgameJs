const { gameControllers } = require("./gameControllers");

async function updateGameInDB(gameId, gameState) {
  const type = gameState.type;
  const controller = gameControllers[type];
  if (!controller) {
    throw new Error(`No controller found for game type: ${type}`);
  }
  await controller.updateGame(gameId, gameState);
}

module.exports = { updateGameInDB };
