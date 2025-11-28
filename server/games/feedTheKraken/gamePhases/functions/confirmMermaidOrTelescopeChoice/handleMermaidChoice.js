/**
 * مدیریت انتخاب پری دریایی (ارسال سه کارت دورریخته شده اخیر به بازیکن)
 * @param {Object} gameState
 * @param {Object} targetPlayer
 */
function handleMermaidChoice(gameState, targetPlayer) {
  // سه کارت آخر دیسکارد را شافل کن
  const discarded = [...gameState.discardPile];
  const lastThree = discarded.slice(-3).sort(() => Math.random() - 0.5);

  gameState.currentPhase = "mermaid_choice";
  gameState.phaseData = {
    currentPhase: "mermaid_choice",
    title: "پری دریایی",
    targetPlayerName: targetPlayer.name,
    targetPlayerId: targetPlayer.id,
  };
  targetPlayer.privatePhaseData = {
    cards: lastThree,
    type: "mermaid_choice",
    targetPlayerId: targetPlayer.id,
  };
}

module.exports = handleMermaidChoice;
