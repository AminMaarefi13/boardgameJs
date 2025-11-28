/**
 * مدیریت حالت نبود ناوبر (navigator)
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Array} shuffledCards - کارت‌های شافل شده
 */
function handleNoNavigator(gameState, shuffledCards) {
  const chosenCard = shuffledCards[0];
  const discardedCard = shuffledCards[1];

  gameState.playedNavCards.push(chosenCard);
  gameState.discardPile.push(discardedCard);

  const captain = gameState.players.find((pl) => pl.id === gameState.captainId);
  captain.resume.push(chosenCard);

  gameState.currentPhase = "navigation_card_chosen";
  gameState.phaseData = {
    currentPhase: "navigation_card_chosen",
    title: "کارت انتخابی کشتیران",
    type: "see",
    chosenCard,
    phaseSeen: [],
  };
  gameState.nextPhaseData = {
    card: chosenCard,
  };
}

module.exports = handleNoNavigator;
