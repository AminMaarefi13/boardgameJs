/**
 * ساخت لیست بازیکنان قابل انتخاب برای کابینه عادی
 * محدودیت‌ها شامل: کاپیتان، حذف‌شده‌ها، offDuty و بریده‌زبان‌ها
 * @param {Object} gameState - وضعیت فعلی بازی
 * @returns {Array} selectablePlayers - لیست بازیکنان با وضعیت فعال/غیرفعال
 */
function buildSelectablePlayersNormal(gameState) {
  return gameState.players.map((p) => {
    let disabledReason = null;
    if (p.id === gameState.captainId) {
      disabledReason = "کاپیتان نمی‌تواند خودش را انتخاب کند!";
    } else if (p.eliminated) {
      disabledReason = "بازیکن از بازی حذف شده است";
    } else if (p.offDuty) {
      disabledReason = "بازیکن در کابینه قبلی حضور داشته است (off-duty).";
    }
    // else if (p.tongueOff) {
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

module.exports = buildSelectablePlayersNormal;
