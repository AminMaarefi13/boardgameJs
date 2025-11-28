const splendorDuelGame = require("../models/SplendorDuelGameModel");
const createGameController = require("./genericGameController");
module.exports = createGameController(splendorDuelGame);
