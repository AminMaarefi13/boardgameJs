const buildCabinetLog = require("./buildCabinetLog");

/**
 * منطق تایید کابینه در حالت اضطراری (emergency)
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} captain - آبجکت کاپیتان
 * @param {Object|null} firstOfficer - آبجکت افسر اول یا null
 * @param {Object|null} navigator - آبجکت ناوبر یا null
 */
function handleEmergencyCabinet(gameState, captain, firstOfficer, navigator) {
  // تنظیم فاز و داده‌های فاز
  gameState.currentPhase = "emergency_cabinet_confirmed";
  gameState.phaseData = {
    currentPhase: "emergency_cabinet_confirmed",
    type: "see",
    title: "انتخاب های کاپیتان",
    emergency: true,
    phaseSeen: [],
  };
  captain.privatePhaseData = {};

  // ثبت لاگ مناسب با توجه به وضعیت کابینه
  const log = buildCabinetLog({
    emergency: true,
    captain,
    firstOfficer,
    navigator,
  });
  gameState.logs.push(log);

  // اگر هیچ افسر اول و ناوبری وجود ندارد، فاز را تغییر بده
  if (!firstOfficer && !navigator) {
    gameState.currentPhase = "only_captain_cabinet_confirmed";
  }
}

module.exports = handleEmergencyCabinet;
