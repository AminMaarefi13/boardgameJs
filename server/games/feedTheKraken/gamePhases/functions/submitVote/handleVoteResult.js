/**
 * آماده‌سازی و ثبت نتایج رأی‌گیری در صورت تکمیل رأی‌ها
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Array} submittedVotes - لیست کسانی که رأی داده‌اند
 * @param {string} sessionId - شناسه سشن رأی‌گیری
 */
function handleVoteResult(gameState, submittedVotes, sessionId) {
  gameState.currentPhase = "vote_pre_result";
  const result = submittedVotes.map((p) => {
    const vote = p.votes.find((v) => v.voteSessionId === sessionId);
    return {
      playerId: p.id,
      nickname: p.name,
      gunsUsed: vote?.gunsUsed ?? 0,
    };
  });

  gameState.phaseData = {
    phase: "vote_pre_result",
    title: "تعداد تفنگ های هر بازیکن",
    type: "see",
    phaseSeen: [],
    result,
  };
  gameState.nextPhaseData = {
    result,
  };
}

module.exports = handleVoteResult;
