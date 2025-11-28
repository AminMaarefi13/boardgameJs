const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");

/**
 * ثبت انتخاب کارت شلاق توسط کاپیتان و به‌روزرسانی وضعیت بازی
 * @param {Map} games - لیست بازی‌ها
 * @param {string} gameId - شناسه بازی
 * @param {Map} rooms - لیست روم‌ها
 * @param {Map} userSocketMap - نگاشت بازیکن به سوکت
 * @param {Object} io - شیء سوکت اصلی
 * @param {Object} preparedData - داده‌های آماده شده (در این فاز استفاده نمی‌شود)
 * @param {Object} eventSpecificData - داده‌های خاص رویداد (شامل chosenCard و targetPlayerId)
 */
async function selectFloggingCard(
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

  const { chosenCard, targetPlayerId } = eventSpecificData;

  // پیدا کردن بازیکن هدف
  const targetPlayer = gameState.players.find((p) => p.id === targetPlayerId);
  if (!targetPlayer) return;

  // ثبت کارت انتخابی توسط کاپیتان
  targetPlayer.isNotARole = chosenCard;

  // تنظیم داده‌های فاز برای نمایش به همه بازیکنان
  gameState.currentPhase = "location_effect_resolved";
  gameState.phaseData = {
    currentPhase: "location_effect_resolved",
    title: "من ... نیستم",
    type: "see",
    phaseSeen: [],
    nodeType: "flogging",
    chosenCard,
    targetPlayerName: targetPlayer.name,
    noLocationEffect: false,
    message: `مشخص شد که: \n
        ${targetPlayer.name} ${chosenCard} نیست \n
        مرحله بعد: اثر کارت`,
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

module.exports = {
  selectFloggingCard,
};
// const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
// const {
//   updateAndBroadcastGame,
// } = require("../../../utils/updateAndBroadcastGame");

// async function selectFloggingCard(
//   games,
//   gameId,
//   rooms,
//   userSocketMap,
//   io,
//   preparedData,
//   eventSpecificData
// ) {
//   const { game, room, roomId, gameState } = getValidGameAndRoom({
//     gameId,
//     games,
//     rooms,
//   });
//   const { chosenCard, targetPlayerId } = eventSpecificData;

//   const targetPlayer = gameState.players.find((p) => p.id === targetPlayerId);
//   // console.log("targetPlayer");
//   // console.log(targetPlayer);
//   if (!targetPlayer) return;
//   targetPlayer.isNotARole = chosenCard;
//   gameState.currentPhase = "location_effect_resolved";
//   gameState.phaseData = {
//     currentPhase: "location_effect_resolved",
//     title: "من ... نیستم",
//     type: "see",
//     phaseSeen: [],
//     nodeType: "flogging",
//     chosenCard,
//     targetPlayerName: targetPlayer.name,
//     noLocationEffect: false,
//     message: `مشخص شد که: \n
//         ${targetPlayerName} ${chosenCard} نیست \n
//         مرحله بعد: اثر کارت`,
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

// module.exports = {
//   selectFloggingCard,
// };
