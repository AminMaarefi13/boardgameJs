const gamePlayerLimits = {
  feedTheKraken: { min: 5, max: 11 },
  mineSweeper: { min: 2, max: 2 },
  splendor: { min: 2, max: 4 },
  splendorDuel: { min: 2, max: 2 },
};

function getPlayerLimits(gameType) {
  return gamePlayerLimits[gameType] || { min: 2, max: 2 }; //
}

module.exports = { getPlayerLimits };
