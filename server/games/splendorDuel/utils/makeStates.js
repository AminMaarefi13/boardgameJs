function makePublicState(gameState) {
  console.log("makePublicState");
  // console.log(gameState);
  return {
    gameId: gameState.gameId,
    roomId: gameState.roomId,
    players: gameState.players,
    currentPhase: gameState.currentPhase,
    devCardsDeckLengths: [
      gameState.devCardsDeck[0].length,
      gameState.devCardsDeck[1].length,
      gameState.devCardsDeck[2].length,
    ],
    devCardsVisible: gameState.devCardsVisible,
    nobleTilesDeck: gameState.nobleTilesDeck,
    chipQuantities: gameState.chipQuantities,
    privileges: gameState.privileges,
    chipBoard: gameState.chipBoard,
    turn: gameState.turn,
    phaseData: gameState.phaseData,
    nextPhaseData: gameState.nextPhaseData,
    logs: gameState.logs,
    chat: gameState.chat,
    seen: gameState.seen,
    gameStatus: gameState.gameStatus,
    type: gameState.type,
  };
}

function makePrivateState(player) {
  return {
    seat: player.seat,
    characterCard: player.characterCard,
    role: player.role,
    knownRoles: player.knownRoles,
    guns: player.guns,
    offDuty: player.offDuty,
    votes: player.votes,
    canJoinCult: player.canJoinCult,
    tongueOff: player.tongueOff,
    initialRole: player.initialRole,
    eliminated: player.eliminated,
    isNotARole: player.isNotARole,
    resume: player.resume,
    privatePhaseData: player.privatePhaseData,
  };
}

module.exports = {
  makePublicState,
  makePrivateState,
};
