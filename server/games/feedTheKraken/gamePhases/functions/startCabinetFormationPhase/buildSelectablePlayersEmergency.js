/**
 * ساخت لیست بازیکنان قابل انتخاب برای کابینه اضطراری
 * در این حالت فقط انتخاب کشتیران مجاز است و محدودیت‌های خاصی اعمال می‌شود.
 * @param {Object} gameState - وضعیت فعلی بازی
 * @returns {Array} selectablePlayers - لیست بازیکنان با وضعیت فعال/غیرفعال
 */
function buildSelectablePlayersEmergency(gameState) {
  return gameState.players.map((p) => {
    let disabledReason = null;
    // کاپیتان نمی‌تواند خودش را انتخاب کند
    if (p.id === gameState.captainId) {
      disabledReason = "کاپیتان نمی‌تواند خودش را انتخاب کند!";
    } else if (p.eliminated) {
      disabledReason = "بازیکن از بازی حذف شده است";
    } else if (p.id === gameState.firstOfficerId) {
      disabledReason = "افسر اول را نمیتوان به عنوان کشتیران انتخاب کرد.";
    }
    //  else if (p.tongueOff) {
    //   disabledReason = "بازیکنی که زبانش بریده شده نمیتواند کاپیتان باشد.";
    // }
    return {
      id: p.id,
      name: p.name,
      seat: p.seat,
      disabled: Boolean(disabledReason),
      disabledReason,
    };
  });
}

module.exports = buildSelectablePlayersEmergency;
