const feedTheKrakenGameController = require("../controllers/feedTheKrakenGameController");
const mineSweeperGameController = require("../controllers/mineSweeperGameController");
const splendorGameController = require("../controllers/splendorGameController");
const splendorDuelGameController = require("../controllers/splendorDuelGameController");

const gameControllers = {
  feedTheKraken: feedTheKrakenGameController,
  mineSweeper: mineSweeperGameController,
  splendor: splendorGameController,
  splendorDuel: splendorDuelGameController,
};

const allGameControllers = [
  { type: "feedTheKraken", controller: feedTheKrakenGameController },
  { type: "mineSweeper", controller: mineSweeperGameController },
  { type: "splendor", controller: splendorGameController },
  { type: "splendorDuel", controller: splendorDuelGameController },
];

module.exports = {
  gameControllers,
  allGameControllers,
};
