const { shuffleArray } = require("../../../../../utils/shuffleArray");

/**
 * مدیریت افکت شلاق (flogging)
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} targetPlayer - بازیکن هدف
 * @param {string} targetPlayerId - شناسه بازیکن هدف
 */
function handleFlogging(gameState, targetPlayer, targetPlayerId) {
  targetPlayer.canJoinCult = false;
  const realRole = targetPlayer.role;
  let realCard;
  if (realRole === "sailor") {
    realCard = "sailor";
  } else if (realRole === "pirate") {
    realCard = "pirate";
  } else if (realRole === "cultLeader" || realRole === "cultist") {
    realCard = "cult";
  } else {
    console.warn("نقش ناشناخته برای شلاق:", realRole);
    return;
  }

  const floggingCards = ["sailor", "pirate", "cult"];
  const fakeCards = floggingCards.filter((card) => card !== realCard);

  gameState.phaseData = {
    currentPhase: "select_flogging_card",
    title: "من ... نیستم",
    nodeType: "flogging",
    targetPlayerName: targetPlayer.name,
    noLocationEffect: false,
  };
  const captain = gameState.players.find((pl) => pl.id === gameState.captainId);
  captain.privatePhaseData = {
    targetPlayerId,
    options: shuffleArray(fakeCards),
  };
}

module.exports = handleFlogging;
