const {
  updateAndBroadcastGame,
} = require("../../../../../utils/updateAndBroadcastGame");

/**
 * مدیریت حالت حذف شدن رهبر فرقه و اجرای مراسم به صورت اتوماتیک با تاخیر
 * @param {Object} gameState
 * @param {string} chosenCard
 * @param {Array} alivePlayers
 * @param {Function} updateAndBroadcastGame
 * @param {Array} updateParams
 */
function handleCultLeaderEliminated(
  gameState,
  chosenCard,
  alivePlayers,
  games,
  gameId,
  gameState,
  roomId,
  room,
  userSocketMap,
  io
) {
  gameState.currentPhase =
    chosenCard === "cult_cabin_search"
      ? `${chosenCard}_result`
      : `${chosenCard}_choice`;
  gameState.phaseData = {
    currentPhase: `${chosenCard}_choice`,
    title: "مراسم فرقه‌",
  };
  updateAndBroadcastGame(
    games,
    gameId,
    gameState,
    roomId,
    room,
    userSocketMap,
    io
  );

  const randomDelay =
    alivePlayers.length === 1
      ? 1000
      : 20000 + Math.floor(Math.random() * 10000);

  setTimeout(() => {
    gameState.currentPhase = "cult_ritual_resolved";
    switch (chosenCard) {
      case "cult_guns_stash":
        gameState.phaseData = {
          currentPhase: "cult_ritual_resolved",
          title: "مراسم فرقه",
          type: "see",
          gunReceivers: null,
          ritualType: "cult_guns_distributed",
          phaseSeen: [],
        };
        break;
      case "cult_cabin_search":
        gameState.phaseData = {
          currentPhase: "cult_ritual_resolved",
          title: "مراسم فرقه: دیدن نقش های کابین",
          type: "see",
          ritualType: "cult_cabin_search",
          phaseSeen: [],
        };
        break;
      case "cult_conversion":
        gameState.phaseData = {
          currentPhase: "cult_ritual_resolved",
          title: "مراسم فرقه‌",
          type: "see",
          ritualType: "cult_conversion_target_selected",
          phaseSeen: [],
        };
        break;
    }
    gameState.nextPhaseData = { emergency: false };
    updateAndBroadcastGame(
      games,
      gameId,
      gameState,
      roomId,
      room,
      userSocketMap,
      io
    );
  }, randomDelay);
}

module.exports = handleCultLeaderEliminated;
