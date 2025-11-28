const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const handleEmergencyPhase = require("./functions/startCabinetFormationPhase/handleEmergencyPhase");
const handleNormalPhase = require("./functions/startCabinetFormationPhase/handleNormalPhase");

/**
 * شروع فاز تشکیل کابینه (عادی یا اضطراری)
 * این تابع بر اساس وضعیت emergency، منطق مربوط به هر حالت را اجرا می‌کند.
 * - اگر emergency فعال باشد، فقط انتخاب کشتیران مجاز است.
 * - اگر emergency فعال نباشد، انتخاب افسر اول و کشتیران مجاز است.
 * @param {Map} games - لیست بازی‌ها
 * @param {string} gameId - شناسه بازی
 * @param {Map} rooms - لیست روم‌ها
 * @param {Map} userSocketMap - نگاشت بازیکن به سوکت
 * @param {Object} io - شیء سوکت اصلی
 * @param {Object} preparedData - داده‌های آماده شده (شامل emergency)
 * @param {Object} eventSpecificData - داده‌های خاص رویداد (در این فاز استفاده نمی‌شود)
 */
async function startCabinetFormationPhase(
  games,
  gameId,
  rooms,
  userSocketMap,
  io,
  preparedData,
  eventSpecificData
) {
  // استخراج وضعیت emergency از داده‌های ورودی
  const { emergency } = preparedData;

  // دریافت وضعیت فعلی بازی و روم
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });

  // پیدا کردن آبجکت کاپیتان
  const captain = gameState.players.find((p) => p.id === gameState.captainId);
  if (!captain) throw new Error("کاپیتان پیدا نشد.");

  // اجرای منطق بر اساس حالت emergency یا normal
  switch (emergency) {
    case true:
      handleEmergencyPhase(gameState, captain);
      break;
    default:
      handleNormalPhase(gameState, captain);
      break;
  }

  // به‌روزرسانی فاز فعلی بازی
  gameState.currentPhase = "cabinet_formation";

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
  startCabinetFormationPhase,
};

// const {
//   updateAndBroadcastGame,
// } = require("../../../utils/updateAndBroadcastGame");
// const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
// const handleEmergencyPhase = require("./functions/startCabinetFormationPhase/handleEmergencyPhase");
// const handleNormalPhase = require("./functions/startCabinetFormationPhase/handleNormalPhase");

// async function startCabinetFormationPhase(
//   games,
//   gameId,
//   rooms,
//   userSocketMap,
//   io,
//   preparedData,
//   eventSpecificData
// ) {
//   const { emergency } = preparedData;
//   const { game, room, roomId, gameState } = getValidGameAndRoom({
//     gameId,
//     games,
//     rooms,
//   });
//   const captain = gameState.players.find((p) => p.id === gameState.captainId);
//   if (!captain) throw new Error("کاپیتان پیدا نشد.");

//   // سوییچ بر اساس حالت
//   switch (emergency) {
//     case true:
//       handleEmergencyPhase(gameState, captain);
//       break;
//     default:
//       handleNormalPhase(gameState, captain);
//       break;
//   }

//   gameState.currentPhase = "cabinet_formation";

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
//   startCabinetFormationPhase,
// };
// // const {
// //   updateAndBroadcastGame,
// // } = require("../../../utils/updateAndBroadcastGame");
// // const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");

// // async function startCabinetFormationPhase(
// //   games,
// //   gameId,
// //   rooms,
// //   userSocketMap,
// //   io,
// //   preparedData,
// //   eventSpecificData
// // ) {
// //   const { emergency } = preparedData;
// //   // console.log("emergency");
// //   // console.log(emergency);
// //   const { game, room, roomId, gameState } = getValidGameAndRoom({
// //     gameId,
// //     games,
// //     rooms,
// //   });
// //   const captain = gameState.players.find((p) => p.id === gameState.captainId);
// //   if (!captain) throw new Error("کاپیتان پیدا نشد.");
// //   // console.log("captain");
// //   // console.log(captain);

// //   let selectablePlayers;
// //   if (emergency) {
// //     selectablePlayers = gameState.players.map((p) => {
// //       let disabledReason = null;

