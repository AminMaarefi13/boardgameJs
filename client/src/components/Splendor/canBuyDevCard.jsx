export function canBuyDevCard(devCard, player) {
  if (!devCard || !devCard.cost || !player)
    return { chipCounts: {}, devCounts: {}, chipsNeeded: {} };

  console.log(player.chips);

  // شمارش چیپ‌های بازیکن بر اساس رنگ
  const chipCounts = {
    white: 0,
    blue: 0,
    red: 0,
    green: 0,
    black: 0,
    yellow: 0,
  };
  (player.chips || []).forEach(({ color, quantity }) => {
    if (chipCounts[color] !== undefined) chipCounts[color] += quantity;
  });

  console.log(player.devCards);
  // شمارش کارت‌های dev بازیکن بر اساس رنگ
  const devCounts = { white: 0, blue: 0, red: 0, green: 0, black: 0 };
  (player.devCards || []).forEach(({ color }) => {
    if (devCounts[color] !== undefined) devCounts[color]++;
  });

  // محاسبه چیپ مورد نیاز برای هر رنگ
  const chipsNeeded = {
    white: 0,
    blue: 0,
    red: 0,
    green: 0,
    black: 0,
    yellow: 0,
  };
  for (const color of ["white", "blue", "red", "green", "black"]) {
    const cost = devCard.cost[color] || 0;
    const discount = devCounts[color] || 0;
    chipsNeeded[color] = Math.max(0, cost - discount);
  }

  const chipsNeededSum = ["white", "blue", "red", "green", "black"].reduce(
    (sum, color) => sum + chipsNeeded[color] || 0,
    0
  );

  // محاسبه چیپ مورد نیاز برای هر رنگ
  const chipsDifference = {
    white: 0,
    blue: 0,
    red: 0,
    green: 0,
    black: 0,
    yellow: 0,
  };
  for (const color of ["white", "blue", "red", "green", "black"]) {
    const cost = devCard.cost[color] || 0;
    const chip = chipCounts[color] || 0;
    const devCardCount = devCounts[color] || 0;
    chipsDifference[color] = Math.max(0, cost - chip - devCardCount);
  }

  const chipsDifferenceSum = ["white", "blue", "red", "green", "black"].reduce(
    (sum, color) => sum + chipsDifference[color] || 0,
    0
  );

  const hasEnoughChips = ["white", "blue", "red", "green", "black"].every(
    (color) => (chipCounts[color] || 0) >= (chipsNeeded[color] || 0)
  );

  const canBuyWithYellow = chipCounts.yellow >= chipsDifferenceSum;
  //  && chipCounts.yellow > 0;
  if (canBuyWithYellow) {
    chipsNeeded.yellow = chipsDifferenceSum;
    chipsDifference.yellow = chipsDifferenceSum;
  }

  return {
    chipCounts,
    devCounts,
    chipsNeeded,
    chipsDifference,
    hasEnoughChips,
    chipsNeededSum,
    chipsDifferenceSum,
    canBuyWithYellow,
  };
}
// export function canBuyDevCard(devCard, player) {
//   if (!devCard || !devCard.cost || !player) return false;

//   // شمارش چیپ‌های بازیکن بر اساس رنگ
//   const chipCounts = {
//     white: 0,
//     blue: 0,
//     red: 0,
//     green: 0,
//     black: 0,
//     yellow: 0,
//   };
//   (player.chips || []).forEach(({ color, quantity }) => {
//     if (chipCounts[color] !== undefined) chipCounts[color] += quantity;
//   });

//   // شمارش کارت‌های dev بازیکن بر اساس رنگ
//   const devCounts = { white: 0, blue: 0, red: 0, green: 0, black: 0 };
//   (player.devCards || []).forEach(({ color }) => {
//     if (devCounts[color] !== undefined) devCounts[color]++;
//   });

//   const chipsNeeded = { white: 0, blue: 0, red: 0, green: 0, black: 0 };
//   for (const color of ["white", "blue", "red", "green", "black"]) {
//     const cost = devCard.cost[color] || 0;
//     const discount = devCounts[color] || 0;
//     const chipCount = chipCounts[color] || 0;
//     const chipNeeded = cost - discount;
//     devCounts[color] = chipNeeded;
//   }

//   // let yellowNeeded = 0;
//   // for (const color of ["white", "blue", "red", "green", "black"]) {
//   //   const cost = devCard.cost[color] || 0;
//   //   const discount = devCounts[color] || 0;
//   //   const chips = chipCounts[color] || 0;
//   //   const lack = Math.max(0, cost - discount - chips);
//   //   yellowNeeded += lack;
//   // }

//   // اگر چیپ زرد کافی برای جبران کمبودها داشته باشد یا اصلاً کمبودی نباشد، خرید ممکن است
//   // return yellowNeeded <= (chipCounts.yellow || 0);
//   return { chipCounts, devCounts, chipsNeeded };
// }
