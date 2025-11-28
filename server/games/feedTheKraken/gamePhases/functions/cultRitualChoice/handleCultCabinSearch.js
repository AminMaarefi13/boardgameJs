/**
 * مدیریت انتخاب کارت "cult_cabin_search" (دیدن نقش کابین)
 * @param {Object} gameState
 * @param {Object} cultLeader
 */
function handleCultCabinSearch(gameState, cultLeader) {
  gameState.currentPhase = "cult_cabin_search_result";
  const cabinRoles = ["captain", "firstOfficer", "navigator"];
  const cabinInfo = cabinRoles.map((cabinetRole) => {
    let player;
    if (cabinetRole === "captain") {
      player = gameState.players.find((p) => p.id === gameState.captainId);
    } else if (cabinetRole === "firstOfficer") {
      player = gameState.players.find((p) => p.id === gameState.firstOfficerId);
    } else if (cabinetRole === "navigator") {
      player = gameState.players.find((p) => p.id === gameState.navigatorId);
    }
    return {
      cabinRole: cabinetRole,
      role: player?.role || "نامشخص",
      name: player?.name || "نامشخص",
      initialRole: player?.initialRole || null,
    };
  });
  gameState.phaseData = {
    currentPhase: "cult_cabin_search_result",
    title: "مراسم فرقه‌",
    cultLeaderId: cultLeader.id,
  };
  cultLeader.privatePhaseData = {
    cabinInfo,
    type: "cult_cabin_search_result",
    cultLeaderId: cultLeader.id,
  };
}

module.exports = handleCultCabinSearch;
