function checkGameOver(player, gameState) {
  // ساخت یک آبجکت برای جمع امتیاز هر رنگ
  const colorSums = {};
  (player?.devCards || []).forEach((card) => {
    if (!colorSums[card.color]) {
      if (card.color === "joker") {
        if (!colorSums[card.newColor]) {
          colorSums[card.newColor] = card.prestigePoints || 0;
        } else {
          colorSums[card.newColor] += card.prestigePoints || 0;
        }
      } else if (card.color === "points") {
      } else {
        colorSums[card.color] = 0;
      }
    }
    if (card.color === "joker" || card.color === "points") {
    } else {
      colorSums[card.color] += card.prestigePoints || 0;
    }

    console.log(card.color);
    console.log(card.prestigePoints);
    console.log(colorSums[card.color]);
  });
  console.log(colorSums);
  // آیا در هر رنگی مجموع >= 10 است؟
  const hasColorWith10 = Object.values(colorSums).some((sum) => sum >= 10);
  console.log(hasColorWith10);
  const winner =
    player.prestigePoints >= 20 || player.crownsOwned >= 10 || hasColorWith10;
  console.log("winner: ", winner);
  if (winner) {
    console.log("winnerrrrrr");
    gameState.currentPhase = "game_over";
    gameState.phaseData = { winner: player };
  }
  return winner;
}

module.exports = checkGameOver;
