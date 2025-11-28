const buildCabinetLog = require("./buildCabinetLog");

/**
 * منطق تایید کابینه در حالت عادی (غیر اضطراری)
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} captain - آبجکت کاپیتان
 * @param {Object|null} firstOfficer - آبجکت افسر اول یا null
 * @param {Object|null} navigator - آبجکت ناوبر یا null
 */
function handleNormalCabinet(gameState, captain, firstOfficer, navigator) {
  // تنظیم فاز و داده‌های فاز
  gameState.currentPhase = "cabinet_confirmed";
  gameState.phaseData = {
    currentPhase: "cabinet_confirmed",
    type: "see",
    title: "انتخاب های کاپیتان",
    emergency: false,
    phaseSeen: [],
  };
  captain.privatePhaseData = {};

  // ثبت لاگ مناسب با توجه به وضعیت کابینه
  const log = buildCabinetLog({
    emergency: false,
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

module.exports = handleNormalCabinet;
