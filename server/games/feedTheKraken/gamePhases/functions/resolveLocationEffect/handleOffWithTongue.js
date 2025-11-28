/**
 * مدیریت افکت بریدن زبان (off_with_tongue)
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} targetPlayer - بازیکن هدف
 */
function handleOffWithTongue(gameState, targetPlayer) {
  targetPlayer.tongueOff = true;

  gameState.logs.push({
    type: "effect",
    text: `😶 زبان ${targetPlayer.name} بریده شد. دیگر نمی‌تواند صحبت کند یا کاپیتان شود.`,
  });

  gameState.phaseData = {
    currentPhase: "location_effect_resolved",
    title: "بریدن زبان",
    type: "see",
    phaseSeen: [],
    nodeType: "off_with_tongue",
    targetPlayerName: targetPlayer.name,
    noLocationEffect: false,
  };
}

module.exports = handleOffWithTongue;
