const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const handleNoPlayersLeft = require("./functions/startNavCardEffect/handleNoPlayersLeft");
const handleDrunk = require("./functions/startNavCardEffect/handleDrunk");
const handleMermaid = require("./functions/startNavCardEffect/handleMermaid");
const handleTelescope = require("./functions/startNavCardEffect/handleTelescope");
const handleArmed = require("./functions/startNavCardEffect/handleArmed");
const handleDisarmed = require("./functions/startNavCardEffect/handleDisarmed");
const handleCultUprising = require("./functions/startNavCardEffect/handleCultUprising");

/**
 * مدیریت اثر کارت ناوبری (NavCard Effect) با استفاده از سوییچ و توابع جداگانه
 * @param {Map} games
 * @param {string} gameId
 * @param {Map} rooms
 * @param {Map} userSocketMap
 * @param {Object} io
 * @param {Object} preparedData
 * @param {Object} eventSpecificData
 */
async function startNavCardEffect(
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

  const latestNavCard =
    gameState.playedNavCards[gameState.playedNavCards.length - 1];
  const card = latestNavCard;
  const players = gameState.players;
  const alivePlayers = players.filter((p) => !p.eliminated);

  // اگر فقط یک بازیکن زنده باشد و کارت قیام فرقه نباشد، اثر کارت اجرا نمی‌شود
  if (alivePlayers.length === 1 && card.type !== "cult_uprising") {
    handleNoPlayersLeft(gameState, card.type);

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

  // سوییچ بر اساس نوع کارت
  switch (card.type) {
    case "drunk":
      handleDrunk(gameState);
      break;
    case "mermaid":
      handleMermaid(gameState);
      break;
    case "telescope":
      handleTelescope(gameState);
      break;
    case "armed":
      handleArmed(gameState);
      break;
    case "disarmed":
      handleDisarmed(gameState);
      break;
    case "cult_uprising":
      handleCultUprising(gameState);
      break;
    default:
      gameState.logs.push({
        type: "warning",
        text: `⚠️ کارت ناوبری با نوع ناشناخته: ${card.type}`,
      });
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
  startNavCardEffect,
};
// const {
//   updateAndBroadcastGame,
// } = require("../../../utils/updateAndBroadcastGame");
// const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
// const { shuffleArray } = require("../../../utils/shuffleArray");

// async function startNavCardEffect(
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
//   // پایان فاز و رفتن به next_round_setup
//   const latestNavCard =
//     gameState.playedNavCards[gameState.playedNavCards.length - 1];
//   // console.log("latestNavCard");
//   // console.log(latestNavCard);
//   const card = latestNavCard;
//   const navigatorId = gameState.navigatorId;
//   const captainId = gameState.captainId;
//   const players = gameState.players;

//   const alivePlayers = players.filter((p) => !p.eliminated);
//   if (alivePlayers.length === 1 && card.type !== "cult_uprising") {
//     gameState.currentPhase = card.type;
//     gameState.phaseData = {
//       currentPhase: card.type,
//       title: "اثر کارت انجام نمی شود",
//       type: "see",
//       phaseSeen: [],
//       noPlayersLeft: true,
//     };
//     gameState.nextPhaseData = {
//       emergency: false,
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

//   switch (card.type) {
//     case "drunk": {
//       const currentCaptainIndex = players.findIndex((p) => p.id === captainId);

//       // قدم اول: پیدا کردن کمترین تعداد رزومه بین بازیکنان واجد شرایط
//       let minResume = Infinity;
//       for (const player of players) {
//         if (!player.eliminated && !player.tongueOff) {
//           minResume = Math.min(minResume, player.resume.length);
//         }
//       }

//       // قدم دوم: پیدا کردن اولین بازیکن در جهت ساعتگرد با همین تعداد رزومه
//       let newCaptain = null;
//       for (let i = 1; i < players.length; i++) {
//         const nextIndex = (currentCaptainIndex + i) % players.length;
//         const nextPlayer = players[nextIndex];
//         if (
//           !nextPlayer.eliminated &&
//           !nextPlayer.tongueOff &&
//           nextPlayer.resume.length === minResume
//         ) {
//           newCaptain = nextPlayer;
//           break;
//         }
//       }
//       if (newCaptain === null) {
//         newCaptain = players[currentCaptainIndex];
//       }

//       if (newCaptain) {
//         gameState.captainId = newCaptain.id;
//         gameState.logs.push({
//           type: "event",
//           text: `🍺 کاپیتان تغییر کرد! کاپیتان جدید: ${newCaptain.name}`,
//         });
//       }

//       gameState.currentPhase = card.type;
//       gameState.phaseData = {
//         currentPhase: card.type,
//         title: "کارت مست",
//         type: "see",
//         phaseSeen: [],
//         newCaptainName: newCaptain.name,
//         // message: newCaptain
//         //   ? `🍺 کاپیتان تغییر کرد! کاپیتان جدید: ${newCaptain.name}`
//         //   : "هیچ بازیکن واجد شرایطی برای کاپیتانی پیدا نشد.",
//       };
//       gameState.nextPhaseData = {
//         emergency: false,
//       };
//       break;
//     }
//     case "mermaid": {
//       gameState.currentPhase = "mermaid";
//       const selectablePlayers = players.map((p) => {
//         let disabled = false;
//         let disabledReason = null;

//         if (p.eliminated) {
//           disabled = true;
//           disabledReason = "این بازیکن حذف شده است.";
//         } else if (p.id === captainId) {
//           disabled = true;
//           disabledReason = "کاپیتان نمی‌تواند خودش را انتخاب کند.";
//         }

//         return {
//           id: p.id,
//           name: p.name,
//           seat: p.seat,
//           disabled,
//           disabledReason,
//         };
//       });

//       gameState.logs.push({
//         type: "phase",
//         text: `🧜‍♀️ کاپیتان باید یک بازیکن را برای پری دریایی انتخاب کند.`,
//       });

//       gameState.phaseData = {
//         currentPhase: "mermaid",
//         title: "پری دریایی",
//         // type: "see",
//         // message: `🧜‍♀️ ...کاپیتان در حال انتخاب یک بازیکن برای اثر پری دریایی `,
//       };
//       const captain = gameState.players.find(
//         (p) => p.id === gameState.captainId
//       );
//       captain.privatePhaseData = {
//         currentPhase: "mermaid",
//         title: "انتخاب بازیکن برای پری دریایی",
//         selectablePlayers,
//       };
//       break;
//     }

//     case "telescope": {
//       gameState.currentPhase = "telescope";
//       const selectablePlayers = players.map((p) => {
//         let disabled = false;
//         let disabledReason = null;

//         if (p.eliminated) {
//           disabled = true;
//           disabledReason = "این بازیکن حذف شده است.";
//         } else if (p.id === captainId) {
//           disabled = true;
//           disabledReason = "کاپیتان نمی‌تواند خودش را انتخاب کند.";
//         }

//         return {
//           id: p.id,
//           name: p.name,
//           seat: p.seat,
//           disabled,
//           disabledReason,
//         };
//       });

//       gameState.logs.push({
//         type: "phase",
//         text: `🔭 کاپیتان باید یک بازیکن را برای تلسکوپ انتخاب کند.`,
//       });
//       gameState.phaseData = {
//         currentPhase: "telescope",
//         title: "تلسکوپ",
//         // type: "see",
//         // message: `🔭 کاپیتان باید یک بازیکن را برای تلسکوپ انتخاب کند.`,
//       };
//       const captain = gameState.players.find(
//         (p) => p.id === gameState.captainId
//       );
//       captain.privatePhaseData = {
//         currentPhase: "telescope",
//         title: "انتخاب بازیکن برای تلسکوپ ",
//         selectablePlayers,
//       };
//       break;
//     }

//     case "armed": {
//       gameState.currentPhase = card.type;
//       const navigator = players.find((p) => p.id === navigatorId);
//       if (navigator) {
//         navigator.guns += 1;
//         gameState.logs.push({
//           type: "event",
//           text: `🔫 ناوبر ${navigator.name} یک تفنگ دریافت کرد.`,
//         });
//       }
//       gameState.phaseData = {
//         currentPhase: card.type,
//         title: "برداشتن تفنگ",
//         type: "see",
//         phaseSeen: [],
//         navigatorName: navigator.name,
//         // message: `🔫 ناوبر ${navigator.name} یک تفنگ دریافت کرد.`,
//       };
//       gameState.nextPhaseData = {
//         emergency: false,
//       };
//       break;
//     }

//     case "disarmed": {
//       gameState.currentPhase = card.type;
//       const navigator = players.find((p) => p.id === navigatorId);
//       if (navigator && navigator.guns > 0) {
//         navigator.guns -= 1;
//         gameState.logs.push({
//           type: "event",
//           text: `🛑 یکی از تفنگ‌های کشتیران ${navigator.name} گرفته شد.`,
//         });
//         gameState.phaseData = {
//           currentPhase: card.type,
//           title: "گذاشتن تفنگ",
//           type: "see",
//           phaseSeen: [],
//           navigatorName: navigator.name,
//           // message: `🛑 یکی از تفنگ‌های کشتیران ${navigator.name} گرفته شد.`,
//         };
//       } else {
//         gameState.logs.push({
//           type: "event",
//           text: `🛑 کشتیران ${navigator.name} تفنگی نداشت که گرفته شود.`,
//         });
//         gameState.phaseData = {
//           currentPhase: card.type,
//           title: "گذاشتن تفنگ",
//           type: "see",
//           phaseSeen: [],
//           message: `🛑 کشتیران ${navigator.name} تفنگی نداشت که گرفته شود.`,
//         };
//       }
//       gameState.nextPhaseData = {
//         emergency: false,
//       };
//       break;
//     }

//     case "cult_uprising": {
//       gameState.currentPhase = card.type;
//       const availableRituals = gameState.cultRitualDeck;

//       if (availableRituals.length === 0) {
//         gameState.logs.push({
//           type: "event",
//           text: `🔮 مراسم فرقه‌ انجام نشد چون کارت دیگری باقی نمانده.`,
//         });
//         break;
//       }

//       // همه کارت‌های باقی‌مانده رو شافل و ارسال می‌کنیم
//       const shuffled = shuffleArray([...availableRituals]);

//       gameState.logs.push({
//         type: "phase",
//         text: `🔮 مراسم فرقه‌ آغاز شد. کاپیتان باید یکی از کارت‌های مخفی را انتخاب کند.`,
//       });

//       gameState.phaseData = {
//         currentPhase: card.type,
//         title: "مراسم فرقه‌",
//         // type: "see",
//         // message: `🔮 مراسم فرقه‌ آغاز شد. کاپیتان باید یکی از کارت‌های مخفی را انتخاب کند.`,
//       };
//       const captain = gameState.players.find(
//         (p) => p.id === gameState.captainId
//       );
//       captain.privatePhaseData = {
//         options: shuffled,
//       };

//       break;
//     }

//     default: {
//       gameState.logs.push({
//         type: "warning",
//         text: `⚠️ کارت ناوبری با نوع ناشناخته: ${card.type}`,
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
//   startNavCardEffect,
// };
