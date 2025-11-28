const handleNoPlayersLeft = require("./handleNoPlayersLeft");

/**
 * مدیریت اثر کارت "disarmed" (گرفتن تفنگ از ناوبر)
 * @param {Object} gameState - وضعیت فعلی بازی
 */
function handleDisarmed(gameState) {
  const navigator = gameState.players.find(
    (p) => p.id === gameState.navigatorId
  );
  gameState.currentPhase = "disarmed";
  if (navigator) {
    if (navigator.guns > 0) {
      navigator.guns -= 1;
      gameState.logs.push({
        type: "event",
        text: `🛑 یکی از تفنگ‌های کشتیران ${navigator.name} گرفته شد.`,
      });
      gameState.phaseData = {
        currentPhase: "disarmed",
        title: "گذاشتن تفنگ",
        type: "see",
        phaseSeen: [],
        navigatorName: navigator.name,
      };
    } else {
      gameState.logs.push({
        type: "event",
        text: `🛑 کشتیران ${navigator?.name} تفنگی نداشت که گرفته شود.`,
      });
      gameState.phaseData = {
        currentPhase: "disarmed",
        title: "گذاشتن تفنگ",
        type: "see",
        phaseSeen: [],
        message: `🛑 کشتیران ${navigator?.name} تفنگی نداشت که گرفته شود.`,
      };
    }
    gameState.nextPhaseData = {
      emergency: false,
    };
  } else {
    handleNoPlayersLeft(gameState, "disarmed");
  }
}

module.exports = handleDisarmed;
