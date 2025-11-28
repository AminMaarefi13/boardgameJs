const roomController = require("../../../controllers/roomController");
const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const {
  updateStats,
} = require("../../../controllers/mineSweeperStatsContoller");
const handleChipSelection = require("./functions/handleChipSelection");
const checkCanTakeNoble = require("./functions/checkCanTakeNoble");
const handleCardBuy = require("./functions/handleCardBuy");
const handleNobleCardBuy = require("./functions/handleNobleCardBuy");
const handleReserveCard = require("./functions/handleReserveCard");
const checkGameOver = require("./functions/checkGameOver");
const checkChipWithdraw = require("./functions/checkChipWithdraw");
const handleChipWithdraw = require("./functions/handleChipWithdraw");

// onConfirmMove
// onConfirmMove
// onConfirmMove
// onConfirmMove
// onConfirmMove

async function onConfirmMove({
  games,
  gameId,
  rooms,
  userSocketMap,
  io,
  preparedData,
  eventSpecificData,
}) {
  // console.log("eventSpecificData onConfirmMove");
  // console.log(eventSpecificData);
  // console.log("games onConfirmMove");
  // console.log(games);
  // console.log("gameId onConfirmMove");
  // console.log(gameId);
  const { game, room, roomId, gameState } = getValidGameAndRoom({
    gameId,
    games,
    rooms,
  });
  const { data, type } = eventSpecificData;
  console.log("gameState onConfirmMove");
  console.log(gameState);
  console.log("type onConfirmMove");
  console.log(type);
  console.log("eventSpecificData onConfirmMove");
  console.log(eventSpecificData);

  const player = gameState.players[gameState.turn];
  console.log("player onConfirmMove");
  console.log(player);

  switch (type) {
    case "chips_selected":
      // کد مربوط به انتخاب چیپ‌ها
      console.log("type");
      console.log(type);
      const { selectedList } = data;
      handleChipSelection(selectedList, player, gameState);
      break;
    case "dev_card_built":
      const { selectedCard, chipsNeeded, chipsDifference, reserved } = data;
      handleCardBuy(
        selectedCard,
        chipsNeeded,
        chipsDifference,
        reserved,
        player,
        gameState
      );
      break;
    case "dev_card_reserved":
      // کد مربوط به رزرو کارت توسعه
      const { reservedCard } = data;
      handleReserveCard(reservedCard, player, gameState);
      break;
    case "noble_card_buy":
      // کد مربوط به خرید کارت نوبل
      const { selectedNobleCard } = data;
      handleNobleCardBuy(selectedNobleCard, player, gameState);
      break;
    case "chips_withdraw":
      // کد مربوط به پس دادن چیپ های اضافی
      const { chipsWithdrew } = data;
      handleChipWithdraw(chipsWithdrew, player, gameState);
      break;
    default:
      // کد پیش‌فرض یا هندل خطا
      break;
  }

  const chipWithdraw = checkChipWithdraw(player, gameState);
  console.log("chipWithdraw", chipWithdraw);

  if (chipWithdraw) {
    // به‌روزرسانی بازی در حافظه و دیتابیس
    updateAndBroadcastGame(
      games,
      gameId,
      gameState,
      roomId,
      room,
      userSocketMap,
      io
    );

    return;
  }

  console.log("chipWithdrawAfter", chipWithdraw);

  const canTakeNoble = checkCanTakeNoble(player, type, gameState);

  if (canTakeNoble) {
    // به‌روزرسانی بازی در حافظه و دیتابیس
    updateAndBroadcastGame(
      games,
      gameId,
      gameState,
      roomId,
      room,
      userSocketMap,
      io
    );

    return;
  }

  const gameOver = checkGameOver(gameState);

  if (gameOver) {
    gameState.currentPhase = "game_over";
    console.log("room before");
    console.log(room);
    const thisGame = room.games.find((g) => g.gameId === gameId);
    if (thisGame) {
      thisGame.gameStatus = "gameOver";
    }
    console.log("thisGame");
    console.log(thisGame);
    console.log("room after");
    console.log(room);
    // بروزرسانی دیتابیس روم
    await roomController.updateRoom(roomId, {
      games: room.games,
    });
    console.log("gamessssssssssssssss");
    console.log(game);
    io.to(roomId).emit("room_games_updated", {
      roomId,
      games: room.games,
    });

    updateAndBroadcastGame(
      games,
      gameId,
      gameState,
      roomId,
      room,
      userSocketMap,
      io
    );
    return;
  }
  // به‌روزرسانی بازی در حافظه و دیتابیس
  updateAndBroadcastGame(
    games,
    gameId,
    gameState,
    roomId,
    room,
    userSocketMap,
    io
  );
}

module.exports = { onConfirmMove };
