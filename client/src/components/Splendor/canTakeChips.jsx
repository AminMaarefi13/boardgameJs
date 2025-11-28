export function canTakeChips(chips, player) {
  if (!chips || !player) return;

  
  const chipsSum = ["white", "blue", "red", "green", "black"].reduce(
    (sum, color) => sum + chips[color] || 0,
    0
  );

  console.log("chipsSum: ", chipsSum)

  console.log(chips);
  const filteredChips = chips.filter((chip) => {
    return chip.color !== "yellow";
  });
  console.log(filteredChips);
  const fourOfOneChip = filteredChips.some((chip) => {
    return chip.quantity >= 4;
  });

  const oneOfThreeChipsFiltered = filteredChips.filter((chip) => {
    return chip.quantity >= 1;
  });

  const oneOfThreeChips = oneOfThreeChipsFiltered.length >= 3 ? true : false;

  

  const canTakeChipsBoolean = fourOfOneChip || oneOfThreeChips || chipsSum > 0;

  return canTakeChipsBoolean;
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
