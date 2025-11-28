/**
 * به‌روزرسانی وضعیت رأی‌گیری و ارسال به کلاینت‌ها
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Array} eligibleVoters - لیست رأی‌دهندگان مجاز
 * @param {Array} submittedVotes - لیست کسانی که رأی داده‌اند
 */
function updateVoteProgress(gameState, eligibleVoters, submittedVotes) {
  const progress = {
    current: submittedVotes.length,
    total: eligibleVoters.length,
  };

  gameState.phaseData = {
    currentPhase: "start_voting",
    title: "انتخاب کارت ناوبری",
    message: `vote_result - ${progress.current}/${progress.total}`,
    current: progress.current,
    total: progress.total,
  };
  gameState.currentPhase = "start_voting";
}

module.exports = updateVoteProgress;
