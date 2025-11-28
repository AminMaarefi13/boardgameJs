/**
 * مدیریت نتیجه مراسم cult_guns_distributed (توزیع تفنگ‌ها)
 * @param {Object} gameState
 * @param {Object} data
 */
function handleGunsDistributed(gameState, data) {
  const distribution = data.distribution;
  if (!distribution || typeof distribution !== "object") return;

  // به‌روزرسانی تفنگ‌ها در وضعیت بازیکنان
  for (const player of gameState.players) {
    const addedGuns = distribution[player.id] || 0;
    if (!player.guns) player.guns = 0;
    player.guns += addedGuns;
  }

  // ساختن متن اطلاع‌رسانی بر اساس بازیکن‌هایی که تفنگ گرفتن
  const gunReceivers = gameState.players
    .filter((p) => distribution[p.id] > 0)
    .map((p) => `${p.name} (${distribution[p.id]}🔫)`)
    .join("، ");

  gameState.phaseData = {
    currentPhase: "cult_ritual_resolved",
    title: "مراسم فرقه: توزیع تفنگ",
    type: "see",
    gunReceivers,
    ritualType: "cult_guns_distributed",
    phaseSeen: [],
  };
  gameState.nextPhaseData = {
    emergency: false,
  };
}

module.exports = handleGunsDistributed;
