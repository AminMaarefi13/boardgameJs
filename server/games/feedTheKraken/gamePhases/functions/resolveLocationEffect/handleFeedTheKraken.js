/**
 * مدیریت افکت feed_the_kraken (قربانی کردن بازیکن)
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} targetPlayer - بازیکن هدف
 * @param {Object} io - شیء سوکت اصلی
 * @param {string} captainSocketId - سوکت آی‌دی کاپیتان
 * @returns {boolean} - اگر بازی تمام شد true برمی‌گرداند
 */
function handleFeedTheKraken(gameState, targetPlayer, io, captainSocketId) {
  // نمی‌توان خودش را انتخاب کند
  if (targetPlayer.id === gameState.captainId) {
    if (captainSocketId) {
      io.to(captainSocketId).emit("error", {
        message: "❌ نمی‌توانی خودت را به کراکن قربانی کنی!",
      });
    }
    return false;
  }

  targetPlayer.eliminated = true;
  gameState.logs.push({
    type: "effect",
    text: `🦑 بازیکن ${targetPlayer.name} قربانی کراکن شد.`,
  });

  // اگر کرکن بود، Cult فوراً برنده می‌شود
  if (targetPlayer.role === "cultLeader") {
    gameState.logs.push({
      type: "win",
      text: "🧿 رهبر فرقه قربانی شد! تیم فرقه پیروز شد!",
    });
    gameState.winner = "cult";
    gameState.currentPhase = "game_over";
    gameState.phaseData = {};
    gameState.logs.push({
      type: "event",
      text: `🏁 بازی به پایان رسید. جناح برنده: ${gameState.winner}`,
    });
    gameState.phaseData = {
      currentPhase: "game_over",
      title: "پایان بازی",
      winner: gameState.winner,
      noLocationEffect: false,
    };
    return true;
  }

  gameState.phaseData = {
    currentPhase: "location_effect_resolved",
    title: "قربانی کراکن",
    type: "see",
    phaseSeen: [],
    nodeType: "feed_the_kraken",
    targetPlayerName: targetPlayer.name,
  };

  return false;
}

module.exports = handleFeedTheKraken;
