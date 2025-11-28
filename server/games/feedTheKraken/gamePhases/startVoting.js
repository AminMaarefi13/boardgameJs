const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");

/**
 * شروع فاز رای‌گیری کابینه
 * این تابع فاز بازی را به رای‌گیری تغییر می‌دهد و یک سشن جدید رأی‌گیری ایجاد می‌کند.
 * @param {Map} games - لیست بازی‌ها
 * @param {string} gameId - شناسه بازی
 * @param {Map} rooms - لیست روم‌ها
 * @param {Map} userSocketMap - نگاشت بازیکن به سوکت
 * @param {Object} io - شیء سوکت اصلی
 * @param {Object} preparedData - داده‌های آماده شده (در این فاز استفاده نمی‌شود)
 * @param {Object} eventSpecificData - داده‌های خاص رویداد (در این فاز استفاده نمی‌شود)
 */
async function startVoting(
  games,
  gameId,
  rooms,
  userSocketMap,
  io,
  preparedData,
  eventSpecificData
) {
  // دریافت وضعیت فعلی بازی و روم
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });

  // پیدا کردن آبجکت کاپیتان
  const captain = gameState.players.find((p) => p.id === gameState.captainId);
  if (!captain) throw new Error("کاپیتان پیدا نشد.");

  // تغییر فاز به رای‌گیری
  gameState.currentPhase = "start_voting";

  // شروع یک سشن جدید رأی‌گیری
  gameState.voteSessionCount = (gameState.voteSessionCount || 0) + 1;
  gameState.currentVoteSessionId = gameState.voteSessionCount;

  // ارسال وضعیت جدید بازی به همه کلاینت‌ها
  updateAndBroadcastGame(
    games,
    gameId,
    gameState,
    roomId,
    room,
    userSocketMap,
    io
  );
}

module.exports = {
  startVoting,
};
