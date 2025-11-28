function createGameController(GameModel) {
  return {
    async createGame(gameState) {
      const game = new GameModel(gameState);
      await game.save();
      return game;
    },
    async getGameByGameId(gameId) {
      return await GameModel.findOne({ gameId });
    },
    async getAllGames() {
      return await GameModel.find();
    },
    async updateGame(gameId, updates) {
      return await GameModel.findOneAndUpdate({ gameId }, updates, {
        new: true,
      });
    },
    async deleteGame(gameId) {
      await GameModel.findOneAndUpdate({ gameId }, { gameStatus: "finished" });
    },
  };
}
module.exports = createGameController;
