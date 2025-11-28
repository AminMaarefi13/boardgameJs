/**
 * مدیریت افکت cabin_search (دیدن نقش بازیکن)
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} targetPlayer - بازیکن هدف
 * @param {string} targetPlayerId - شناسه بازیکن هدف
 */
function handleCabinSearch(gameState, targetPlayer, targetPlayerId) {
  targetPlayer.canJoinCult = false;

  const revealedRole = targetPlayer.role;
  const initialRole = targetPlayer.initialRole;
  const captain = gameState.players.find((p) => p.id === gameState.captainId);

  gameState.phaseData = {
    currentPhase: "location_effect_resolved",
    title: "دیدن نقش",
    type: "see",
    phaseSeen: [],
    nodeType: "cabin_search",
    targetPlayerName: targetPlayer.name,
    noLocationEffect: false,
  };
  captain.privatePhaseData = {
    targetName: targetPlayer.name,
    role: revealedRole,
    initialRole,
  };

  captain.knownRoles.push({
    playerId: targetPlayerId,
    role: targetPlayer.role,
    phase: "cabin_search",
  });

  gameState.logs.push({
    type: "effect",
    text: `🔍 کاپیتان نقش ${targetPlayer.name} را مشاهده کرد.`,
  });
}

module.exports = handleCabinSearch;
