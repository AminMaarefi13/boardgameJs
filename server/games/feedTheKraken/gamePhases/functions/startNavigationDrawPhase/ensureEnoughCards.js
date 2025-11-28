const { shuffle } = require("../../../../../utils/shuffle");

/**
 * اطمینان از کافی بودن کارت‌های مسیر و شافل کردن در صورت نیاز
 * @param {Object} gameState - وضعیت فعلی بازی
 * @throws اگر کارت کافی نباشد، خطا می‌دهد
 */
function ensureEnoughCards(gameState) {
  if (gameState.navigationDeck.length < 4) {
    // اگر کارت کافی نیست، discardPile را به deck اضافه کن و شافل کن
    gameState.navigationDeck = shuffle([
      ...gameState.navigationDeck,
      ...(gameState.discardPile || []),
    ]);
    gameState.discardPile = [];

    // اگر باز هم کارت کافی نبود، ارور بده
    if (gameState.navigationDeck.length < 4) {
      throw new Error("تعداد کارت‌های مسیر برای توزیع کافی نیست.");
    }
  }
}

module.exports = ensureEnoughCards;