// //       if (p.id === gameState.captainId) {
// //         disabledReason = "کاپیتان نمی‌تواند خودش را انتخاب کند!";
// //       } else if (p.eliminated) {
// //         disabledReason = "بازیکن از بازی حذف شده است";
// //       } else if (p.id === gameState.firstOfficerId) {
// //         disabledReason = "افسر اول را نمیتوان به عنوان کشتیران انتخاب کرد.";
// //       } else if (p.tongueOff) {
// //         disabledReason = "بازیکنی که زبانش بریده شده نمیتواند کاپیتان باشد.";
// //       }

// //       return {
// //         id: p.id,
// //         name: p.name,
// //         seat: p.seat,
// //         disabled: Boolean(disabledReason),
// //         disabledReason,
// //       };
// //     });
// //     gameState.phaseData = {
// //       currentPhase: "cabinet_formation",
// //       step: "waitingForCabinet",
// //       title: "تشکیل کابینه اضطراری",
// //       emergency: true,
// //       // message: "کاپیتان در حال انتخاب کشتیران است...",
// //     };
// //     captain.privatePhaseData = {
// //       currentPhase: "cabinet_formation",
// //       step: "waitingForCabinet",
// //       selectablePlayers,
// //       emergency: true,
// //       title: "تشکیل کاببینه اضطراری",
// //       message: "شما باید یک کشتیران را انتخاب کنید.",
// //     };

// //     gameState.logs.push({
// //       type: "phase",
// //       text: `📋 کاپیتان باید یک کشتیران برای کابینه اضطراری انتخاب کند.`,
// //     });
// //   } else {
// //     gameState.firstOfficerId = null;
// //     gameState.navigatorId = null;

// //     selectablePlayers = gameState.players.map((p) => {
// //       let disabledReason = null;

// //       if (p.id === gameState.captainId) {
// //         disabledReason = "کاپیتان نمی‌تواند خودش را انتخاب کند!";
// //       } else if (p.eliminated) {
// //         disabledReason = "بازیکن از بازی حذف شده است";
// //       } else if (p.offDuty) {
// //         disabledReason = "بازیکن در کابینه قبلی حضور داشته است (off-duty).";
// //       } else if (p.tongueOff) {
// //         disabledReason = "بازیکنی که زبانش بریده شده نمیتواند کاپیتان باشد.";
// //       }

// //       return {
// //         id: p.id,
// //         name: p.name,
// //         seat: p.seat,
// //         disabled: Boolean(disabledReason),
// //         disabledReason,
// //       };
// //     });

// //     const enabledCount = selectablePlayers.filter((p) => !p.disabled).length;

// //     if (enabledCount <= 1) {
// //       selectablePlayers = selectablePlayers.map((p) => {
// //         if (
// //           p.disabled &&
// //           p.disabledReason &&
// //           p.disabledReason.includes("کابینه قبلی")
// //         ) {
// //           return {
// //             ...p,
// //             disabled: false,
// //             disabledReason: null,
// //           };
// //         }
// //         return p;
// //       });
// //     }

// //     gameState.phaseData = {
// //       currentPhase: "cabinet_formation",
// //       step: "waitingForCabinet",
// //       title: "تشکیل کاببینه",
// //       emergency: false,
// //       // message: "کاپیتان در حال انتخاب افسر اول و کشتیران است...",
// //     };
// //     captain.privatePhaseData = {
// //       currentPhase: "cabinet_formation",
// //       step: "waitingForCabinet",
// //       selectablePlayers,
// //       emergency: false,
// //       title: "تشکیل کاببینه",
// //       message: "شما باید یک افسر اول و یک کشتیران را انتخاب کنید.",
// //     };

// //     gameState.logs.push({
// //       type: "phase",
// //       text: `📋 کاپیتان باید یک افسر اول و یک کشتیران انتخاب کند.`,
// //     });
// //   }

// //   gameState.currentPhase = "cabinet_formation";
// //   // console.log("gameState");
// //   // console.log(gameState);

// //   updateAndBroadcastGame(
// //     games,
// //     gameId,
// //     gameState,
// //     roomId,
// //     room,
// //     userSocketMap,
// //     io
// //   );
// // }

// // module.exports = {
// //   startCabinetFormationPhase,
// // };
