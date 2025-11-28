const { shuffle } = require("../../../../../utils/shuffle");

/**
 * توزیع کارت‌های مسیر بین کاپیتان و افسر اول
 * @param {Object} gameState - وضعیت فعلی بازی
 * @returns {Object} - کارت‌های کاپیتان و افسر اول
 */
function dealNavigationCards(gameState) {
  const captainCards = gameState.navigationDeck.splice(-2);
  const firstOfficerCards = gameState.navigationDeck.splice(-2);

  if (gameState.navigationDeck.length <= 3) {
    // اگر کارت کافی نیست، discardPile را به deck اضافه کن و شافل کن
    gameState.navigationDeck = shuffle([
      ...gameState.navigationDeck,
      ...(gameState.discardPile || []),
    ]);
    gameState.discardPile = [];
  }
  return { captainCards, firstOfficerCards };
}

module.exports = dealNavigationCards;
