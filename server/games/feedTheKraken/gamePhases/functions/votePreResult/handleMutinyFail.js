/**
 * مدیریت حالت شکست شورش (تفنگ کافی نیست)
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {number} totalGuns - مجموع تفنگ‌های استفاده شده
 * @param {number} requiredGuns - تعداد تفنگ لازم برای موفقیت شورش
 */
function handleMutinyFail(gameState, totalGuns, requiredGuns) {
  gameState.logs.push({
    type: "event",
    text: `❌ شورش شکست خورد. تفنگ‌ها به بازیکنان بازگشت.`,
  });
  gameState.logs.push({
    type: "event",
    text: `فاز ناوبری شروع میشود.`,
  });
  gameState.currentPhase = "mutiny_fail";
  gameState.phaseData = {
    currentPhase: "mutiny_fail",
    title: "نتیجه رای گیری",
    type: "see",
    phaseSeen: [],
    totalGuns,
    requiredGuns,
  };
}

module.exports = handleMutinyFail;
