const handleNoPlayersLeft = require("./handleNoPlayersLeft");

/**
 * مدیریت اثر کارت "armed" (دادن تفنگ به ناوبر)
 * @param {Object} gameState - وضعیت فعلی بازی
 */
function handleArmed(gameState) {
  const navigator = gameState.players.find(
    (p) => p.id === gameState.navigatorId
  );
  if (navigator) {
    navigator.guns += 1;
    gameState.logs.push({
      type: "event",
      text: `🔫 ناوبر ${navigator.name} یک تفنگ دریافت کرد.`,
    });
    gameState.currentPhase = "armed";
    gameState.phaseData = {
      currentPhase: "armed",
      title: "برداشتن تفنگ",
      type: "see",
      phaseSeen: [],
      navigatorName: navigator?.name,
    };
    gameState.nextPhaseData = {
      emergency: false,
    };
  } else {
    handleNoPlayersLeft(gameState, "armed");
  }
}

module.exports = handleArmed;
