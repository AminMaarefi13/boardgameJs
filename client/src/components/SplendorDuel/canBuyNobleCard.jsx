export function canBuyNobleCard(NobleCard, player) {
  if (!NobleCard || !player)
    return { chipCounts: {}, devCounts: {}, chipsNeeded: {} };

  const canBuyNobleCardBoolean =
    (player.crownsOwned >= 3 &&
      player.crownsOwned < 6 &&
      player.nobleTilesOwned.length === 0) ||
    (player.crownsOwned >= 6 && player.nobleTilesOwned.length === 1)
      ? true
      : false;

  return { canBuyNobleCardBoolean };
}
