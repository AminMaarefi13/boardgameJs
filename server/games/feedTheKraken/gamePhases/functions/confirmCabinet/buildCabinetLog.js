/**
 * ساخت لاگ مناسب برای وضعیت کابینه
 * @param {Object} params
 * @param {boolean} params.emergency - آیا حالت اضطراری است؟
 * @param {Object} params.captain - آبجکت کاپیتان
 * @param {Object|null} params.firstOfficer - آبجکت افسر اول یا null
 * @param {Object|null} params.navigator - آبجکت ناوبر یا null
 * @returns {Object} log - آبجکت لاگ مناسب
 */
function buildCabinetLog({ emergency, captain, firstOfficer, navigator }) {
  if (!firstOfficer && !navigator) {
    return {
      type: emergency
        ? "only_captain_cabinet_confirmed"
        : "only_captain_cabinet_confirmed",
      emergency,
      text: `🎖️ کاپیتان ${captain.name}: افسر اول و کشتیران انتخاب نشده‌اند. کارت‌ها برای هر دو نقش به صورت تصادفی انتخاب می‌شوند.`,
    };
  }
  if (!firstOfficer) {
    return {
      type: emergency ? "emergency_cabinet_confirmed" : "cabinet_confirmed",
      emergency,
      text: `🎖️ کاپیتان ${captain.name}: کشتیران ${navigator?.name} انتخاب شد. افسر اول انتخاب نشده و کارت آن نقش به صورت تصادفی انتخاب می‌شود.`,
    };
  }
  if (!navigator) {
    return {
      type: emergency ? "emergency_cabinet_confirmed" : "cabinet_confirmed",
      emergency,
      text: `🎖️ کاپیتان ${captain.name}: افسر اول ${firstOfficer?.name} انتخاب شد. کشتیران انتخاب نشده و کارت آن نقش به صورت تصادفی انتخاب می‌شود.`,
    };
  }
  // هر دو نقش انتخاب شده‌اند
  return {
    type: emergency ? "emergency_cabinet_confirmed" : "cabinet_confirmed",
    emergency,
    text: `🎖️ کاپیتان ${captain.name}: افسر اول ${firstOfficer?.name} و کشتیران ${navigator?.name} انتخاب شدند.`,
  };
}

module.exports = buildCabinetLog;
