// مپ هندلرها بر اساس نوع بازی
const gameSocketHandlers = {
  feedTheKraken: require("../games/feedTheKraken/socketHandlers/onRequestGameState"),
  mineSweeper: require("../games/mineSweeper/socketHandlers/onRequestGameState"),
  splendor: require("../games/splendor/socketHandlers/onRequestGameState"),
  splendorDuel: require("../games/splendorDuel/socketHandlers/onRequestGameState"),
};

module.exports = {
  gameSocketHandlers,
};
