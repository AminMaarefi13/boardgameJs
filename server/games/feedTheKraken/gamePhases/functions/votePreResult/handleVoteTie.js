/**
 * مدیریت حالت تساوی در رأی‌ها (بیش از یک نفر بیشترین تفنگ را دارد)
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Array} topCandidates - لیست بازیکنان با بیشترین تفنگ
 * @param {number} totalGuns - مجموع تفنگ‌های استفاده شده
 * @param {number} requiredGuns - تعداد تفنگ لازم برای موفقیت شورش
 */
function handleVoteTie(gameState, topCandidates, totalGuns, requiredGuns) {
  // gameState.currentPhase = "vote_tie_break_start";
  gameState.currentPhase = "vote_tie_break_before_start";
  gameState.phaseData = {
    // currentPhase: "vote_tie_break_start",
    currentPhase: "vote_tie_break_before_start",
    title: "نتیجه رای گیری",
    type: "see",
    totalGuns,
    requiredGuns,
    topCandidates,
    phaseSeen: [],
  };
  gameState.nextPhaseData = {
    tiedPlayers: topCandidates.map((v) => ({
      id: v.playerId,
      name: v.nickname,
      gunsUsed: v.gunsUsed,
    })),
    eliminatorId: gameState.captainId,
  };
  gameState.logs.push({
    type: "phase",
    text: `🟰 تساوی در رأی‌ها! کاپیتان باید یکی از افراد را حذف کند.`,
  });
}

module.exports = handleVoteTie;
