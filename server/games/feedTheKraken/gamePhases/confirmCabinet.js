const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const handleEmergencyCabinet = require("./functions/confirmCabinet/handleEmergencyCabinet");
const handleNormalCabinet = require("./functions/confirmCabinet/handleNormalCabinet");

/**
 * تایید کابینه (عادی یا اضطراری)
 * این تابع بر اساس وضعیت emergency، منطق مربوط به هر حالت را اجرا می‌کند.
 * @param {Map} games
 * @param {string} gameId
 * @param {Map} rooms
 * @param {Map} userSocketMap
 * @param {Object} io
 * @param {Object} preparedData
 * @param {Object} eventSpecificData
 */
async function confirmCabinet(
  games,
  gameId,
  rooms,
  userSocketMap,
  io,
  preparedData,
  eventSpecificData
) {
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });
  const { emergency, firstOfficerId, navigatorId } = eventSpecificData;

  // به‌روزرسانی نقش‌ها
  gameState.firstOfficerId = firstOfficerId;
  gameState.navigatorId = navigatorId;

  // پیدا کردن بازیکنان
  const captain = gameState.players.find((p) => p.id === gameState.captainId);
  const firstOfficer = firstOfficerId
    ? gameState.players.find((p) => p.id === firstOfficerId)
    : null;
  const navigator = navigatorId
    ? gameState.players.find((p) => p.id === navigatorId)
    : null;

  // اجرای منطق بر اساس حالت emergency یا normal
  if (emergency) {
    handleEmergencyCabinet(gameState, captain, firstOfficer, navigator);
  } else {
    handleNormalCabinet(gameState, captain, firstOfficer, navigator);
  }

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
  confirmCabinet,
};
// const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
// const {
//   updateAndBroadcastGame,
// } = require("../../../utils/updateAndBroadcastGame");

// async function confirmCabinet(
//   games,
//   gameId,
//   rooms,
//   userSocketMap,
//   io,
//   preparedData,
//   eventSpecificData
// ) {
//   // console.log("✅ رویداد confirm_cabinet دریافت شد");
//   const { game, room, roomId, gameState } = getValidGameAndRoom({
//     gameId,
//     games,
//     rooms,
//   });
//   const { emergency, firstOfficerId, navigatorId } = eventSpecificData;
//   // به‌روزرسانی gameState
//   gameState.firstOfficerId = firstOfficerId;
//   gameState.navigatorId = navigatorId;

//   // لاگ
//   const captain = gameState.players.find((p) => p.id === gameState.captainId);
//   const firstOfficer = gameState.firstOfficerId
//     ? gameState.players.find((p) => p.id === firstOfficerId)
//     : null;
//   const navigator = gameState.navigatorId
//     ? gameState.players.find((p) => p.id === navigatorId)
//     : null;

//   if (emergency) {
//     gameState.currentPhase = "emergency_cabinet_confirmed";
//     gameState.phaseData = {
//       currentPhase: "emergency_cabinet_confirmed",
//       type: "see",
//       title: "انتخاب های کاپیتان",
//       emergency: true,
//       phaseSeen: [],
//       // message: `🎖️ کاپیتان ${captain.name}
//       //       ${navigator.name} ر, به عنوان 🧭 کشتیران
//       //       انتخاب کرد.
//       //      علیه کابینه اضطراری نمیشه شورش کرد. پس مرحله بعد کارت های ناوبری پخش خواهد شد.`,
//     };
//     captain.privatePhaseData = {};

