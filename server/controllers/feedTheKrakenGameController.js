const FeedTheKrakenGame = require("../models/FeedTheKrakenGameModel");
const createGameController = require("./genericGameController");
module.exports = createGameController(FeedTheKrakenGame);
