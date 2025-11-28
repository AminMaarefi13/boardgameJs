export function canBuyDevCard(devCard, player) {
  if (!devCard || !devCard.cost || !player)
    return { chipCounts: {}, devCounts: {}, chipsNeeded: {} };

  // console.log(player.chips);

  // شمارش چیپ‌های بازیکن بر اساس رنگ
  const chipCounts = {
    white: 0,
    blue: 0,
    red: 0,
    green: 0,
    black: 0,
    yellow: 0,
    pearl: 0,
  };
  (player.chips || []).forEach(({ color, quantity }) => {
    if (chipCounts[color] !== undefined) chipCounts[color] += quantity;
  });

  // console.log(player.devCards);
  // شمارش کارت‌های dev بازیکن بر اساس رنگ
  const devCounts = { white: 0, blue: 0, red: 0, green: 0, black: 0, joker: 0 };
  (player.devCards || []).forEach(({ bonus, color, newColor }) => {
    if (devCounts[color] !== undefined) {
      // console.log("color: ", color);
      // console.log("newColor: ", newColor);
      // console.log("bonus: ", bonus);
      if (color === "joker") {
        if (bonus) {
          devCounts[newColor]++;
        }
        devCounts[newColor]++;
      } else {
        if (bonus) {
          devCounts[color]++;
        }
        devCounts[color]++;
      }
    }
  });

  // محاسبه چیپ مورد نیاز برای هر رنگ
  const chipsNeeded = {
    white: 0,
    blue: 0,
    red: 0,
    green: 0,
    black: 0,
    yellow: 0,
    pearl: 0,
  };
  for (const color of ["white", "blue", "red", "green", "black", "pearl"]) {
    const cost = devCard.cost[color] || 0;
    const discount = devCounts[color] || 0;
    chipsNeeded[color] = Math.max(0, cost - discount);
  }

  const chipsNeededSum = [
    "white",
    "blue",
    "red",
    "green",
    "black",
    "pearl",
  ].reduce((sum, color) => sum + chipsNeeded[color] || 0, 0);

  // محاسبه چیپ مورد نیاز برای هر رنگ
  const chipsDifference = {
    white: 0,
    blue: 0,
    red: 0,
    green: 0,
    black: 0,
    yellow: 0,
    pearl: 0,
  };
  for (const color of ["white", "blue", "red", "green", "black", "pearl"]) {
    const cost = devCard.cost[color] || 0;
    const chip = chipCounts[color] || 0;
    const devCardCount = devCounts[color] || 0;
    chipsDifference[color] = Math.max(0, cost - chip - devCardCount);
  }

  const chipsDifferenceSum = [
    "white",
    "blue",
    "red",
    "green",
    "black",
    "pearl",
  ].reduce((sum, color) => sum + chipsDifference[color] || 0, 0);

  const hasEnoughChips = [
    "white",
    "blue",
    "red",
    "green",
    "black",
    "pearl",
  ].every((color) => (chipCounts[color] || 0) >= (chipsNeeded[color] || 0));

  const canBuyWithYellow = chipCounts.yellow >= chipsDifferenceSum;
  //  && chipCounts.yellow > 0;
  if (canBuyWithYellow) {
    chipsNeeded.yellow = chipsDifferenceSum;
    chipsDifference.yellow = chipsDifferenceSum;
  }

  const canBuyJokerCard =
    player.devCards.filter((card) => card.color !== "points").length > 0;

  return {
    chipCounts,
    devCounts,
    chipsNeeded,
    chipsDifference,
    hasEnoughChips,
    chipsNeededSum,
    chipsDifferenceSum,
    canBuyWithYellow,
    canBuyJokerCard,
  };
}
