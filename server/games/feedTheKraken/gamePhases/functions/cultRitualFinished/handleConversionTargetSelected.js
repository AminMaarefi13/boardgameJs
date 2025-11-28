/**
 * مدیریت نتیجه مراسم cult_conversion_target_selected (پیوستن بازیکن جدید به فرقه)
 * @param {Object} gameState
 * @param {Object} cultLeader
 * @param {Object} data
 */
function handleConversionTargetSelected(gameState, cultLeader, data) {
  const targetPlayerId = data.targetPlayerId || null;
  if (!targetPlayerId) {
    gameState.phaseData = {
      currentPhase: "cult_ritual_resolved",
      title: "مراسم فرقه‌",
      type: "see",
      ritualType: "cult_conversion_target_selected",
      phaseSeen: [],
    };
    gameState.nextPhaseData = {
      emergency: false,
    };
    return;
  }

  const target = gameState.players.find((p) => p.id === targetPlayerId);
  if (!target) return;

  // بازیکن عضو فرقه می‌شود
  target.initialRole = target.role;
  target.role = "cultist";
  target.canJoinCult = false;

  if (cultLeader) {
    cultLeader.knownRoles.push({
      playerId: target.id,
      playerName: target.name,
      role: target.role,
      phase: "cult_conversion",
    });
    target.knownRoles.push({
      playerId: cultLeader.id,
      playerName: cultLeader.name,
      role: cultLeader.role,
      phase: "cult_conversion",
    });

    gameState.phaseData = {
      currentPhase: "cult_ritual_resolved",
      title: "مراسم فرقه‌",
      type: "see",
      ritualType: "cult_conversion_target_selected",
      phaseSeen: [],
    };
    target.privatePhaseData = {
      type: "cult_info",
      cultLeaderId: cultLeader.id,
      cultLeaderName: cultLeader.name,
    };
    cultLeader.privatePhaseData = {
      type: "cult_info",
      targetId: target.id,
      targetName: target.name,
    };
  }
  gameState.nextPhaseData = {
    emergency: false,
  };
}

module.exports = handleConversionTargetSelected;
