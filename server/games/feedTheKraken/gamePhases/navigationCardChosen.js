const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const handleNoNavigator = require("./functions/navigationCardChosen/handleNoNavigator");
const handleNavigator = require("./functions/navigationCardChosen/handleNavigator");
const handleCaptainOrOfficer = require("./functions/navigationCardChosen/handleCaptainOrOfficer");

/**
 * مدیریت انتخاب کارت ناوبری توسط نقش‌های مختلف کابینه
 * @param {Map} games
 * @param {string} gameId
 * @param {Map} rooms
 * @param {Map} userSocketMap
 * @param {Object} io
 * @param {Object} preparedData
 * @param {Object} eventSpecificData
 */
async function navigationCardChosen(
  games,
  gameId,
  rooms,
  userSocketMap,
  io,
  preparedData,
  eventSpecificData
) {
  const { emergency, playerId, cabinRole } = eventSpecificData;
  let { chosenCard, discardedCard } = eventSpecificData;

  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });

  // حالت بدون ناوبر (navigator)
  if (gameState.nextPhaseData?.noNavigator) {
    handleNoNavigator(gameState, gameState.nextPhaseData.shuffledCards);

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

  // سوییچ بر اساس نقش و حالت
  switch (cabinRole) {
    case "navigator":
      handleNavigator(gameState, { chosenCard, discardedCard, emergency });

      updateAndBroadcastGame(
        games,
        gameId,
        gameState,
        roomId,
        room,
        userSocketMap,
        io
      );
      break;
    case "captain":
    case "firstOfficer":
      handleCaptainOrOfficer(
        gameState,
        { playerId, cabinRole, chosenCard, discardedCard },
        updateAndBroadcastGame,
        [games, gameId, gameState, roomId, room, userSocketMap, io]
      );
      break;
    default:
      // نقش نامعتبر
      break;
  }
}

module.exports = {
  navigationCardChosen,
};
// const {
//   updateAndBroadcastGame,
// } = require("../../../utils/updateAndBroadcastGame");
// const gameController = require("../../../controllers/gameController");
// const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");

// async function navigationCardChosen(
//   games,
//   gameId,
//   rooms,
//   userSocketMap,
//   io,
//   preparedData,
//   eventSpecificData
// ) {
//   const { emergency, playerId, cabinRole } = eventSpecificData;
//   let { chosenCard, discardedCard } = eventSpecificData;

//   const { game, room, roomId, gameState } = getValidGameAndRoom({
//     gameId,
//     games,
//     rooms,
//   });
//   console.log("beforeeeeeeeeeee");
//   console.log(gameState);
//   console.log(gameState.nextPhaseData);
//   if (gameState.nextPhaseData?.noNavigator) {
//     console.log("gameState.phaseData?.noNavigator");
//     console.log(gameState.nextPhaseData?.noNavigator);
//     console.log(gameState.nextPhaseData.shuffledCards);

//     chosenCard = gameState.nextPhaseData.shuffledCards[0];
//     discardedCard = gameState.nextPhaseData.shuffledCards[1];
//     gameState.playedNavCards.push(chosenCard);
//     gameState.discardPile.push(discardedCard);
//     // console.log(gameState);
//     // console.log(gameState.playedNavCards);

//     const captain = gameState.players.find(
//       (pl) => pl.id === gameState.captainId
//     );
//     captain.resume.push(chosenCard);

//     gameState.currentPhase = "navigation_card_chosen";
//     // const cardMessage = `کارت انتخابی کشتیران: \n
//     // ${chosenCard.color}
//     // ${chosenCard.type}`;
//     gameState.phaseData = {
//       currentPhase: "navigation_card_chosen",
//       title: " کارت انتخابی کشتیران",
//       type: "see",
//       chosenCard,
//       phaseSeen: [],
//       // message: cardMessage,
//     };
//     gameState.nextPhaseData = {
//       card: chosenCard,
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
//   } else {
//     // console.log("gameState navigationCardChosen");
//     // console.log(gameState);
//     // console.log("playerId");
//     // console.log(playerId);
//     if (!gameState.phaseData) gameState.phaseData = {};
//     if (cabinRole === "navigator") {
//       if (!emergency) {
//         gameState.playedNavCards.push(chosenCard);
//         gameState.discardPile.push(discardedCard);
//         // console.log(gameState);
//         // console.log(gameState.playedNavCards);

//         const captain = gameState.players.find(
//           (pl) => pl.id === gameState.captainId
//         );
//         captain.resume.push(chosenCard);

