const splendorGame = require("../models/SplendorGameModel");
const createGameController = require("./genericGameController");
module.exports = createGameController(splendorGame);
