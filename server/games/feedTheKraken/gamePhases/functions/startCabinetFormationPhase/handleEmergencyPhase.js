const buildSelectablePlayersEmergency = require("./buildSelectablePlayersEmergency");

/**
 * منطق اجرای فاز کابینه اضطراری:
 * - ساخت لیست بازیکنان قابل انتخاب برای کاپیتان
 * - تنظیم داده‌های فاز و پیام‌های خصوصی برای کاپیتان
 * - ثبت لاگ مربوط به این فاز
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} captain - آبجکت بازیکن کاپیتان
 * @returns {Array} selectablePlayers - لیست بازیکنان قابل انتخاب
 */
function handleEmergencyPhase(gameState, captain) {
  const selectablePlayers = buildSelectablePlayersEmergency(gameState);

  gameState.phaseData = {
    currentPhase: "cabinet_formation",
    step: "waitingForCabinet",
    title: "تشکیل کابینه اضطراری",
    emergency: true,
  };
  captain.privatePhaseData = {
    currentPhase: "cabinet_formation",
    step: "waitingForCabinet",
    selectablePlayers,
    emergency: true,
    title: "تشکیل کاببینه اضطراری",
    message: "شما باید یک کشتیران را انتخاب کنید.",
  };
  gameState.logs.push({
    type: "phase",
    text: `📋 کاپیتان باید یک کشتیران برای کابینه اضطراری انتخاب کند.`,
  });

  return selectablePlayers;
}

module.exports = handleEmergencyPhase;
