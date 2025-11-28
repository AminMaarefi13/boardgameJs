/**
 * مدیریت انتخاب کارت توسط کاپیتان یا افسر اول
 * @param {Object} gameState - وضعیت فعلی بازی
 * @param {Object} params
 * @param {string} playerId - شناسه بازیکن
 * @param {string} cabinRole - نقش بازیکن (کاپیتان یا افسر اول)
 * @param {Object} chosenCard - کارت انتخابی
 * @param {Object} discardedCard - کارت دورریخته شده
 * @param {Function} updateAndBroadcastGame - تابع ارسال وضعیت بازی
 * @param {Object} updateParams - پارامترهای ارسال وضعیت بازی
 */
function handleCaptainOrOfficer(
  gameState,
  { playerId, cabinRole, chosenCard, discardedCard },
  updateAndBroadcastGame,
  updateParams
) {
  const isCaptain = playerId === gameState.captainId;
  const isFirstOfficer = playerId === gameState.firstOfficerId;

  if (!isCaptain && !isFirstOfficer) return;

  // ثبت انتخاب کاپیتان
  if (isCaptain && !gameState.nextPhaseData.captainCardChosen) {
    gameState.nextPhaseData.captainCardChosen = chosenCard;
    gameState.nextPhaseData.captainCardDiscarded = discardedCard;
    gameState.nextPhaseData.captainSubmitted = true;
  }

  // ثبت انتخاب افسر اول
  if (isFirstOfficer && !gameState.nextPhaseData.officerCardChosen) {
    gameState.nextPhaseData.officerCardChosen = chosenCard;
    gameState.nextPhaseData.officerCardDiscarded = discardedCard;
    gameState.nextPhaseData.officerSubmitted = true;
  }

  // اگر هر دو نفر انتخاب کردند
  if (
    gameState.nextPhaseData.captainSubmitted &&
    gameState.nextPhaseData.officerSubmitted
  ) {
    const finalCards = [
      gameState.nextPhaseData.captainCardChosen,
      gameState.nextPhaseData.officerCardChosen,
    ];

    // دو کارت دورریخته شده به دیسکارد
    gameState.discardPile.push(
      gameState.nextPhaseData.captainCardDiscarded,
      gameState.nextPhaseData.officerCardDiscarded
    );

    // شافل کارت‌ها
    const shuffled = finalCards.sort(() => Math.random() - 0.5);

    // فاز جدید: اگر ناوبر داریم یا نه
    const navigator =
      gameState.players.find((p) => p.id === gameState.navigatorId) || null;

    if (navigator) {
      gameState.currentPhase = "navigator_choose_card";
      gameState.nextPhaseData = {};
      navigator.privatePhaseData = {
        currentPhase: "navigator_choose_card",
        title: "انتخاب کارت توسط کشتیران",
        navigatorId: navigator.id,
        cabinRole: "navigator",
        cards: shuffled,
      };
      gameState.phaseData = {
        currentPhase: "navigator_choose_card",
        title: "انتخاب کارت توسط کشتیران",
      };
      gameState.logs.push({
        type: "phase",
        text: "🧭 کشتیران در حال انتخاب کارت مسیر است.",
      });
    } else {
      gameState.currentPhase = "navigator_choose_card";
      gameState.nextPhaseData = {
        shuffledCards: shuffled,
        noNavigator: true,
      };
      gameState.phaseData = {
        currentPhase: "navigator_choose_card",
        title: "انتخاب کارت توسط کشتیران",
        type: "see",
        phaseSeen: [],
        noNavigator: true,
      };
      gameState.logs.push({
        type: "phase",
        text: "🧭 کشتیران نداریم پس یکی از کارت های انتخابی توسط کاپیتان و افسر اول بصورت رندوم انتخاب می شود.",
      });
    }
    updateAndBroadcastGame(...updateParams);
  } else {
    // اگر هنوز یکی از دو نفر انتخاب نکرده
    updateAndBroadcastGame(...updateParams, true, true, false, false);
  }
}

module.exports = handleCaptainOrOfficer;
