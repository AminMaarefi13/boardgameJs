const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");

/**
 * آماده‌سازی انتخاب بازیکن برای افکت مکان توسط کاپیتان
 * این تابع لیست بازیکنان قابل انتخاب را برای افکت‌های خاص (مثل cabin_search, feed_the_kraken و ...) می‌سازد
 * و اطلاعات لازم را به صورت private برای کاپیتان ارسال می‌کند.
 * @param {Map} games - لیست بازی‌ها
 * @param {string} gameId - شناسه بازی
 * @param {Map} rooms - لیست روم‌ها
 * @param {Map} userSocketMap - نگاشت بازیکن به سوکت
 * @param {Object} io - شیء سوکت اصلی
 * @param {Object} preparedData - داده‌های آماده شده (در این فاز استفاده نمی‌شود)
 * @param {Object} eventSpecificData - داده‌های خاص رویداد (در این فاز استفاده نمی‌شود)
 */
function applyNodeEffect(
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

  // استخراج نوع افکت و موقعیت نود
  const { effect, nodeId } = gameState.nextPhaseData;

  // ساخت لیست بازیکنان قابل انتخاب برای افکت مکان
  const selectablePlayers = gameState.players.map((p) => {
    let disabledReason = null;

    // کاپیتان نمی‌تواند خودش را انتخاب کند
    if (p.id === gameState.captainId) {
      disabledReason = "کاپیتان نمی‌تواند خودش را انتخاب کند!";
    } else if (p.eliminated) {
      disabledReason = "بازیکنی که حذف شده قابل انتخاب نیست!";
    }

    return {
      id: p.id,
      name: p.name,
      seat: p.seat,
      disabled: Boolean(disabledReason),
      disabledReason,
    };
  });

  // تنظیم داده‌های فاز برای همه بازیکنان
  gameState.phaseData = {
    title: "انتخاب بازیکن برای افکت مکان توسط کاپیتان",
    effect,
  };

  // ارسال داده‌های خصوصی به کاپیتان
  const captain = gameState.players.find((p) => p.id === gameState.captainId);
  captain.privatePhaseData = {
    currentPhase: effect,
    title: "انتخاب بازیکن برای افکت مکان",
    selectablePlayers,
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
  applyNodeEffect,
};
// const {
//   updateAndBroadcastGame,
// } = require("../../../utils/updateAndBroadcastGame");
// const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");

// function applyNodeEffect(
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
//   const { effect, nodeId } = gameState.nextPhaseData;
//   // console.log("effect");
//   // console.log(effect);
//   // console.log("nodeId");
//   // console.log(nodeId);
//   // cabin_search
//   // feed_the_kraken
//   // off_with_tongue
//   // flogging
//   const selectablePlayers = gameState.players.map((p) => {
//     let disabledReason = null;

//     if (p.id === gameState.captainId) {
//       disabledReason = "کاپیتان نمی‌تواند خودش را انتخاب کند!";
//     } else if (p.eliminated) {
//       disabledReason = "بازیکنی که حذف شده قابل انتخاب نیست!";
//     }

//     return {
//       id: p.id,
//       name: p.name,
//       seat: p.seat,
//       disabled: Boolean(disabledReason),
//       disabledReason,
//     };
//   });

//   gameState.phaseData = {
//     title: "انتخاب بازیکن برای افکت مکان توسط کاپیتان",
//     // type: "see",
//     effect,
//     // message: `✨ افکت "${effect}" برای کاپیتان در حال انتخاب یک نفر  .`,
//   };
//   const captain = gameState.players.find((p) => p.id === gameState.captainId);

//   captain.privatePhaseData = {
//     currentPhase: effect,
//     title: "انتخاب بازیکن برای افکت مکان",
//     selectablePlayers,
//   };
//   // console.log(gameState);
//   // console.log(captain);
//   // console.log("gameState");
//   // console.log("captain");

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
//   applyNodeEffect,
// };
