/**
 * مدیریت افکت مکان و ثبت وضعیت فاز
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} nextNode - نود مقصد
 * @param {number} nextNodeId - موقعیت جدید
 */
function handleLocationEffect(gameState, nextNode, nextNodeId) {
  const effect = nextNode.effect;
  gameState.currentPhase = `${effect}_effect`;
  gameState.logs.push({
    type: "phase",
    text: `✨ افکت "${effect}" فعال شد.`,
  });
  gameState.phaseData = {
    title: "افکت مکان",
    type: "see",
    effect,
    phaseSeen: [],
  };
  gameState.nextPhaseData = {
    effect,
    nodeId: nextNodeId,
  };
}

module.exports = handleLocationEffect;
