const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const dealNavigationCards = require("./functions/startNavigationDrawPhase/dealNavigationCards");
const ensureEnoughCards = require("./functions/startNavigationDrawPhase/ensureEnoughCards");
const handleNoFirstOfficer = require("./functions/startNavigationDrawPhase/handleNoFirstOfficer");
const handleWithFirstOfficer = require("./functions/startNavigationDrawPhase/handleWithFirstOfficer");
ensureEnoughCards;

/**
 * شروع فاز توزیع کارت‌های ناوبری
 * @param {Map} games
 * @param {string} gameId
 * @param {Map} rooms
 * @param {Map} userSocketMap
 * @param {Object} io
 * @param {Object} preparedData
 * @param {Object} eventSpecificData
 */
async function startNavigationDrawPhase(
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

  // اطمینان از کافی بودن کارت‌ها
  ensureEnoughCards(gameState);

  // توزیع کارت‌ها
  const { captainCards, firstOfficerCards } = dealNavigationCards(gameState);

  // پیدا کردن بازیکنان
  const captain = gameState.players.find((p) => p.id === gameState.captainId);
  const firstOfficer = gameState.players.find(
    (p) => p.id === gameState.firstOfficerId
  );

  // سوییچ بر اساس وجود افسر اول
  switch (!!firstOfficer) {
    case true:
      handleWithFirstOfficer(
        firstOfficer,
        firstOfficerCards,
        gameState.firstOfficerId
      );
      break;
    case false:
      handleNoFirstOfficer(gameState, firstOfficerCards);
      break;
  }

  // کارت‌ها به کاپیتان
  captain.privatePhaseData = {
    currentPhase: "navigation_cards_draw",
    title: "انتخاب کارت ناوبری",
    captainId: gameState.captainId,
    cabinRole: "captain",
    cards: captainCards,
  };

  // تنظیم داده‌های فاز
  gameState.phaseData = {
    currentPhase: "navigation_cards_draw",
    title: "انتخاب کارت ناوبری",
  };

  // ثبت لاگ
  gameState.logs.push({
    type: "phase",
    text: `🧭 کاپیتان و افسر اول هر کدام دو کارت مسیر دریافت کردند.`,
  });

  gameState.currentPhase = "navigation_cards_draw";

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
  startNavigationDrawPhase,
};

// const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
// const { shuffle } = require("../../../utils/shuffle");
// const {
//   updateAndBroadcastGame,
// } = require("../../../utils/updateAndBroadcastGame");

// async function startNavigationDrawPhase(
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
//   const { navigationDeck, captainId, firstOfficerId } = gameState;
//   // console.log("gameState startNavigationDrawPhase");
//   // console.log(gameState);
//   gameState.nextPhaseData = {};

//   if (navigationDeck.length < 4) {
//     // اگر کارت کافی نیست، discardPile را به deck اضافه کن و شافل کن
//     gameState.navigationDeck = shuffle([
//       ...gameState.navigationDeck,
//       ...(gameState.discardPile || []),
//     ]);

//     gameState.discardPile = [];

//     // اگر باز هم کارت کافی نبود، ارور بده
//     if (gameState.navigationDeck.length < 4) {
//       throw new Error("تعداد کارت‌های مسیر برای توزیع کافی نیست.");
//     }
//   }
//   // console.log("navigationDeck before");
//   // console.log(navigationDeck.length);
//   // console.log(navigationDeck);
//   // کارت‌ها را از ته deck بردار
//   const captainCards = gameState.navigationDeck.splice(-2);
//   const firstOfficerCards = gameState.navigationDeck.splice(-2);
//   // console.log("navigationDeck after");
//   // console.log(navigationDeck.length);
//   // console.log(navigationDeck);

//   // تنظیم فاز و داده‌ها
//   gameState.currentPhase = "navigation_cards_draw";
//   const captain = gameState.players.find((p) => p.id === gameState.captainId);
//   const firstOfficer = gameState.players.find(
//     (p) => p.id === gameState.firstOfficerId
//   );

//   captain.privatePhaseData = {
//     currentPhase: "navigation_cards_draw",
//     title: "انتخاب کارت ناوبری",
//     captainId,
//     cabinRole: "captain",
//     cards: captainCards,
//   };
//   if (firstOfficerId) {
//     firstOfficer.privatePhaseData = {
//       currentPhase: "navigation_cards_draw",
//       title: "انتخاب کارت ناوبری",
//       firstOfficerId,
//       cabinRole: "firstOfficer",
//       cards: firstOfficerCards,
//     };
//   } else {
//     const shuffled = shuffle(firstOfficerCards);
//     const officerCardChosen = shuffled[0];
//     const officerCardDiscarded = shuffled[1];
//     gameState.nextPhaseData.officerCardChosen = officerCardChosen;
//     gameState.nextPhaseData.officerCardDiscarded = officerCardDiscarded;

//     gameState.nextPhaseData.officerSubmitted = true;
//   }

//   gameState.phaseData = {
//     currentPhase: "navigation_cards_draw",
//     title: "انتخاب کارت ناوبری",
//     // message:
//     //   "کاپیتان و افسر اول هر کدام دو کارت مسیر دریافت کردند و در حال انتخاب یکی از آن ها هستند که به ناوبر بدهند...",
//   };

//   gameState.logs.push({
//     type: "phase",
//     text: `🧭 کاپیتان و افسر اول هر کدام دو کارت مسیر دریافت کردند.`,
//   });
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
//   startNavigationDrawPhase,
// };
