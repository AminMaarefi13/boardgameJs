/**
 * مدیریت انتخاب کارت توسط ناوبر (navigator)
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} params
 * @param {Object} params.chosenCard - کارت انتخابی
 * @param {Object} params.discardedCard - کارت دورریخته شده
 * @param {boolean} params.emergency - آیا حالت اضطراری است؟
 */
function handleNavigator(gameState, { chosenCard, discardedCard, emergency }) {
  if (!emergency) {
    // حالت عادی: کارت انتخابی به بازی اضافه می‌شود
    gameState.playedNavCards.push(chosenCard);
    gameState.discardPile.push(discardedCard);

    const captain = gameState.players.find(
      (pl) => pl.id === gameState.captainId
    );
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
  } else {
    // حالت اضطراری: ناوبر حذف می‌شود
    gameState.discardPile.push(chosenCard);
    gameState.discardPile.push(discardedCard);

    const navigator = gameState.players.find(
      (p) => p.id === gameState.navigatorId
    );
    const eliminatedId = navigator.id;
    navigator.eliminated = true;
    gameState.navigatorId = null;
    gameState.logs.push({
      type: "event",
      text: `کشتیران هیچ کارتی رو انتخاب نکرد و خودشو پرت کرد تو آب. مرحله بعد: تشکیل کابینه اضطراری`,
    });
    gameState.currentPhase = "navigator_denial";
    gameState.phaseData = {
      currentPhase: "navigator_denial",
      title: "حذف ناوبر",
      type: "see",
      eliminatedId,
      phaseSeen: [],
    };
    gameState.nextPhaseData = {
      emergency: true,
    };
  }
}

module.exports = handleNavigator;
