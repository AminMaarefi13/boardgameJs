const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const { proceedToNextPhase } = require("../proceedToNextPhase");

async function onPhaseSeen({
  gameId,
  socket,
  io,
  games,
  rooms,
  userSocketMap,
  gameController,
}) {
  const playerId = socket.user._id.toString();
  const name = socket.user.name || "نامشخص";
  console.log(`🔗 Phase seen by ${playerId} (${name})`);
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });
  console.log("phaseSeen");
  console.log(playerId);
  // پیدا کردن بازیکن فعلی
  const player = gameState.players.find(
    (p) => p.id === playerId && !p.eliminated
  );
  if (!player) return;

  // جلوگیری از تکرار
  if (gameState?.phaseData?.phaseSeen === undefined) {
    console.log("was undefined");
    gameState.phaseData.phaseSeen = [];
  }
  console.log("gameState?.phaseData?.phaseSeen");
  console.log(gameState?.phaseData?.phaseSeen);
  if (gameState.phaseData?.phaseSeen.includes(playerId)) return;
  console.log("continued...");
  gameState.phaseData.phaseSeen.push(playerId);
  await gameController.updateGame(gameId, gameState);

  // چک کن همه دیدن یا نه
  const alivePlayerIds = gameState.players
    .filter((p) => !p.eliminated) // یا هر شرطی برای بازیکن فعال
    .map((p) => p.id);
  console.log("alivePlayerIds");
  // console.log(alivePlayerIds);
  const allSeen = alivePlayerIds.every((id) =>
    gameState.phaseData.phaseSeen.includes(id)
  );
  console.log("allSeen");
  // console.log(allSeen);
  const progress = {
    current: gameState.phaseData.phaseSeen.length,
    total: alivePlayerIds.length,
  };

  gameState.phaseData.current = progress.current;
  gameState.phaseData.total = progress.total;

  console.log("progress");
  console.log(progress);
  updateAndBroadcastGame(
    games,
    gameId,
    gameState,
    roomId,
    room,
    userSocketMap,
    io
  );
  if (allSeen) {
    proceedToNextPhase({
      games,
      gameState,
      gameId,
      roomId,
      rooms,
      userSocketMap,
      io,
      eventSpecificData: "",
    });
  }
}

module.exports = {
  onPhaseSeen,
};
