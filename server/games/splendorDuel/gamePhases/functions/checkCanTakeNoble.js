function checkCanTakeNoble(player, type, gameState) {
  // بررسی امکان گرفتن نوبل
  const canTakeNoble =
    (player.crownsOwned >= 3 &&
      player.crownsOwned < 6 &&
      player.nobleTilesOwned.length === 0) ||
    (player.crownsOwned >= 6 && player.nobleTilesOwned.length === 1)
      ? true
      : false;

  console.log("canTakeNoble");
  console.log(canTakeNoble);

  if (canTakeNoble && type !== "noble_card_buy") {
    gameState.currentPhase = "noble_phase";
    console.log("تغییر فاز به noble_phase");
    return true;
  } else {
    return false;
  }
}

module.exports = checkCanTakeNoble;