//     if (!firstOfficer && !navigator) {
//       gameState.currentPhase = "only_captain_cabinet_confirmed";
//       gameState.logs.push({
//         type: "only_captain_cabinet_confirmed",
//         text: `🎖️ کاپیتان ${captain.name}
//             افسر اول و کشتیران نداریم و یک کارت بصورت رندوم به جای افسر اول انتخاب خواهد شد.
//              از بین کارت انتخابی کاپیتان و کارت انتخابی افسر اول، یک کارت بصورت رندوم به عنوان انتخاب کشتیران انتخاب خواهد شد.`,
//       });
//     } else if (!firstOfficer) {
//       gameState.logs.push({
//         type: "emergency_cabinet_confirmed",
//         text: `🎖️ کاپیتان ${captain.name}
//             ${navigator.name} رو به عنوان 🧭 کشتیران
//             انتخاب کرد.
//             افسر اول نداریم و یک کارت بصورت رندوم به جای افسر انتخاب خواهد شد.
//             🗳️ حالا وقتشه کشتیران تصمیم بگیره که این کابینه رو قبول داره یا نه.`,
//       });
//     } else if (!navigator) {
//       gameState.logs.push({
//         type: "emergency_cabinet_confirmed",
//         text: `🎖️ کاپیتان ${captain.name}
//             ${firstOfficer.name} ر, به عنوان 👨‍✈️ افسر اول و
//             کشتیران نداریم و کارت ناوبری پس از انتخاب کاپیتان و افسر اول بصورت رندوم انتخاب خواهد شد.
//             🗳️ حالا وقتشه افسر اول تصمیم بگیره که این کابینه رو قبول داره یا نه.`,
//       });
//     } else if (firstOfficer && navigator) {
//       gameState.logs.push({
//         type: "emergency_cabinet_confirmed",
//         text: `🎖️ کاپیتان ${captain.name}
//             ${navigator.name} ر, به عنوان 🧭 کشتیران
//             انتخاب کرد.
//            علیه کابینه اضطراری نمیشه شورش کرد. پس مرحله بعد کارت های ناوبری پخش خواهد شد.`,
//       });
//     }
//   } else {
//     gameState.currentPhase = "cabinet_confirmed";
//     gameState.phaseData = {
//       currentPhase: "cabinet_confirmed",
//       type: "see",
//       title: "انتخاب های کاپیتان",
//       emergency: false,
//       phaseSeen: [],
//       // message: `🎖️ کاپیتان ${captain.name}
//       //       ${firstOfficer.name} ر, به عنوان 👨‍✈️ افسر اول و
//       //       ${navigator.name} ر, به عنوان 🧭 کشتیران
//       //       انتخاب کرد.
//       //       🗳️ حالا وقتشه تصمیم بگیرید که این کابینه ر, قبول دارید یا نه.`,
//     };
//     captain.privatePhaseData = {};

//     if (!firstOfficer && !navigator) {
//       gameState.currentPhase = "only_captain_cabinet_confirmed";
//       gameState.logs.push({
//         type: "only_captain_cabinet_confirmed",
//         emergency: false,
//         text: `🎖️ کاپیتان ${captain.name}
//             افسر اول و کشتیران نداریم و یک کارت بصورت رندوم به جای افسر اول انتخاب خواهد شد.
//              از بین کارت انتخابی کاپیتان و کارت انتخابی افسر اول، یک کارت بصورت رندوم به عنوان انتخاب کشتیران انتخاب خواهد شد.`,
//       });
//     } else if (!firstOfficer) {
//       gameState.logs.push({
//         type: "cabinet_confirmed",
//         emergency: false,
//         text: `🎖️ کاپیتان ${captain.name}
//             ${navigator.name} رو به عنوان 🧭 کشتیران
//             انتخاب کرد.
//             افسر اول نداریم و یک کارت بصورت رندوم به جای افسر انتخاب خواهد شد.
//             🗳️ حالا وقتشه کشتیران تصمیم بگیره که این کابینه رو قبول داره یا نه.`,
//       });
//     } else if (!navigator) {
//       gameState.logs.push({
//         type: "cabinet_confirmed",
//         emergency: false,
//         text: `🎖️ کاپیتان ${captain.name}
//             ${firstOfficer.name} ر, به عنوان 👨‍✈️ افسر اول و
//             کشتیران نداریم و کارت ناوبری پس از انتخاب کاپیتان و افسر اول بصورت رندوم انتخاب خواهد شد.
//             🗳️ حالا وقتشه افسر اول تصمیم بگیره که این کابینه رو قبول داره یا نه.`,
//       });
//     } else if (firstOfficer && navigator) {
//       gameState.logs.push({
//         type: "cabinet_confirmed",
//         emergency: false,
//         text: `🎖️ کاپیتان ${captain.name}
//             ${navigator.name} ر, به عنوان 🧭 کشتیران
//             انتخاب کرد.
//            علیه کابینه اضطراری نمیشه شورش کرد. پس مرحله بعد کارت های ناوبری پخش خواهد شد.`,
//       });
//     }
//   }
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
//   confirmCabinet,
// };
