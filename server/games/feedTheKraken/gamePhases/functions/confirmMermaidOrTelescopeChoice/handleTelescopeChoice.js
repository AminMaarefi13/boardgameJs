/**
 * مدیریت انتخاب تلسکوپ (ارسال کارت بالای Deck به بازیکن)
 * @param {Object} gameState
 * @param {Object} targetPlayer
 */
function handleTelescopeChoice(gameState, targetPlayer) {
  const topCard = gameState.navigationDeck[gameState.navigationDeck.length - 1];
  console.log("topCard");
  console.log(topCard);
  console.log("gameState.navigationDeck");
  console.log(gameState.navigationDeck);

  gameState.currentPhase = "telescope_choice";
  gameState.phaseData = {
    currentPhase: "telescope_choice",
    title: "تلسکوپ",
    targetPlayerName: targetPlayer.name,
    targetPlayerId: targetPlayer.id,
  };
  targetPlayer.privatePhaseData = {
    card: topCard,
    type: "telescope_choice",
    targetPlayerId: targetPlayer.id,
  };
}

module.exports = handleTelescopeChoice;
