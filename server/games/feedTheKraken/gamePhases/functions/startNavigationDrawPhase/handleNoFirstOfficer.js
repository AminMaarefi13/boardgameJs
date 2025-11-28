const { shuffle } = require("../../../../../utils/shuffle");

/**
 * مدیریت حالت نبود افسر اول (کارت‌ها به صورت تصادفی انتخاب می‌شوند)
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Array} firstOfficerCards - کارت‌های افسر اول
 */
function handleNoFirstOfficer(gameState, firstOfficerCards) {
  const shuffled = shuffle(firstOfficerCards);
  const officerCardChosen = shuffled[0];
  const officerCardDiscarded = shuffled[1];
  gameState.nextPhaseData.officerCardChosen = officerCardChosen;
  gameState.nextPhaseData.officerCardDiscarded = officerCardDiscarded;
  gameState.nextPhaseData.officerSubmitted = true;
}

module.exports = handleNoFirstOfficer;
