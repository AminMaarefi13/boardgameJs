const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const buildVoteEntry = require("./functions/submitVote/buildVoteEntry");
const checkVoteEligibility = require("./functions/submitVote/checkVoteEligibility");
const handleVoteResult = require("./functions/submitVote/handleVoteResult");
const updateVoteProgress = require("./functions/submitVote/updateVoteProgress");

/**
 * ثبت رأی بازیکن در فاز رأی‌گیری کابینه (تابع اصلی)
 * @param {Map} games
 * @param {string} gameId
 * @param {Map} rooms
 * @param {Map} userSocketMap
 * @param {Object} io
 * @param {Object} preparedData
 * @param {Object} eventSpecificData
 */
async function submitVote(
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

  const { playerId, gunsUsed } = eventSpecificData;
  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return;

  const sessionId = gameState.currentVoteSessionId;

  // بررسی شرایط رأی دادن
  if (
    !checkVoteEligibility(
      gameState,
      player,
      playerId,
      sessionId,
      userSocketMap,
      io
    )
  ) {
    return;
  }

  // لیست رأی‌دهندگان مجاز (همه به جز کاپیتان و حذف‌شده‌ها)
  const eligibleVoters = gameState.players.filter(
    (p) => p.id !== gameState.captainId && !p.eliminated
  );
  // آیا بازیکن مجاز است؟
  const isEligible = eligibleVoters.some((p) => p.id === playerId);

  // ساخت و ثبت رأی
  const voteEntry = buildVoteEntry(
    player,
    playerId,
    gunsUsed,
    sessionId,
    isEligible
  );
  player.votes.push(voteEntry);

  // لیست کسانی که رأی داده‌اند
  const submittedVotes = eligibleVoters.filter((p) =>
    p.votes.some((v) => v.voteSessionId === sessionId)
  );

  // به‌روزرسانی وضعیت رأی‌گیری و ارسال به کلاینت‌ها
  updateVoteProgress(gameState, eligibleVoters, submittedVotes);

  // اگر همه رأی دادند، نتایج رأی‌گیری را آماده و ارسال کن
  if (submittedVotes.length === eligibleVoters.length) {
    handleVoteResult(gameState, submittedVotes, sessionId);
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
  submitVote,
};
