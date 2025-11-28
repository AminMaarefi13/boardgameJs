const buildSelectablePlayersNormal = require("./buildSelectablePlayersNormal");

/**
 * منطق اجرای فاز کابینه عادی:
 * - ریست کردن افسر اول و ناوبر
 * - ساخت لیست بازیکنان قابل انتخاب برای کاپیتان
 * - اگر فقط یک بازیکن فعال باشد، بازیکنان offDuty را هم فعال می‌کند
 * - تنظیم داده‌های فاز و پیام‌های خصوصی برای کاپیتان
 * - ثبت لاگ مربوط به این فاز
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} captain - آبجکت بازیکن کاپیتان
 * @returns {Array} selectablePlayers - لیست بازیکنان قابل انتخاب
 */
function handleNormalPhase(gameState, captain) {
  gameState.firstOfficerId = null;
  gameState.navigatorId = null;

  let selectablePlayers = buildSelectablePlayersNormal(gameState);
  let enabledCount = selectablePlayers.filter((p) => !p.disabled).length;

  // اگر فقط یک بازیکن فعال باشد، بازیکنان offDuty را هم فعال کن
  if (enabledCount <= 1) {
    selectablePlayers = selectablePlayers.map((p) => {
      if (
        p.disabled &&
        p.disabledReason &&
        p.disabledReason.includes("کابینه قبلی")
      ) {
        return {
          ...p,
          disabled: false,
          disabledReason: null,
        };
      }
      return p;
    });
  }

  gameState.phaseData = {
    currentPhase: "cabinet_formation",
    step: "waitingForCabinet",
    title: "تشکیل کاببینه",
    emergency: false,
  };
  captain.privatePhaseData = {
    currentPhase: "cabinet_formation",
    step: "waitingForCabinet",
    selectablePlayers,
    emergency: false,
    title: "تشکیل کاببینه",
    message: "شما باید یک افسر اول و یک کشتیران را انتخاب کنید.",
  };
  gameState.logs.push({
    type: "phase",
    text: `📋 کاپیتان باید یک افسر اول و یک کشتیران انتخاب کند.`,
  });

  return selectablePlayers;
}

module.exports = handleNormalPhase;
