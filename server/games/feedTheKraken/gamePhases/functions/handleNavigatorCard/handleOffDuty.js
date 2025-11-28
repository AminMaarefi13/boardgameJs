/**
 * ریست و تنظیم وضعیت offDuty بازیکنان بر اساس نقش و تعداد نفرات
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} offDutyCards - جدول نقش‌های offDuty
 */
function handleOffDuty(gameState, offDutyCards) {
  gameState.players.forEach((p) => {
    p.offDuty = false;
  });
  const captain = gameState.players.find((p) => p.id === gameState.captainId);
  const firstOfficer = gameState.players.find(
    (p) => p.id === gameState.firstOfficerId
  );
  const navigator = gameState.players.find(
    (p) => p.id === gameState.navigatorId
  );
  const playerCount = gameState.players.length;
  const rolesToOffDuty =
    offDutyCards[gameState.journeyType]?.[playerCount] || [];
  rolesToOffDuty.forEach((role) => {
    switch (role) {
      case "Captain":
        if (captain) captain.offDuty = true;
        break;
      case "Lieutenant":
        if (firstOfficer) firstOfficer.offDuty = true;
        break;
      case "Navigator":
        if (navigator) navigator.offDuty = true;
        break;
    }
  });
}

module.exports = handleOffDuty;
