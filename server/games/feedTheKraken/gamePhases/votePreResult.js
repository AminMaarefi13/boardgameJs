const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const handleMutinyFail = require("./functions/votePreResult/handleMutinyFail");
const handleMutinySuccess = require("./functions/votePreResult/handleMutinySuccess");
const handleVoteTie = require("./functions/votePreResult/handleVoteTie");

/**
 * مدیریت نتیجه اولیه رأی‌گیری شورش با استفاده از سوییچ و توابع جداگانه
 * @param {Map} games
 * @param {string} gameId
 * @param {Map} rooms
 * @param {Map} userSocketMap
 * @param {Object} io
 * @param {Object} preparedData
 * @param {Object} eventSpecificData
 */
async function votePreResult(
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
  const { result } = preparedData;
  const submittedVotes = result;

  // محاسبه مجموع تفنگ‌ها و تعداد لازم
  const totalGuns = submittedVotes.reduce((sum, v) => sum + v.gunsUsed, 0);
  const playerCount = gameState.players.length;
  const requiredGuns = playerCount <= 7 ? 3 : playerCount <= 9 ? 4 : 5;

  // سوییچ بر اساس موفقیت یا شکست شورش
  switch (true) {
    case totalGuns < requiredGuns:
      handleMutinyFail(gameState, totalGuns, requiredGuns);
      break;
    default: {
      const topCandidates = handleMutinySuccess(
        gameState,
        submittedVotes,
        totalGuns,
        requiredGuns
      );
      // اگر بیش از یک نفر بیشترین تفنگ را دارد، تساوی رخ داده
      if (topCandidates.length > 1) {
        handleVoteTie(gameState, topCandidates, totalGuns, requiredGuns);
      }
      break;
    }
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
  votePreResult,
};