const mineSweeperGame = require("../models/MineSweeperGameModel");
const createGameController = require("./genericGameController");
module.exports = createGameController(mineSweeperGame);
