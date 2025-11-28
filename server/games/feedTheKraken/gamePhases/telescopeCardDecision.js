const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const handleDiscard = require("./functions/telescopeCardDecision/handleDiscard");
const handleKeep = require("./functions/telescopeCardDecision/handleKeep");

/**
 * مدیریت تصمیم بازیکن درباره کارت تلسکوپ با استفاده از سوییچ و توابع جداگانه
 * @param {Map} games
 * @param {string} gameId
 * @param {Map} rooms
 * @param {Map} userSocketMap
 * @param {Object} io
 * @param {Object} preparedData
 * @param {Object} eventSpecificData
 */
async function telescopeCardDecision(
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
  const { decision, playerId } = eventSpecificData;
  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return;

  const card = gameState.navigationDeck[gameState.navigationDeck.length - 1];
  if (!card) return;

  // سوییچ بر اساس تصمیم بازیکن
  switch (decision) {
    case "discard":
      handleDiscard(gameState, card);
      break;
    case "keep":
      handleKeep(gameState, card);
      break;
    default:
      return; // تصمیم نامعتبر
  }

  // تنظیم داده‌های فاز برای نمایش به همه بازیکنان
  gameState.currentPhase = "telescope_seen";
  gameState.phaseData = {
    currentPhase: "telescope_seen",
    title: "تلسکوپ",
    type: "see",
    phaseSeen: [],
    targetPlayerName: player.name,
    decision,
  };
  gameState.nextPhaseData = {
    emergency: false,
  };

  // به‌روزرسانی بازی در حافظه و دیتابیس
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

module.exports = { telescopeCardDecision };
// const {
//   updateAndBroadcastGame,
// } = require("../../../utils/updateAndBroadcastGame");
// const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");

// async function telescopeCardDecision(
//   games,
//   gameId,
//   rooms,
//   userSocketMap,
//   io,
//   preparedData,
//   eventSpecificData
// ) {
//   // console.log("TelescopeSeen");
//   const { game, room, roomId, gameState } = getValidGameAndRoom({
//     gameId,
//     games,
//     rooms,
//   });
//   const { decision, playerId } = eventSpecificData;
//   const player = gameState.players.find((p) => p.id === playerId);
//   if (!player) return;

//   const card = gameState.navigationDeck[gameState.navigationDeck.length - 1];
//   if (!card) return;

//   // اعمال تصمیم بازیکن
//   if (decision === "discard") {
//     gameState.navigationDeck.pop(); // حذف کارت از دسته
//     gameState.discardPile.push(card); // افزودن به کارت‌های دور ریخته شده
//   } else if (decision === "keep") {
//     // کارت روی دسته می‌ماند، هیچ کاری نیاز نیست
//   } else {
//     return; // تصمیم نامعتبر
//   }
//   gameState.currentPhase = "telescope_seen";
//   gameState.phaseData = {
//     currentPhase: "telescope_seen",
//     title: "تلسکوپ",
//     type: "see",
//     phaseSeen: [],
//     targetPlayerName: player.name,
//     decision,
//     // message: `🔭 بازیکن ${player.name} تصمیم گرفت کارت تلسکوپ را ${
//     //   decision === "keep" ? "نگه دارد" : "به دریا بیندازد"
//     // }.`,
//   };
//   gameState.nextPhaseData = {
//     emergency: false,
//   };
//   // به‌روزرسانی بازی در حافظه و دیتابیس
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

// module.exports = { telescopeCardDecision };
