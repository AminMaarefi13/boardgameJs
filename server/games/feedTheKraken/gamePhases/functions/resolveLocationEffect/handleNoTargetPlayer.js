/**
 * مدیریت حالت نبود بازیکن هدف (targetPlayer)
 * @param {Object} gameState - وضعیت فعلی بازی
 */
function handleNoTargetPlayer(gameState) {
  gameState.currentPhase = "location_effect_resolved";
  gameState.phaseData = {
    currentPhase: "location_effect_resolved",
    title: "بازیکنی وجود ندارد",
    type: "see",
    phaseSeen: [],
    noPlayersLeft: true,
    noLocationEffect: false,
  };
}

module.exports = handleNoTargetPlayer;
