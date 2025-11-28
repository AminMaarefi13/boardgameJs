const { shuffleArray } = require("../../../../../utils/shuffleArray");

/**
 * مدیریت اثر کارت "cult_uprising" (مراسم فرقه)
 * @param {Object} gameState - وضعیت فعلی بازی
 */
function handleCultUprising(gameState) {
  const availableRituals = gameState.cultRitualDeck;

  if (availableRituals.length === 0) {
    gameState.logs.push({
      type: "event",
      text: `🔮 مراسم فرقه‌ انجام نشد چون کارت دیگری باقی نمانده.`,
    });
    return;
  }

  // همه کارت‌های باقی‌مانده رو شافل و ارسال می‌کنیم
  const shuffled = shuffleArray([...availableRituals]);

  gameState.logs.push({
    type: "phase",
    text: `🔮 مراسم فرقه‌ آغاز شد. کاپیتان باید یکی از کارت‌های مخفی را انتخاب کند.`,
  });

  gameState.currentPhase = "cult_uprising";
  gameState.phaseData = {
    currentPhase: "cult_uprising",
    title: "مراسم فرقه‌",
  };
  const captain = gameState.players.find((p) => p.id === gameState.captainId);
  captain.privatePhaseData = {
    options: shuffled,
  };
}

module.exports = handleCultUprising;
