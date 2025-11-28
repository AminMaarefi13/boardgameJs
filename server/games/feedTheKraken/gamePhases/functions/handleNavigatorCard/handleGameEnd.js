/**
 * مدیریت پایان بازی و ثبت برنده
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} nextNode - نود مقصد
 */
function handleGameEnd(gameState, nextNode) {
  gameState.currentPhase = "game_over";
  gameState.phaseData = {};
  gameState.winner = nextNode.winner;
  gameState.logs.push({
    type: "event",
    text: `🏁 بازی به پایان رسید. جناح برنده: ${nextNode.winner}`,
  });
  gameState.phaseData = {
    currentPhase: "game_over",
    title: "پایان بازی",
    winner: nextNode.winner,
  };
}

module.exports = handleGameEnd;
