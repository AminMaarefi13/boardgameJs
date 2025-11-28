/**
 * بررسی شرایط رأی دادن بازیکن و ارسال پیام خطا در صورت نیاز
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} player - آبجکت بازیکن
 * @param {string} playerId - شناسه بازیکن
 * @param {string} sessionId - شناسه سشن رأی‌گیری
 * @param {Map} userSocketMap - نگاشت بازیکن به سوکت
 * @param {Object} io - شیء سوکت اصلی
 * @returns {boolean} - آیا بازیکن مجاز به رأی دادن است؟
 */
function checkVoteEligibility(
  gameState,
  player,
  playerId,
  sessionId,
  userSocketMap,
  io
) {
  const socketId = userSocketMap.get(playerId);

  // چک: در فاز رأی‌گیری باشیم
  if (gameState.currentPhase !== "start_voting") {
    io.to(socketId).emit(
      "error_message",
      "در حال حاضر امکان رأی دادن وجود ندارد."
    );
    return false;
  }

  // چک: کاپیتان نمی‌تواند رأی دهد
  if (playerId === gameState.captainId) {
    io.to(socketId).emit("error_message", "شما اجازه رأی دادن ندارید.");
    return false;
  }

  // چک: قبلاً رأی داده؟
  const alreadyVoted = player.votes.some((v) => v.voteSessionId === sessionId);
  if (alreadyVoted) {
    io.to(socketId).emit("error_message", "شما قبلاً رأی داده‌اید.");
    return false;
  }

  return true;
}

module.exports = checkVoteEligibility;
