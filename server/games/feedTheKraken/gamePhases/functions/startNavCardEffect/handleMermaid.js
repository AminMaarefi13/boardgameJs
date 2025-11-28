/**
 * مدیریت اثر کارت "mermaid" (انتخاب بازیکن توسط کاپیتان)
 * @param {Object} gameState - وضعیت فعلی بازی
 */
function handleMermaid(gameState) {
  const players = gameState.players;
  const captainId = gameState.captainId;

  const selectablePlayers = players.map((p) => {
    let disabled = false;
    let disabledReason = null;

    if (p.eliminated) {
      disabled = true;
      disabledReason = "این بازیکن حذف شده است.";
    } else if (p.id === captainId) {
      disabled = true;
      disabledReason = "کاپیتان نمی‌تواند خودش را انتخاب کند.";
    }

    return {
      id: p.id,
      name: p.name,
      seat: p.seat,
      disabled,
      disabledReason,
    };
  });

  gameState.currentPhase = "mermaid";

  if (selectablePlayers.length > 0) {
    gameState.logs.push({
      type: "phase",
      text: `🧜‍♀️ کاپیتان باید یک بازیکن را برای پری دریایی انتخاب کند.`,
    });

    gameState.phaseData = {
      currentPhase: "mermaid",
      title: "پری دریایی",
    };
    const captain = players.find((p) => p.id === captainId);
    captain.privatePhaseData = {
      currentPhase: "mermaid",
      title: "انتخاب بازیکن برای پری دریایی",
      selectablePlayers,
    };
  } else {
    handleNoPlayersLeft(gameState, "mermaid");
  }
}

module.exports = handleMermaid;
