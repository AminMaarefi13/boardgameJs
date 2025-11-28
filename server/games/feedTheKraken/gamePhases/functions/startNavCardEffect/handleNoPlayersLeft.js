/**
 * مدیریت حالت فقط یک بازیکن زنده (اثر کارت اجرا نمی‌شود)
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {string} cardType - نوع کارت
 */
function handleNoPlayersLeft(gameState, cardType) {
  gameState.currentPhase = cardType;
  gameState.phaseData = {
    currentPhase: cardType,
    title: "اثر کارت انجام نمی شود",
    type: "see",
    phaseSeen: [],
    noPlayersLeft: true,
  };
  gameState.nextPhaseData = {
    emergency: false,
  };
}

module.exports = handleNoPlayersLeft;
