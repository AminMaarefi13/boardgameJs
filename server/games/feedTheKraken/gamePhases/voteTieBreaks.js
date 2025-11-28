const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");

async function voteTieBreak(
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
  console.log("preparedData");
  console.log(preparedData);
  console.log("eventSpecificData");
  console.log(eventSpecificData);
  let tiedPlayers = eventSpecificData?.tiedPlayers;

  let eliminatedId = eventSpecificData?.eliminatedId || gameState.captainId;
  console.log("VoteTieBreak: START", {
    tiedPlayers,
    eliminatedId,
  });
  // اگر باید حذف انجام شود، اول حذف کن
  if (eliminatedId) {
    tiedPlayers = tiedPlayers.filter((p) => p.id !== eliminatedId);
    const eliminated = gameState.players.find((p) => p.id === eliminatedId);
    gameState.logs.push({
      type: "phase",
      text: `🚫 بازیکن ${eliminated.name} حذف شد.`,
    });
    console.log("VoteTieBreak: PLAYER REMOVED", eliminated);
  }

  // حالا بعد از حذف، اگر فقط یک نفر باقی مانده، او کاپیتان جدید است
  if (tiedPlayers.length === 1) {
    const newCaptain = gameState.players.find(
      (p) => p.id === tiedPlayers[0].id
    );

    gameState.captainId = newCaptain.id;
    gameState.players.forEach((p) => {
      p.isCaptain = p.id === newCaptain.id;
    });
    gameState.logs.push({
      type: "event",
      text: `🎖 ${newCaptain.name} کاپیتان جدید شد.`,
    });
    const eliminated = gameState.players.find((p) => p.id === eliminatedId);
    gameState.currentPhase = "vote_tie_break_resolved";
    gameState.phaseData = {
      currentPhase: "vote_tie_break_resolved",
      title: "نتیجه رای گیری",
      type: "see",
      newCaptain: newCaptain.name,
      tiedPlayers: tiedPlayers.map((p) => ({ id: p.id, name: p.name })),
      eliminatedName: eliminated?.name,
      phaseSeen: [],
    };
    gameState.nextPhaseData = { emergency: false };
    console.log("VoteTieBreak: NEW CAPTAIN", gameState.phaseData);
    updateAndBroadcastGame(
      games,
      gameId,
      gameState,
      roomId,
      room,
      userSocketMap,
      io
    );
    return;
  }

  // اگر هنوز بیش از یک نفر باقی مانده، حذف‌کننده جدید را ست کن (اولین نفر باقی‌مانده)
  if (tiedPlayers.length > 1) {
    // eliminatorId = tiedPlayers[0].id;
  }
  const eliminator = gameState.players.find((p) => p.id === eliminatedId);
  // آماده‌سازی داده برای حذف بعدی یا نمایش لیست جدید
  gameState.currentPhase = "vote_tie_break";
  gameState.phaseData = {
    currentPhase: "vote_tie_break",
    title: "تساوی تفنگ ها",
    tiedPlayers: tiedPlayers.map((p) => ({ id: p.id, name: p.name })),
    eliminatorId: eliminatedId,
    eliminatorName: eliminator.name,
    phaseSeen: [],
  };
  gameState.nextPhaseData = {
    tiedPlayers,
    eliminatorId: eliminatedId,
    eliminatorName: eliminator.name,
  };

  console.log("VoteTieBreak: phaseData", gameState.phaseData);
  console.log("VoteTieBreak: nextPhaseData", gameState.nextPhaseData);

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

module.exports = { voteTieBreak };
