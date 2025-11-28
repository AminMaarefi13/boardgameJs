/**
 * حرکت کشتی به موقعیت جدید و ثبت لاگ
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {number} nextNodeId - موقعیت جدید
 */
function handleMoveShip(gameState, nextNodeId) {
  gameState.mapPosition = nextNodeId;
  gameState.logs.push({
    type: "phase",
    text: `🚢 کشتی به موقعیت جدید (${nextNodeId}) حرکت کرد.`,
  });
}

module.exports = handleMoveShip;
