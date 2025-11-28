/**
 * مدیریت حالت موفقیت شورش (کاپیتان جدید انتخاب می‌شود)
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Array} submittedVotes - آرایه رأی‌های ثبت‌شده
 * @param {number} totalGuns - مجموع تفنگ‌های استفاده شده
 * @param {number} requiredGuns - تعداد تفنگ لازم برای موفقیت شورش
 */
function handleMutinySuccess(
  gameState,
  submittedVotes,
  totalGuns,
  requiredGuns
) {
  // کم کردن تفنگ‌ها از بازیکنان
  submittedVotes.forEach((v) => {
    const p = gameState.players.find((p) => p.id === v.playerId);
    p.guns -= v.gunsUsed;
  });

  gameState.logs.push({
    type: "event",
    text: `✅ شورش موفق بود! کاپیتان جدید در راه است...`,
  });

  // اگر بازیکنی tongueOff باشد، از رأی‌ها حذف می‌شود
  const tongueOffPlayer = gameState.players.find((p) => p.tongueOff);
  const submittedVotesExceptTongueOff = submittedVotes.filter(
    (v) => v.playerId !== tongueOffPlayer?.id
  );
  const maxGuns = Math.max(
    ...submittedVotesExceptTongueOff.map((v) => v.gunsUsed)
  );

  // پیدا کردن بازیکنان با بیشترین تفنگ
  const topCandidates = submittedVotes.filter((v) => v.gunsUsed === maxGuns);

  // اگر فقط یک نفر بیشترین تفنگ را دارد، او کاپیتان جدید می‌شود
  if (topCandidates.length === 1) {
    const newCaptainId = topCandidates[0].playerId;
    gameState.captainId = newCaptainId;
    gameState.navigatorId = null;
    gameState.firstOfficerId = null;
    gameState.players.forEach((p) => {
      p.isCaptain = p.id === gameState.captainId;
    });

    gameState.logs.push({
      type: "event",
      text: `🎖 ${topCandidates[0].nickname} کاپیتان جدید شد.`,
    });
    gameState.currentPhase = "mutiny_success";
    gameState.phaseData = {
      currentPhase: "mutiny_success",
      title: "نتیجه رای گیری",
      type: "see",
      phaseSeen: [],
      totalGuns,
      maxGuns,
      newCaptain: topCandidates[0].nickname,
      requiredGuns,
    };
    gameState.nextPhaseData = {
      emergency: false,
    };
  }

  return topCandidates;
}

module.exports = handleMutinySuccess;
