/**
 * مدیریت حالت وجود افسر اول (ارسال کارت‌ها به افسر اول)
 * @param {Object} firstOfficer - آبجکت افسر اول
 * @param {Array} firstOfficerCards - کارت‌های افسر اول
 * @param {string} firstOfficerId - شناسه افسر اول
 */
function handleWithFirstOfficer(
  firstOfficer,
  firstOfficerCards,
  firstOfficerId
) {
  firstOfficer.privatePhaseData = {
    currentPhase: "navigation_cards_draw",
    title: "انتخاب کارت ناوبری",
    firstOfficerId,
    cabinRole: "firstOfficer",
    cards: firstOfficerCards,
  };
}

module.exports = handleWithFirstOfficer;
