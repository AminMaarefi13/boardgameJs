// utils/gameUtils.js

function updateGameInMemory(games, gameId, gameState) {
  games.set(gameId, gameState);
}

module.exports = { updateGameInMemory };
