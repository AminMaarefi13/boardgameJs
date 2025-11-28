const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const handleCultCabinSearchResult = require("./functions/cultRitualFinished/handleCultCabinSearchResult");
const handleGunsDistributed = require("./functions/cultRitualFinished/handleGunsDistributed");
const handleConversionTargetSelected = require("./functions/cultRitualFinished/handleConversionTargetSelected");

/**
 * مدیریت پایان مراسم فرقه با استفاده از سوییچ و توابع جداگانه
 * @param {Map} games
 * @param {string} gameId
 * @param {Map} rooms
 * @param {Map} userSocketMap
 * @param {Object} io
 * @param {Object} preparedData
 * @param {Object} eventSpecificData
 */
async function cultRitualFinished(
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
  const { data, type } = eventSpecificData;
  gameState.currentPhase = "cult_ritual_resolved";
  const cultLeader = gameState.players.find((p) => p.role === "cultLeader");

  // سوییچ بر اساس نوع مراسم
  switch (type) {
    case "cult_cabin_search":
      handleCultCabinSearchResult(gameState, cultLeader);
      break;
    case "cult_guns_distributed":
      handleGunsDistributed(gameState, data);
      break;
    case "cult_conversion_target_selected":
      handleConversionTargetSelected(gameState, cultLeader, data);
      break;
    default:
      return; // نوع ناشناخته
  }

  // ذخیره بازی و بروزرسانی وضعیت بازیکنان
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

module.exports = { cultRitualFinished };
// const {
//   updateAndBroadcastGame,
// } = require("../../../utils/updateAndBroadcastGame");
// const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");

// async function cultRitualFinished(
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
//   const { data, type } = eventSpecificData;
//   // console.log("gameId");
//   // console.log(gameId);
//   // console.log("data");
//   // console.log(data);
//   // console.log("type");
//   // console.log(type);

//   gameState.currentPhase = "cult_ritual_resolved";
//   const cultLeader = gameState.players.find((p) => p.role === "cultLeader");
//   // console.log(cultLeader);
//   // console.log("cultLeader");

//   switch (type) {
//     case "cult_cabin_search":
//       // console.log(cultLeader);
//       // console.log("cultLeader");

//       const cabinet = [
//         gameState.captainId,
//         gameState.firstOfficerId,
//         gameState.navigatorId,
//       ].filter((id) => id !== null);

//       knowRolesArr = cabinet.map((id) => {
//         const player = gameState.players.find((p) => p.id === id);
//         return {
//           playerId: id,
//           playerName: player.name,
//           role: player.role,
//           phase: "cult_cabin_search",
//         };
//       });
//       cultLeader.knownRoles.push(knowRolesArr);
//       gameState.phaseData = {
//         currentPhase: "cult_ritual_resolved",
//         title: "مراسم فرقه: دیدن نقش های کابین",
//         type: "see",
//         ritualType: "cult_cabin_search",
//         // message: `👁️ رهبر فرقه نقش‌های کابین را مشاهده کرد. \n
//         // مرحله بعد: تشکیل کابینه`,
//         phaseSeen: [],
//       };
//       gameState.nextPhaseData = {
//         emergency: false,
//       };
//       break;

//     case "cult_guns_distributed":
//       const distribution = data.distribution;
//       // console.log("🔫 توزیع دریافت‌شده:", distribution);

//       if (!distribution || typeof distribution !== "object") return;

//       // به‌روزرسانی تفنگ‌ها در وضعیت بازیکنان
//       for (const player of gameState.players) {
//         const addedGuns = distribution[player.id] || 0;
//         if (!player.guns) {
//           player.guns = 0;
//         }
//         player.guns += addedGuns;
//       }

//       // ساختن متن اطلاع‌رسانی بر اساس بازیکن‌هایی که تفنگ گرفتن
//       const gunReceivers = gameState.players
//         .filter((p) => distribution[p.id] > 0)
//         .map((p) => `${p.name} (${distribution[p.id]}🔫)`)
//         .join("، ");

//       gameState.phaseData = {
//         currentPhase: "cult_ritual_resolved",
//         title: "مراسم فرقه: توزیع تفنگ",
//         type: "see",
//         gunReceivers,
//         ritualType: "cult_guns_distributed",
//         // message: `🔫 رهبر فرقه تفنگ‌ها را توزیع کرد: ${gunReceivers} \n
//         // مرحله بعدی: تشکیل کابینه`,
//         phaseSeen: [],
//       };
//       gameState.nextPhaseData = {
//         emergency: false,
//       };
//       break;

//     case "cult_conversion_target_selected":
//       // console.log(data);
//       // console.log(cultLeader);
//       // console.log("cultLeader");
//       const targetPlayerId = data.targetPlayerId || null;
//       if (!targetPlayerId) {
//         gameState.phaseData = {
//           currentPhase: "cult_ritual_resolved",
//           title: "مراسم فرقه‌",
//           type: "see",
//           ritualType: "cult_conversion_target_selected",
//           // message: `🔮 رهبر فرقه و عضو جدید فرقه همدیگرو شناختن...`,
//           phaseSeen: [],
//         };
//         gameState.nextPhaseData = {
//           emergency: false,
//         };
//         updateAndBroadcastGame(
//           games,
//           gameId,
//           gameState,
//           roomId,
//           room,
//           userSocketMap,
//           io
//         );
//         return;
//       }

//       const target = gameState.players.find((p) => p.id === targetPlayerId);
//       if (!target) return;

//       // بازیکن عضو فرقه می‌شود
//       target.initialRole = target.role;
//       target.role = "cultist";
//       target.canJoinCult = false;

//       if (cultLeader) {
//         cultLeader.knownRoles.push({
//           playerId: target.id,
//           playerName: target.name,
//           role: target.role,
//           phase: "cult_conversion",
//         });
//         target.knownRoles.push({
//           playerId: cultLeader.id,
//           playerName: cultLeader.name,
//           role: cultLeader.role,
//           phase: "cult_conversion",
//         });

//         gameState.phaseData = {
//           currentPhase: "cult_ritual_resolved",
//           title: "مراسم فرقه‌",
//           type: "see",
//           ritualType: "cult_conversion_target_selected",
//           // message: `🔮 رهبر فرقه و عضو جدید فرقه همدیگرو شناختن...`,
//           phaseSeen: [],
//         };
//         target.privatePhaseData = {
//           type: "cult_info",
//           // text: `🕯️ این پیام مخفیانه است. شما اکنون عضو فرقه هستید. رهبر فرقه: ${cultLeader.name}`,
//           cultLeaderId: cultLeader.id,
//           cultLeaderName: cultLeader.name,
//         };
//         cultLeader.privatePhaseData = {
//           type: "cult_info",
//           // text: `🕯️ این پیام مخفیانه است. شما ${target.name} را به عضویت فرقه درآوردید. `,
//           targetId: target.id,
//           targetName: target.name,
//         };
//       }
//       gameState.nextPhaseData = {
//         emergency: false,
//       };

//       break;

//     default:
//       return; // نوع ناشناخته
//   }

//   // ذخیره بازی و بروزرسانی وضعیت بازیکنان
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

// module.exports = { cultRitualFinished };