//         gameState.currentPhase = "navigation_card_chosen";
//         // const cardMessage = `کارت انتخابی کشتیران: \n
//         // ${chosenCard.color}
//         // ${chosenCard.type}`;
//         gameState.phaseData = {
//           currentPhase: "navigation_card_chosen",
//           title: " کارت انتخابی کشتیران",
//           type: "see",
//           chosenCard,
//           phaseSeen: [],
//           // message: cardMessage,
//         };
//         gameState.nextPhaseData = {
//           card: chosenCard,
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
//         // console.log("gameState.phaseData");
//       } else {
//         gameState.discardPile.push(chosenCard);
//         gameState.discardPile.push(discardedCard);
//         const navigator = gameState.players.find(
//           (p) => p.id === gameState.navigatorId
//         );
//         const eliminatedId = navigator.id;
//         navigator.eliminated = true;
//         gameState.navigatorId = null;
//         gameState.logs.push({
//           type: "event",
//           text: `کشتیران هیچ کارتی رو انتخاب نکرد و خودشو پرت کرد تو آب. مرحله بعد: تشکیل کابینه اضطراری`,
//         });
//         gameState.currentPhase = "navigator_denial";
//         gameState.phaseData = {
//           currentPhase: "navigator_denial",
//           title: "حذف ناوبر",
//           type: "see",
//           eliminatedId,
//           phaseSeen: [],
//           // message: `کشتیران هیچ کارتی رو انتخاب نکرد و خودشو پرت کرد تو آب. مرحله بعد: تشکیل کابینه اضطراری`,
//         };
//         gameState.nextPhaseData = {
//           emergency: true,
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
//     }
//     const isCaptain = playerId === gameState.captainId;
//     const isFirstOfficer = playerId === gameState.firstOfficerId;
//     // console.log("isCaptain");
//     // console.log("isFirstOfficer");
//     // console.log(isCaptain);
//     // console.log(isFirstOfficer);
//     if (!isCaptain && !isFirstOfficer) return;

//     // ثبت انتخاب
//     if (isCaptain && !gameState.nextPhaseData.captainCardChosen) {
//       gameState.nextPhaseData.captainCardChosen = chosenCard;
//       gameState.nextPhaseData.captainCardDiscarded = discardedCard;
//       // console.log("gameState.nextPhaseData.captainSubmitted = true;");
//       gameState.nextPhaseData.captainSubmitted = true;
//     }

//     if (isFirstOfficer && !gameState.nextPhaseData.officerCardChosen) {
//       gameState.nextPhaseData.officerCardChosen = chosenCard;
//       gameState.nextPhaseData.officerCardDiscarded = discardedCard;
//       // console.log("gameState.nextPhaseData.officerSubmitted = true;");
//       gameState.nextPhaseData.officerSubmitted = true;
//     }

//     // اگر هر دو نفر انتخابشون رو انجام دادن:
//     if (
//       gameState.nextPhaseData.captainSubmitted &&
//       gameState.nextPhaseData.officerSubmitted
//     ) {
//       const finalCards = [
//         gameState.nextPhaseData.captainCardChosen,
//         gameState.nextPhaseData.officerCardChosen,
//       ];
//       // console.log("finalCards");
//       // console.log(finalCards);

//       // دو کارت دورریخته شده به دیسکارد
//       gameState.discardPile.push(
//         gameState.nextPhaseData.captainCardDiscarded,
//         gameState.nextPhaseData.officerCardDiscarded
//       );

//       // شافل کارت‌ها
//       const shuffled = finalCards.sort(() => Math.random() - 0.5);
//       // console.log("shuffled");
//       // console.log(shuffled);

//       // فاز جدید
//       const navigator =
//         gameState.players.find((p) => p.id === gameState.navigatorId) || null;

//       if (navigator) {
//         gameState.currentPhase = "navigator_choose_card";
//         gameState.nextPhaseData = {}; // فاز بعدی نیازی به داده‌های قبلی نداره
//         navigator.privatePhaseData = {
//           currentPhase: "navigator_choose_card",
//           title: "انتخاب کارت توسط کشتیران",
//           navigatorId: navigator.id,
//           cabinRole: "navigator",
//           cards: shuffled,
//         };
//         gameState.phaseData = {
//           currentPhase: "navigator_choose_card",
//           title: "انتخاب کارت توسط کشتیران",
//           // message: "کشتیران دو کارت از کاپیتان و افسر اول دریافت کرد...",
//         };
//         gameState.logs.push({
//           type: "phase",
//           text: "🧭 کشتیران در حال انتخاب کارت مسیر است.",
//         });
//       } else {
//         gameState.currentPhase = "navigator_choose_card";
//         gameState.nextPhaseData = {
//           shuffledCards: shuffled,
//           noNavigator: true,
//         };
//         gameState.phaseData = {
//           currentPhase: "navigator_choose_card",
//           title: "انتخاب کارت توسط کشتیران",
//           type: "see",
//           phaseSeen: [],
//           noNavigator: true,
//           // message: "کشتیران دو کارت از کاپیتان و افسر اول دریافت کرد...",
//         };
//         gameState.logs.push({
//           type: "phase",
//           text: "🧭 کشتیران نداریم پس یکی از کارت های انتخابی توسط کاپیتان و افسر اول بصورت رندوم انتخاب می شود.",
//         });
//       }

//       updateAndBroadcastGame(
//         games,
//         gameId,
//         gameState,
//         roomId,
//         room,
//         userSocketMap,
//         io
//       );
//     } else {
//       // اگر هنوز یکی از دو نفر انتخاب نکرده
//       // games.set(gameId, gameState);
//       // // games.set(gameId, { gameState: gameState, roomId });
//       // await gameController.updateGame(gameId, gameState);
//       // // await gameController.updateGame(gameId, { gameState: gameState, roomId });
//       updateAndBroadcastGame(
//         games,
//         gameId,
//         gameState,
//         roomId,
//         room,
//         userSocketMap,
//         io,
//         (saveToMemory = true),
//         (saveToDB = true),
//         (saveToRedis = false),
//         (broadcast = false)
//       );
//     }
//   }
// }

// module.exports = {
//   navigationCardChosen,
// };
