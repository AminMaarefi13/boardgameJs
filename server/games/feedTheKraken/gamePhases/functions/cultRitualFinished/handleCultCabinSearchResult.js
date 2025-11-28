/**
 * مدیریت نتیجه مراسم cult_cabin_search (دیدن نقش‌های کابین توسط رهبر فرقه)
 * @param {Object} gameState
 * @param {Object} cultLeader
 */
function handleCultCabinSearchResult(gameState, cultLeader) {
  const cabinet = [
    gameState.captainId,
    gameState.firstOfficerId,
    gameState.navigatorId,
  ].filter((id) => id !== null);

  const knowRolesArr = cabinet.map((id) => {
    const player = gameState.players.find((p) => p.id === id);
    return {
      playerId: id,
      playerName: player.name,
      role: player.role,
      phase: "cult_cabin_search",
    };
  });

  cultLeader.knownRoles.push(knowRolesArr);

  gameState.phaseData = {
    currentPhase: "cult_ritual_resolved",
    title: "مراسم فرقه: دیدن نقش های کابین",
    type: "see",
    ritualType: "cult_cabin_search",
    phaseSeen: [],
  };
  gameState.nextPhaseData = {
    emergency: false,
  };
}

module.exports = handleCultCabinSearchResult;
