function checkCanTakeNoble(player, type, gameState) {
  // فرض: player.devCards آرایه‌ای از کارت‌های توسعه است که هرکدام color دارند
  // فرض: gameState.nobleTilesDeck آرایه‌ای از کارت‌های نوبل است که هرکدام cost دارد (مثلاً { white: 3, red: 3, ... })
  // فرض: gameState.players آرایه بازیکنان است و gameState.turn شماره بازیکن فعلی است
  // فرض: setPhase و setTurn توابع تغییر state هستند

  // شمارش کارت‌های هر رنگ بازیکن
  const devCardCounts = {};
  ["white", "blue", "red", "green", "black"].forEach((color) => {
    devCardCounts[color] = player.devCards.filter(
      (c) => c?.color === color
    ).length;
  });
  console.log("devCardCounts");
  console.log(devCardCounts);

  // بررسی امکان گرفتن نوبل
  const canTakeNoble = gameState.nobleTilesDeck.some((noble) => {
    return Object.entries(noble.cost).every(
      ([color, count]) => (devCardCounts[color] || 0) >= count
    );
  });
  console.log("canTakeNoble");
  console.log(canTakeNoble);

  if (canTakeNoble && type !== "noble_card_buy") {
    gameState.currentPhase = "noble_phase";
    console.log("تغییر فاز به noble_phase");
    return true;
  } else {
    // تغییر نوبت به بازیکن بعدی
    gameState.currentPhase = "confirm_move";
    const nextTurn = (gameState.turn + 1) % gameState.players.length;
    gameState.turn = nextTurn;
    console.log("تغییر نوبت به بازیکن بعدی:", nextTurn);
    return false;
  }
}

module.exports = checkCanTakeNoble;
