const { createMockGame } = require("./createMockGame");

/**
 * ساخت یک gameState سفارشی با آپشن‌های متنوع
 * @param {Object} options
 * @returns {Object} gameState
 */
function buildCustomGameState(options = {}) {
  const gameState = createMockGame();

  // تغییر فاز بازی
  if (options.currentPhase) {
    gameState.currentPhase = options.currentPhase;
    if (gameState.phaseData) {
      gameState.phaseData.phase = options.currentPhase;
    }
  }

  // تغییر موقعیت نقشه
  if (typeof options.mapPosition === "number") {
    gameState.mapPosition = options.mapPosition;
  }

  // تعیین کاپیتان، افسر اول، کشتیران
  if (options.captainId) gameState.captainId = options.captainId;
  if (options.firstOfficerId) gameState.firstOfficerId = options.firstOfficerId;
  if (options.navigatorId) gameState.navigatorId = options.navigatorId;

  // تعیین وضعیت هر ویژگی دلخواه برای یک بازیکن خاص
  if (Array.isArray(options.setPlayerProps)) {
    options.setPlayerProps.forEach(({ id, ...props }) => {
      const player = gameState.players.find((p) => p.id === id);
      if (player) Object.assign(player, props);
    });
  }

  // حذف کردن n بازیکن (eliminate)
  if (options.eliminateCount) {
    let count = options.eliminateCount;
    let skipRole = options.eliminateSkipRole; // مثلا "cultLeader"
    for (let p of gameState.players) {
      if (count === 0) break;
      if (skipRole && p.role === skipRole) continue;
      p.eliminated = true;
      count--;
    }
  }

  // حذف کردن بازیکنان با آیدی خاص
  if (Array.isArray(options.eliminateByIds)) {
    for (let id of options.eliminateByIds) {
      const player = gameState.players.find((p) => p.id === id);
      if (player) player.eliminated = true;
    }
  }

  // تغییر نقش بازیکن خاص
  if (options.setRole && options.setRole.id && options.setRole.role) {
    const player = gameState.players.find((p) => p.id === options.setRole.id);
    if (player) player.role = options.setRole.role;
  }

  // تغییر هر ویژگی دلخواه در gameState
  if (options.override) {
    Object.assign(gameState, options.override);
  }

  // تغییر ویژگی‌های دلخواه برای phaseData
  if (options.phaseData) {
    Object.assign(gameState.phaseData, options.phaseData);
  }

  // تغییر ویژگی‌های دلخواه برای nextPhaseData
  if (options.nextPhaseData) {
    Object.assign(gameState.nextPhaseData, options.nextPhaseData);
  }

  // تغییر وضعیت هر ویژگی دلخواه برای کل بازیکنان
  if (options.setAllPlayersProps) {
    for (let p of gameState.players) {
      Object.assign(p, options.setAllPlayersProps);
    }
  }
  console.log("gameStateeeeeeeeeee");
  console.log(gameState);
  return gameState;
}

buildCustomGameState({
  currentPhase: "cabinet_formation",
  mapPosition: 3,
  captainId: "2",
  firstOfficerId: "3",
  navigatorId: "4",
  eliminateCount: 2,
  eliminateSkipRole: "cultLeader",
  eliminateByIds: ["1", "5"],
  setRole: { id: "2", role: "kraken" },
  setPlayerProps: [
    // { id: "1", eliminated: true, guns: 0 },
    { id: "3", role: "pirate", offDuty: true },
  ],
  setAllPlayersProps: { tongueOff: true },
  phaseData: { phase: "custom_phase", title: "تست" },
  nextPhaseData: { emergency: true },
  override: { gameStatus: "finished" },
});

module.exports = {
  buildCustomGameState,
};
