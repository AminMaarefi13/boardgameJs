const gameController = require("../controllers/gameController");
const { rooms, games } = require("../utils/memoryStore");
async function onGetGameStatus(roomId, callback) {
  const room = rooms.get(roomId);
  console.log("roomId");
  console.log(roomId);
  console.log("onGetGameStatus");
  console.log(rooms, games);
  console.log("rooms, games");
  ////////////// toFix
  const gameId = room.activeGameId;
  console.log("gameId");
  console.log(gameId);
  let game = games.get(gameId);
  console.log("game");
  // console.log(game);
  if (!game) {
    const dbGame = await gameController.getGameByGameId(gameId);
    if (!dbGame) return callback(null); // بازی در پایگاه داده هم نبود

    game = {
      gameId: dbGame.gameId,
      roomId: dbGame.roomId,
      journeyType: dbGame.journeyType,
      players: dbGame.players,
      captainId: dbGame.captainId,
      firstOfficerId: dbGame.firstOfficerId,
      navigatorId: dbGame.navigatorId,
      offDutyIds: dbGame.offDutyIds,
      mapPosition: dbGame.mapPosition,
      currentPhase: dbGame.currentPhase,
      navigationDeck: dbGame.navigationDeck,
      discardPile: dbGame.discardPile,
      cultRitualDeck: dbGame.cultRitualDeck,
      playedNavCards: dbGame.playedNavCards,
      gunReloadUsed: dbGame.gunReloadUsed,
      currentVoteSessionId: dbGame.currentVoteSessionId,
      phaseData: dbGame.phaseData,
      nextPhaseData: dbGame.nextPhaseData,
      logs: dbGame.logs,
      gameStatus: dbGame.gameStatus,
      type: dbGame.type,
    };
    games.set(gameId, game);
  }

  // ارسال وضعیت کامل بازی
  callback({
    gameId,
    roomId,
    gameState: game,
  });
}

module.exports = {
  onGetGameStatus,
};
