const { shuffleArray } = require("../../../utils/shuffleArray");
const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const handleNoTargetPlayer = require("./functions/resolveLocationEffect/handleNoTargetPlayer");
const handleCabinSearch = require("./functions/resolveLocationEffect/handleCabinSearch");
const handleOffWithTongue = require("./functions/resolveLocationEffect/handleOffWithTongue");
const handleFlogging = require("./functions/resolveLocationEffect/handleFlogging");
const handleFeedTheKraken = require("./functions/resolveLocationEffect/handleFeedTheKraken");

/**
 * مدیریت افکت‌های مکان (location effect) با استفاده از سوییچ و توابع جداگانه
 * @param {Map} games
 * @param {string} gameId
 * @param {Map} rooms
 * @param {Map} userSocketMap
 * @param {Object} io
 * @param {Object} preparedData
 * @param {Object} eventSpecificData
 */
async function resolveLocationEffect(
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
  const { effectType, targetPlayerId } = eventSpecificData;
  const targetPlayer =
    gameState.players.find((p) => p.id === targetPlayerId) || null;

  const captainSocketId = userSocketMap.get(gameState.captainId);

  // اگر بازیکن هدف وجود ندارد
  if (!targetPlayer) {
    handleNoTargetPlayer(gameState);

    updateAndBroadcastGame(
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

  // سوییچ بر اساس نوع افکت
  switch (effectType) {
    case "cabin_search":
      handleCabinSearch(gameState, targetPlayer, targetPlayerId);
      break;
    case "off_with_tongue":
      handleOffWithTongue(gameState, targetPlayer);
      break;
    case "flogging":
      handleFlogging(gameState, targetPlayer, targetPlayerId);
      break;
    case "feed_the_kraken":
      const gameEnded = handleFeedTheKraken(
        gameState,
        targetPlayer,
        io,
        captainSocketId
      );
      if (gameEnded) {
        updateAndBroadcastGame(
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
      break;
    default:
      console.warn("اثر نامعتبر:", effectType);
      return;
  }

  // پایان فاز و رفتن به next_round_setup
  if (effectType !== "flogging") {
    gameState.currentPhase = "location_effect_resolved";
  } else {
    gameState.currentPhase = "select_flogging_card";
  }

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
  resolveLocationEffect,
};
// const { shuffleArray } = require("../../../utils/shuffleArray");
// const {
//   updateAndBroadcastGame,
// } = require("../../../utils/updateAndBroadcastGame");
// const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");

// async function resolveLocationEffect(
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
//   const { effectType, targetPlayerId } = eventSpecificData;
//   const targetPlayer =
//     gameState.players.find((p) => p.id === targetPlayerId) || null;
//   // console.log("targetPlayer");
//   // console.log(targetPlayer);

//   const captainSocketId = userSocketMap.get(gameState.captainId);
//   // console.log("captainSocketId");
//   // console.log(captainSocketId);
//   // console.log("effectType");
//   // console.log(effectType);

//   if (!targetPlayer) {
//     gameState.currentPhase = "location_effect_resolved";

//     gameState.phaseData = {
//       currentPhase: "location_effect_resolved",
//       title: "بازیکنی وجود ندارد",
//       type: "see",
//       phaseSeen: [],
//       noPlayersLeft: true,
//       noLocationEffect: false,
//       // message: `کاپیتان در حال دیدن نقش \n
//       // ${targetPlayer.name} است... \n
//       // مرحله بعد: اثر کارت`,
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
//     return;
//   }

//   switch (effectType) {
//     case "cabin_search":
//       // بازیکن دیگر نمی‌تواند به فرقه بپیوندد
//       targetPlayer.canJoinCult = false;

//       // اگر عضو فرقه شده، نقش اصلی‌اش به کاپیتان اطلاع داده می‌شود
//       const revealedRole = targetPlayer.role;
//       const initialRole = targetPlayer.initialRole;

//       const captain = gameState.players.find(
//         (p) => p.id === gameState.captainId
//       );
//       gameState.phaseData = {
//         currentPhase: "location_effect_resolved",
//         title: "دیدن نقش",
//         type: "see",
//         phaseSeen: [],
//         nodeType: "cabin_search",
//         targetPlayerName: targetPlayer.name,
//         noLocationEffect: false,
//         // message: `کاپیتان در حال دیدن نقش \n
//         // ${targetPlayer.name} است... \n
//         // مرحله بعد: اثر کارت`,
//       };
//       captain.privatePhaseData = {
//         targetName: targetPlayer.name,
//         role: revealedRole,
//         initialRole,
//       };

//       captain.knownRoles.push({
//         playerId: targetPlayerId,
//         role: targetPlayer.role,
//         phase: "cabin_search",
//       });

//       gameState.logs.push({
//         type: "effect",
//         text: `🔍 کاپیتان نقش ${targetPlayer.name} را مشاهده کرد.`,
//       });
//       break;

//     case "off_with_tongue":
//       targetPlayer.tongueOff = true;

//       gameState.logs.push({
//         type: "effect",
//         text: `😶 زبان ${targetPlayer.name} بریده شد. دیگر نمی‌تواند صحبت کند یا کاپیتان شود.`,
//       });

//       gameState.phaseData = {
//         currentPhase: "location_effect_resolved",
//         title: "بریدن زبان",
//         type: "see",
//         phaseSeen: [],
//         nodeType: "off_with_tongue",
//         targetPlayerName: targetPlayer.name,
//         noLocationEffect: false,

//         // message: `😶 زبان ${targetPlayer.name} بریده شد. دیگر نمی‌تواند صحبت کند یا کاپیتان شود.`,
//       };
//       break;

//     case "flogging": {
//       targetPlayer.canJoinCult = false;
//       const realRole = targetPlayer.role;
//       // console.log("realRole");
//       // console.log(realRole);
//       let realCard;
//       if (realRole === "sailor") {
//         realCard = "sailor";
//       } else if (realRole === "pirate") {
//         realCard = "pirate";
//       } else if (realRole === "cultLeader" || realRole === "cultist") {
//         realCard = "cult";
//       } else {
//         console.warn("نقش ناشناخته برای شلاق:", realRole);
//         return;
//       }

//       const floggingCards = ["sailor", "pirate", "cult"];
//       const fakeCards = floggingCards.filter((card) => card !== realCard);
//       // console.log("fakeCards");
//       // console.log(fakeCards);
//       // ذخیره وضعیت انتخاب برای بعد
//       gameState.phaseData = {
//         currentPhase: "select_flogging_card",
//         title: "من ... نیستم",
//         // type: "see",
//         nodeType: "flogging",
//         targetPlayerName: targetPlayer.name,
//         noLocationEffect: false,
//         // message: `کاپیتان در حال انتخاب تصادفی یکی از کارت های نقش \n
//         // ${targetPlayer.name} است... \n
//         // هر کدومو کاپیتان انتخاب کنه همه میفهمن که ${targetPlayer.name} اون نقش رو قطعا نداره`,
//       };
//       const captain = gameState.players.find(
//         (pl) => pl.id === gameState.captainId
//       );
//       captain.privatePhaseData = {
//         targetPlayerId,
//         options: shuffleArray(fakeCards),
//       };
//       break;
//     }

//     case "feed_the_kraken":
//       // نمی‌توان خودش را انتخاب کند
//       if (targetPlayer.id === gameState.captainId) {
//         if (captainSocketId) {
//           io.to(captainSocketId).emit("error", {
//             message: "❌ نمی‌توانی خودت را به کراکن قربانی کنی!",
//           });
//         }
//         return;
//       }

//       targetPlayer.eliminated = true;
//       gameState.logs.push({
//         type: "effect",
//         text: `🦑 بازیکن ${targetPlayer.name} قربانی کراکن شد.`,
//       });

//       // اگر کرکن بود، Cult فوراً برنده می‌شود
//       if (targetPlayer.role === "cultLeader") {
//         gameState.logs.push({
//           type: "win",
//           text: "🧿 رهبر فرقه قربانی شد! تیم فرقه پیروز شد!",
//         });
//         gameState.winner = "cult";

//         gameState.currentPhase = "game_over";
//         gameState.phaseData = {};

//         gameState.logs.push({
//           type: "event",
//           text: `🏁 بازی به پایان رسید. جناح برنده: ${gameState.winner}`,
//         });
//         gameState.phaseData = {
//           currentPhase: "game_over",
//           title: "پایان بازی",
//           // type: "see",
//           winner: gameState.winner,
//           noLocationEffect: false,
//           // message: `🏁 بازی به پایان رسید. جناح برنده: ${gameState.winner}`,
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

//       gameState.phaseData = {
//         currentPhase: "location_effect_resolved",
//         title: "قربانی کراکن",
//         type: "see",
//         phaseSeen: [],
//         nodeType: "feed_the_kraken",
//         targetPlayerName: targetPlayer.name,
//         // message: `🦑 بازیکن ${targetPlayer.name} قربانی کراکن شد.`,
//       };

//       break;

//     default:
//       console.warn("اثر نامعتبر:", effectType);
//       return;
//   }

//   // پایان فاز و رفتن به next_round_setup
//   if (effectType !== "flogging") {
//     gameState.currentPhase = "location_effect_resolved";
//   } else {
//     gameState.currentPhase = "select_flogging_card";
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
//   resolveLocationEffect,
// };
