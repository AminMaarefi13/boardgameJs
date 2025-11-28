const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const handleCultLeaderEliminated = require("./functions/cultRitualChoice/handleCultLeaderEliminated");
const handleGunsStash = require("./functions/cultRitualChoice/handleGunsStash");
const handleCultCabinSearch = require("./functions/cultRitualChoice/handleCultCabinSearch");
const handleConversion = require("./functions/cultRitualChoice/handleConversion");

/**
 * مدیریت انتخاب کارت مراسم فرقه با استفاده از سوییچ و توابع جداگانه
 * @param {Map} games
 * @param {string} gameId
 * @param {Map} rooms
 * @param {Map} userSocketMap
 * @param {Object} io
 * @param {Object} preparedData
 * @param {Object} eventSpecificData
 */
async function cultRitualChoice(
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
  const { chosenCard } = eventSpecificData;
  const cultLeader = gameState.players.find((p) => p.role === "cultLeader");
  const alivePlayers = gameState.players.filter((p) => !p.eliminated);

  // حذف کارت انتخاب شده از دسته مراسم
  const index = gameState.cultRitualDeck.indexOf(chosenCard);
  if (index !== -1) {
    gameState.cultRitualDeck.splice(index, 1);
  }
  // اگر رهبر فرقه حذف شده باشد، مراسم به صورت اتوماتیک انجام می‌شود
  if (cultLeader.eliminated) {
    handleCultLeaderEliminated(
      gameState,
      chosenCard,
      alivePlayers,
      games,
      gameId,
      gameState,
      roomId,
      room,
      userSocketMap,
      io
    );
    return;
  }

  // سوییچ بر اساس نوع کارت انتخاب شده
  switch (chosenCard) {
    case "cult_guns_stash":
      handleGunsStash(gameState, cultLeader, chosenCard);
      break;
    case "cult_cabin_search":
      handleCultCabinSearch(gameState, cultLeader);
      break;
    case "cult_conversion":
      handleConversion(gameState, cultLeader, userSocketMap);
      break;
    default:
      return; // انتخاب نامعتبر
  }

  // ذخیره و ارسال وضعیت جدید
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

module.exports = { cultRitualChoice };
// const {
//   updateAndBroadcastGame,
// } = require("../../../utils/updateAndBroadcastGame");
// const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");

// async function cultRitualChoice(
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
//   const { chosenCard } = eventSpecificData;
//   const cultLeader = gameState.players.find((p) => p.role === "cultLeader");

//   const alivePlayers = gameState.players.filter((p) => !p.eliminated);
//   if (cultLeader.eliminated) {
//     gameState.currentPhase =
//       chosenCard === "cult_cabin_search"
//         ? `${chosenCard}_result`
//         : `${chosenCard}_choice`;
//     gameState.phaseData = {
//       currentPhase: `${chosenCard}_choice`,
//       title: "مراسم فرقه‌",
//     };
//     updateAndBroadcastGame(
//       games,
//       gameId,
//       gameState,
//       roomId,
//       room,
//       userSocketMap,
//       io
//     );
//     const randomDelay =
//       alivePlayers.length === 1
//         ? 1000
//         : 20000 + Math.floor(Math.random() * 10000);
//     setTimeout(() => {
//       if (chosenCard === "cult_guns_stash") {
//         gameState.phaseData = {
//           currentPhase: "cult_ritual_resolved",
//           title: "مراسم فرقه",
//           type: "see",
//           gunReceivers: null,
//           ritualType: "cult_guns_distributed",
//           // message: `🔫 رهبر فرقه تفنگ‌ها را توزیع کرد: ${gunReceivers} \n
//           // مرحله بعدی: تشکیل کابینه`,
//           phaseSeen: [],
//         };
//       } else if (chosenCard === "cult_cabin_search") {
//         gameState.phaseData = {
//           currentPhase: "cult_ritual_resolved",
//           title: "مراسم فرقه: دیدن نقش های کابین",
//           type: "see",
//           ritualType: "cult_cabin_search",
//           // message: `👁️ رهبر فرقه نقش‌های کابین را مشاهده کرد. \n
//           // مرحله بعد: تشکیل کابینه`,
//           phaseSeen: [],
//         };
//       } else if (chosenCard === "cult_conversion") {
//         gameState.phaseData = {
//           currentPhase: "cult_ritual_resolved",
//           title: "مراسم فرقه‌",
//           type: "see",
//           ritualType: "cult_conversion_target_selected",
//           // message: `🔮 رهبر فرقه و عضو جدید فرقه همدیگرو شناختن...`,
//           phaseSeen: [],
//         };
//       }
//       gameState.nextPhaseData = {
//         emergency: false,
//       };
//       updateAndBroadcastGame(
//         games,
//         gameId,
//         gameState,
//         roomId,
//         room,
//         userSocketMap,
//         io
//       );
//     }, randomDelay);
//     return;
//   }

//   const index = gameState.cultRitualDeck.indexOf(chosenCard);
//   if (index !== -1) {
//     gameState.cultRitualDeck.splice(index, 1);
//   }
//   if (chosenCard === "cult_guns_stash") {
//     gameState.currentPhase = "cult_guns_stash_choice";
//     // مرحله دادن تفنگ

//     const selectablePlayers = gameState.players.map((p) => {
//       let disabledReason = null;

//       if (p.id === gameState.eliminated) {
//         disabledReason = "بازیکن مرده قابل انتخاب نیست!";
//       }

//       return {
//         id: p.id,
//         name: p.name,
//         seat: p.seat,
//         disabled: Boolean(disabledReason),
//         disabledReason,
//       };
//     });

//     gameState.phaseData = {
//       currentPhase: "cult_guns_stash_choice",
//       title: "مراسم فرقه‌",
//       cultLeaderId: cultLeader.id,
//       // type: "see",
//       // message: `🔮 رهبر فرقه در حال پخش کردن سه تفنگ بین بازیکنان است...`,
//     };
//     cultLeader.privatePhaseData = {
//       currentPhase: chosenCard,
//       selectablePlayers,
//       cultLeaderId: cultLeader.id,
//       type: "cult_guns_stash_choice",
//     };
//   } else if (chosenCard === "cult_cabin_search") {
//     gameState.currentPhase = `cult_cabin_search_result`;
//     // ارسال نقش کابینه برای cultLeader
//     const cabinRoles = ["captain", "firstOfficer", "navigator"];
//     const cabinInfo = cabinRoles.map((cabinetRole) => {
//       let player;
//       if (cabinetRole === "captain") {
//         player = gameState.players.find((p) => p.id === gameState.captainId);
//       } else if (cabinetRole === "firstOfficer") {
//         player = gameState.players.find(
//           (p) => p.id === gameState.firstOfficerId
//         );
//       } else if (cabinetRole === "navigator") {
//         player = gameState.players.find((p) => p.id === gameState.navigatorId);
//       }
//       return {
//         cabinRole: cabinetRole,
//         role: player?.role || "نامشخص",
//         name: player?.name || "نامشخص",
//         initialRole: player?.initialRole || null,
//       };
//     });
//     gameState.phaseData = {
//       currentPhase: "cult_cabin_search_result",
//       title: "مراسم فرقه‌",
//       // type: "see",
//       cultLeaderId: cultLeader.id,
//       // message: `🔮 رهبر فرقه در حال مشاهده نقش اعضای کابین...`,
//     };
//     cultLeader.privatePhaseData = {
//       cabinInfo,
//       type: "cult_cabin_search_result",
//       cultLeaderId: cultLeader.id,
//     };
//     // gameState.phaseData = {};
//   } else if (chosenCard === "cult_conversion") {
//     gameState.currentPhase = "cult_conversion_choice";
//     // آماده‌سازی برای انتخاب بازیکن جهت پیوستن به فرقه
//     const socketId = userSocketMap.get(cultLeader.id);
//     if (!socketId) return;

//     const selectablePlayers = gameState.players.map((p) => {
//       let disabledReason = null;

//       if (p.id === cultLeader.id) {
//         disabledReason = "رهبر فرقه نمی‌تواند خودش را انتخاب کند!";
//       } else if (p.eliminated) {
//         disabledReason = "بازیکن حذف شده است.";
//       } else if (!p.canJoinCult) {
//         disabledReason = "این بازیکن نمی‌تواند به فرقه بپیوندد.";
//       }

//       return {
//         id: p.id,
//         name: p.name,
//         seat: p.seat,
//         disabled: Boolean(disabledReason),
//         disabledReason,
//       };
//     });
//     gameState.phaseData = {
//       currentPhase: "cult_conversion_choice",
//       title: "مراسم فرقه‌",
//       cultLeaderId: cultLeader.id,
//       // type: "see",
//       // message: `🔮 رهبر فرقه در حال انتخاب یک عضو جدید در فرقه...`,
//     };
//     cultLeader.privatePhaseData = {
//       selectablePlayers,
//       cultLeaderId: cultLeader.id,
//       type: "cult_conversion_choice",
//     };
//   } else {
//     return; // انتخاب نامعتبر
//   }

//   // ذخیره و ارسال وضعیت جدید
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

// module.exports = { cultRitualChoice };
