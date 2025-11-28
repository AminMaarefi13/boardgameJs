/**
 * مدیریت تصمیم "discard" (دور انداختن کارت تلسکوپ)
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} card - کارت تلسکوپ
 */
function handleDiscard(gameState, card) {
  gameState.navigationDeck.pop(); // حذف کارت از دسته
  gameState.discardPile.push(card); // افزودن به کارت‌های دور ریخته شده
}

module.exports = handleDiscard;
