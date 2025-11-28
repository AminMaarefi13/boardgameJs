const handleNoPlayersLeft = require("./handleNoPlayersLeft");

/**
 * مدیریت اثر کارت "telescope" (انتخاب بازیکن توسط کاپیتان)
 * @param {Object} gameState - وضعیت فعلی بازی
 */
function handleTelescope(gameState) {
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
  gameState.currentPhase = "telescope";

  if (selectablePlayers.length > 0) {
    gameState.logs.push({
      type: "phase",
      text: `🔭 کاپیتان باید یک بازیکن را برای تلسکوپ انتخاب کند.`,
    });

    gameState.phaseData = {
      currentPhase: "telescope",
      title: "تلسکوپ",
    };
    const captain = players.find((p) => p.id === captainId);
    captain.privatePhaseData = {
      currentPhase: "telescope",
      title: "انتخاب بازیکن برای تلسکوپ ",
      selectablePlayers,
    };
  } else {
    handleNoPlayersLeft(gameState, "telescope");
  }
}

module.exports = handleTelescope;
