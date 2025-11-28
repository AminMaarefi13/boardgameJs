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
const handleJokerSelect = require("./functions/handleJokerSelect");
const handleReplenishBoard = require("./functions/handleReplenishBoard");
const handleSteal = require("./functions/handleSteal");
const handlePrivilege = require("./functions/handlePrivilege");

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
      const { selectedList, privilegeUse } = data;
      handleChipSelection(selectedList, privilegeUse, player, gameState);
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
    case "joker_select":
      // کد مربوط به پس دادن چیپ های اضافی
      const { selected, selectedJokerCard } = data;
      handleJokerSelect(selected, selectedJokerCard, player, gameState);
      break;
    case "replenish_board":
      // کد مربوط به پر کردن صفحه چیپ ها
      handleReplenishBoard(player, gameState);
      break;
    case "steal_selected":
      // کد مربوط به برداشتن چیپ از حریف
      const { stealSelected } = data;
      handleSteal(stealSelected, player, gameState);
      break;

    default:
      // کد پیش‌فرض یا هندل خطا
      break;
  }

  if (type === "chips_selected") {
    const { privilegeUse } = data;
    if (privilegeUse) {
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
  }

  if (type === "replenish_board") {
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

  if (type === "dev_card_reserved") {
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

  if (type === "dev_card_built") {
    const { selectedCard } = data;
    const isJoker = selectedCard.color === "joker";
    if (isJoker) {
      gameState.currentPhase = "joker_select";
      gameState.phaseData = { selectedCard };
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
  }

  if (type === "joker_select") {
    const { selectedJokerCard } = data;

    if (selectedJokerCard.ability) {
      if (selectedJokerCard.ability === "turn") {
        gameState.nextPhaseData = { ability: "turn" };
      }
    }
  }
  if (type === "dev_card_built") {
    const { selectedCard } = data;

    if (selectedCard.ability) {
      if (selectedCard.ability === "turn") {
        gameState.nextPhaseData = { ability: "turn" };
        gameState.logs.push({ type: "turn", player });
      }
      if (selectedCard.ability === "take-second-same") {
        gameState.currentPhase = "take_second_same";
        gameState.logs.push({ type: "take_second_same", player, selectedCard });
        gameState.phaseData = { selectedCard };
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

      if (selectedCard.ability === "steal") {
        gameState.currentPhase = "steal";
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
      if (selectedCard.ability === "privilege") {
        handlePrivilege(player, gameState);
      }
    }
  }
  if (type === "noble_card_buy") {
    const { selectedNobleCard } = data;

    if (selectedNobleCard.ability) {
      if (selectedNobleCard.ability === "turn") {
        gameState.nextPhaseData = { ability: "turn" };
      }

      if (selectedNobleCard.ability === "steal") {
        gameState.currentPhase = "steal";
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
      if (selectedNobleCard.ability === "privilege") {
        handlePrivilege(player, gameState);
      }
    }
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

  const gameOver = checkGameOver(player, gameState);
  console.log("gameOver: ", gameOver);
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

  if (!canTakeNoble) {
    // تغییر نوبت به بازیکن بعدی
    console.log("gameState.nextPhaseData: ", gameState.nextPhaseData);
    if (gameState.nextPhaseData?.ability !== "turn") {
      gameState.currentPhase = "confirm_move";
      const nextTurn = (gameState.turn + 1) % gameState.players.length;
      gameState.turn = nextTurn;
      console.log("تغییر نوبت به بازیکن بعدی:", nextTurn);
    } else {
      gameState.nextPhaseData = {};
      console.log("بازیکن یک دور دیگر بازی می کند:");
    }
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
