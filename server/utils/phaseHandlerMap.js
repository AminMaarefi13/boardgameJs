const feedTheKrakenPhaseHandlers = require("../games/feedTheKraken/socketHandlers/phaseHandlers");
const mineSweeperPhaseHandlers = require("../games/mineSweeper/socketHandlers/phaseHandlers");
const splendorPhaseHandlers = require("../games/splendor/socketHandlers/phaseHandlers");
const splendorDuelPhaseHandlers = require("../games/splendorDuel/socketHandlers/phaseHandlers");

const phaseHandlerMap = {
  feedTheKraken: feedTheKrakenPhaseHandlers,
  mineSweeper: mineSweeperPhaseHandlers,
  splendor: splendorPhaseHandlers,
  splendorDuel: splendorDuelPhaseHandlers,
};

module.exports = {
  phaseHandlerMap,
};
