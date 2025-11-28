// const Game = require("../models/FeedTheKrakenGameModel");

async function createGame(gameState) {
  const game = new Game(gameState);
  await game.save();
  return game;
}

async function getGameByGameId(gameId) {
  return await Game.findOne({ gameId });
}

async function getAllGames() {
  return await Game.find();
}

async function updateGame(gameId, updates) {
  return await Game.findOneAndUpdate({ gameId }, updates, { new: true });
}

async function deleteGame(gameId) {
  await updateGame(gameId, { gameStatus: "finished" });
}

module.exports = {
  createGame,
  getGameByGameId,
  getAllGames,
  updateGame,
  deleteGame,
};
