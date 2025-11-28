/**
 * مدیریت انتخاب کارت "cult_conversion" (پیوستن بازیکن جدید به فرقه)
 * @param {Object} gameState
 * @param {Object} cultLeader
 * @param {Map} userSocketMap
 */
function handleConversion(gameState, cultLeader, userSocketMap) {
  gameState.currentPhase = "cult_conversion_choice";
  const socketId = userSocketMap.get(cultLeader.id);
  if (!socketId) return;

  const selectablePlayers = gameState.players.map((p) => {
    let disabledReason = null;
    if (p.id === cultLeader.id) {
      disabledReason = "رهبر فرقه نمی‌تواند خودش را انتخاب کند!";
    } else if (p.eliminated) {
      disabledReason = "بازیکن حذف شده است.";
    } else if (!p.canJoinCult) {
      disabledReason = "این بازیکن نمی‌تواند به فرقه بپیوندد.";
    }
    return {
      id: p.id,
      name: p.name,
      seat: p.seat,
      disabled: Boolean(disabledReason),
      disabledReason,
    };
  });

  if (selectablePlayers.length > 0) {
    gameState.phaseData = {
      currentPhase: "cult_conversion_choice",
      title: "مراسم فرقه‌",
      cultLeaderId: cultLeader.id,
    };
    cultLeader.privatePhaseData = {
      selectablePlayers,
      cultLeaderId: cultLeader.id,
      type: "cult_conversion_choice",
    };
  }
}

module.exports = handleConversion;
