/**
 * مدیریت انتخاب کارت "cult_guns_stash" (پخش تفنگ)
 * @param {Object} gameState
 * @param {Object} cultLeader
 * @param {string} chosenCard
 */
function handleGunsStash(gameState, cultLeader, chosenCard) {
  gameState.currentPhase = "cult_guns_stash_choice";
  const selectablePlayers = gameState.players.map((p) => {
    let disabledReason = null;
    if (p.eliminated) disabledReason = "بازیکن مرده قابل انتخاب نیست!";
    return {
      id: p.id,
      name: p.name,
      seat: p.seat,
      disabled: Boolean(disabledReason),
      disabledReason,
    };
  });

  gameState.phaseData = {
    currentPhase: "cult_guns_stash_choice",
    title: "مراسم فرقه‌",
    cultLeaderId: cultLeader.id,
  };
  cultLeader.privatePhaseData = {
    currentPhase: chosenCard,
    selectablePlayers,
    cultLeaderId: cultLeader.id,
    type: "cult_guns_stash_choice",
  };
}

module.exports = handleGunsStash;
