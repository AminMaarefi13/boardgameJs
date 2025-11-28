const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");

/**
 * ثبت مشاهده کارت‌های پری دریایی توسط بازیکن و به‌روزرسانی وضعیت بازی
 * @param {Map} games - لیست بازی‌ها
 * @param {string} gameId - شناسه بازی
 * @param {Map} rooms - لیست روم‌ها
 * @param {Map} userSocketMap - نگاشت بازیکن به سوکت
 * @param {Object} io - شیء سوکت اصلی
 * @param {Object} preparedData - داده‌های آماده شده (در این فاز استفاده نمی‌شود)
 * @param {Object} eventSpecificData - داده‌های خاص رویداد (شامل playerId)
 */
async function mermaidCardsSeen(
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

  // استخراج شناسه بازیکن از داده‌های رویداد
  const { playerId } = eventSpecificData;
  const player = gameState.players.find((p) => p.id === playerId);

  // اگر بازیکن معتبر نبود، خروج
  if (!player) return;

  // تنظیم وضعیت فاز و داده‌های نمایشی برای همه بازیکنان
  gameState.currentPhase = "mermaid_seen";
  gameState.phaseData = {
    currentPhase: "mermaid_seen",
    title: "پری دریایی",
    type: "see",
    phaseSeen: [],
    // message: "کارت ها دیده شدن مرحله بعد: تشکیل کابینه",
  };
  gameState.nextPhaseData = {
    emergency: false,
  };

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

module.exports = { mermaidCardsSeen };
// const {
//   updateAndBroadcastGame,
// } = require("../../../utils/updateAndBroadcastGame");
// const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");

// async function mermaidCardsSeen(
//   games,
//   gameId,
//   rooms,
//   userSocketMap,
//   io,
//   preparedData,
//   eventSpecificData
// ) {
//   // console.log("MermaidSeen");
//   const { game, room, roomId, gameState } = getValidGameAndRoom({
//     gameId,
//     games,
//     rooms,
//   });
//   const { playerId } = eventSpecificData;
//   const player = gameState.players.find((p) => p.id === playerId);
//   // console.log(playerId);
//   if (!player) return;
//   gameState.currentPhase = "mermaid_seen";
//   gameState.phaseData = {
//     currentPhase: "mermaid_seen",
//     title: "پری دریایی",
//     type: "see",
//     phaseSeen: [],
//     // message: "کارت ها دیده شدن مرحله بعد: تشکیل کابینه",
//   };
//   gameState.nextPhaseData = {
//     emergency: false,
//   };
//   updateAndBroadcastGame(
//     games,
//     gameId,
//     gameState,
//     roomId,
//     room,
//     userSocketMap,
//     io
//   );
// }

// module.exports = { mermaidCardsSeen };
