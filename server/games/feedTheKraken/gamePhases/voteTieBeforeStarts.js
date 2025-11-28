const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");

async function voteTieBeforeStart(
  games,
  gameId,
  rooms,
  userSocketMap,
  io,
  preparedData,
  eventSpecificData
) {
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });

  // آماده‌سازی داده‌های فاز بعدی (شروع حذف)
  gameState.currentPhase = "vote_tie_break";
  gameState.phaseData = {
    currentPhase: "vote_tie_break",
    title: "حذف بازیکن از تساوی شورش",
    type: "see",
    tiedPlayers: gameState.nextPhaseData?.tiedPlayers,
    eliminatorId: gameState.nextPhaseData?.eliminatorId,
    phaseSeen: [],
  };

  console.log("VoteTieBeforeStart: phaseData", gameState.phaseData);
  console.log("VoteTieBeforeStart: nextPhaseData", gameState.nextPhaseData);

  gameState.logs.push({
    type: "phase",
    text: `🟰 تساوی در رأی‌ها! حذف بازیکن توسط کاپیتان آغاز شد.`,
  });

  updateAndBroadcastGame(
    games,
    gameId,
    gameState,
    roomId,
    room,
    userSocketMap,
    io
  );
}

module.exports = voteTieBeforeStart;
