/**
 * ساخت آبجکت رأی برای بازیکن
 * @param {Object} player - آبجکت بازیکن
 * @param {string} playerId - شناسه بازیکن
 * @param {number} gunsUsed - تعداد تفنگ استفاده شده
 * @param {string} sessionId - شناسه سشن رأی‌گیری
 * @param {boolean} isEligible - آیا بازیکن مجاز است؟
 * @returns {Object} voteEntry - آبجکت رأی
 */
function buildVoteEntry(player, playerId, gunsUsed, sessionId, isEligible) {
  return {
    voteSessionId: sessionId,
    playerId,
    nickname: player.name,
    gunsUsed: isEligible ? gunsUsed : 0,
    seen: false,
    timestamp: new Date(),
    eligible: isEligible,
  };
}

module.exports = buildVoteEntry;
