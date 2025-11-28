const handleNoPlayersLeft = require("./handleNoPlayersLeft");

/**
 * مدیریت اثر کارت "drunk" (تغییر کاپیتان)
 * @param {Object} gameState - وضعیت فعلی بازی
 */
function handleDrunk(gameState) {
  const players = gameState.players;
  const captainId = gameState.captainId;
  const currentCaptainIndex = players.findIndex((p) => p.id === captainId);

  // پیدا کردن کمترین تعداد رزومه بین بازیکنان واجد شرایط
  let minResume = Infinity;
  for (const player of players) {
    if (!player.eliminated && !player.tongueOff) {
      minResume = Math.min(minResume, player.resume.length);
    }
  }

  // پیدا کردن اولین بازیکن در جهت ساعتگرد با همین تعداد رزومه
  let newCaptain = null;
  for (let i = 1; i < players.length; i++) {
    const nextIndex = (currentCaptainIndex + i) % players.length;
    const nextPlayer = players[nextIndex];
    if (
      !nextPlayer.eliminated &&
      !nextPlayer.tongueOff &&
      nextPlayer.resume.length === minResume
    ) {
      newCaptain = nextPlayer;
      break;
    }
  }
  // if (newCaptain === null) {
  //   newCaptain = players[currentCaptainIndex];
  // }

  if (newCaptain) {
    gameState.captainId = newCaptain.id;
    gameState.logs.push({
      type: "event",
      text: `🍺 کاپیتان تغییر کرد! کاپیتان جدید: ${newCaptain.name}`,
    });
    gameState.currentPhase = "drunk";
    gameState.phaseData = {
      currentPhase: "drunk",
      title: "کارت مست",
      type: "see",
      phaseSeen: [],
      newCaptainName: newCaptain.name,
    };
    gameState.nextPhaseData = {
      emergency: false,
    };
  } else {
    handleNoPlayersLeft(gameState, "drunk");
  }
}

module.exports = handleDrunk;
