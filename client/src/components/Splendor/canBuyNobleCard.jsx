export function canBuyNobleCard(NobleCard, player) {
  if (!NobleCard || !NobleCard.cost || !player)
    return { chipCounts: {}, devCounts: {}, chipsNeeded: {} };

  console.log(player.devCards);

  // شمارش کارت‌های dev بازیکن بر اساس رنگ
  const devCounts = { white: 0, blue: 0, red: 0, green: 0, black: 0 };
  (player.devCards || []).forEach(({ color }) => {
    if (devCounts[color] !== undefined) devCounts[color]++;
  });

  // محاسبه چیپ مورد نیاز برای هر رنگ
  const cardsNeeded = { white: 0, blue: 0, red: 0, green: 0, black: 0 };
  for (const color of ["white", "blue", "red", "green", "black"]) {
    const cost = NobleCard.cost[color] || 0;
    const discount = devCounts[color] || 0;
    cardsNeeded[color] = Math.max(0, cost - discount);
  }

  const cardsNeededSum = ["white", "blue", "red", "green", "black"].reduce(
    (sum, color) => sum + cardsNeeded[color] || 0,
    0
  );

  const canBuyNobleCardBoolean = cardsNeededSum === 0;

  return { devCounts, canBuyNobleCardBoolean };
}
