const roomController = require("../../../controllers/roomController");
const {
  updateAndBroadcastGame,
} = require("../../../utils/updateAndBroadcastGame");
const { getValidGameAndRoom } = require("../../../utils/getValidGameAndRoom");
const { indCalc } = require("../utils/indCalc");
const {
  updateStats,
} = require("../../../controllers/mineSweeperStatsContoller");

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
  const { index } = eventSpecificData;
  // console.log(index);
  // console.log("gameStatemap");
  // console.log(gameState.map);
  // console.log("gameStateclientMap");
  // console.log(gameState.clientMap);

  // const turn = gameState.turn;
  // const map = gameState.map;
  // const clientMap = gameState.clientMap;
  // const selectedTile = gameState.map[index];
  const columns = 7;
  // const tileVal = gameState.map[index].val;
  const player = gameState.players[gameState.turn];
  gameState.map[index].position = gameState.turn;
  if (gameState.map[index].group !== "none") {
    gameState.map.forEach((groupItem) => {
      console.log(groupItem);
      console.log(gameState.map[index].group);
      if (groupItem.group === gameState.map[index].group) {
        gameState.map[groupItem.index].position = gameState.turn;
        gameState.clientMap[groupItem.index].position = gameState.turn;
        gameState.clientMap[groupItem.index].val =
          gameState.map[groupItem.index].val;
        let rowInd = Math.floor(groupItem.index / columns);
        let colInd = groupItem.index % columns;
        let calcArr = [
          indCalc(rowInd - 1, colInd - 1),
          indCalc(rowInd - 1, colInd),
          indCalc(rowInd - 1, colInd + 1),
          indCalc(rowInd, colInd - 1),
          indCalc(rowInd, colInd),
          indCalc(rowInd, colInd + 1),
          indCalc(rowInd + 1, colInd - 1),
          indCalc(rowInd + 1, colInd),
          indCalc(rowInd + 1, colInd + 1),
        ];
        calcArr.forEach((calcItem) => {
          if (calcItem !== 999) {
            gameState.map[calcItem].position = gameState.turn;
            gameState.clientMap[calcItem].position = gameState.turn;
            gameState.clientMap[calcItem].val = gameState.map[calcItem].val;
          }
        });
      }
    });
  }
  if (gameState.map[index].val === "bomb") {
    gameState.clientMap[index].val = "bomb";
    console.log("gameState.turn");
    console.log(gameState.turn);
    gameState.map[index].position = gameState.turn;
    gameState.clientMap[index].position = gameState.turn;
    player.score += 1;
    if (player.score === 8) {
      const player0Id = gameState.players[0].id;
      const player1Id = gameState.players[1].id;
      const winnerId = player.id;
      console.log("player0Id");
      console.log("player1Id");
      console.log("player");
      console.log(player0Id);
      console.log(player1Id);
      console.log(player);

      // آمار فعلی را بخوان یا مقدار پیش‌فرض بگذار
      let allTimeScore = Array.isArray(gameState.allTime)
        ? [...gameState.allTime]
        : [0, 0];

      // برنده player0 است
      if (winnerId === player0Id) {
        allTimeScore[0]++;
      }
      // برنده player1 است
      else if (winnerId === player1Id) {
        allTimeScore[1]++;
      }

      // مقدار جدید را در gameState قرار بده
      gameState.allTime = allTimeScore;

      // دیتابیس را هم آپدیت کن (غیرهمزمان)
      await updateStats(player0Id, player1Id, winnerId);

      gameState.phaseData = {
        currentPhase: "game_over",
        title: "بازی تمام شد",
        type: "game_over",
        winner: player.name,
        map: gameState.clientMap,
        turn: gameState.turn,
        message: `💥 بازیکن ${player.name} برنده شد`,
      };

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
    }
  } else {
    gameState.map[index].position = gameState.turn;
    gameState.clientMap[index].position = gameState.turn;
    gameState.clientMap[index].val = gameState.map[index].val;
    gameState.turn = gameState.turn === 0 ? 1 : 0;
    gameState.phaseData = {
      currentPhase: "confirm_move",
      title: "انجام حرکت ",
      type: "move",
      map: gameState.clientMap,
      turn: gameState.turn,
      message: `${player.name} حرکت خود را انجام داد. ${gameState.map[index].val} در خانه ${index} انتخاب شد.`,
    };
    // console.log(index);
    // console.log("gameStatemap After");
    // console.log(gameState.map);
    // console.log("gameStateclientMap After");
    // console.log(gameState.clientMap);
  }

  // let matchId;
  // let gameBetween;
  // let allTimeScore;
  // let sameSequence = true;
  // // console.log(allConnected);
  // [gameBetween] = await MinesweeperStat.find({
  //   playerOne: mongoose.Types.ObjectId.createFromHexString(
  //     allConnected[0].playerId
  //   ),
  //   playerTwo: mongoose.Types.ObjectId.createFromHexString(
  //     allConnected[1].playerId
  //   ),
  // });
  // if (gameBetween) {
  //   allTimeScore = gameBetween.results;
  // }
  // if (!gameBetween) {
  //   [gameBetween] = await MinesweeperStat.find({
  //     playerOne: mongoose.Types.ObjectId.createFromHexString(
  //       allConnected[1].playerId
  //     ),
  //     playerTwo: mongoose.Types.ObjectId.createFromHexString(
  //       allConnected[0].playerId
  //     ),
  //   });
  //   if (gameBetween) {
  //     allTimeScore = [gameBetween.results[1], gameBetween.results[0]];
  //     sameSequence = false;
  //   }
  // }
  // let turnRand = Math.floor(Math.random() * 1);
  // let instance = new MinesweeperStat();
  // if (!gameBetween) {
  //   allTimeScore = [0, 0];
  //   instance.results = [0, 0];
  //   instance.playerOne = allConnected[0].playerId;
  //   instance.playerTwo = allConnected[1].playerId;
  //   sameSequence = true;
  //   // console.log(instance);
  //   matchId = instance._id;
  //   io.to(data.room).emit("game_started", {
  //     matchId: matchId,
  //     allTimeScore,
  //     initialmapArr: data.initialmapArr,
  //     turn: turnRand,
  //     sameSequence,
  //   });
  //   instance.save();
  // }
  // // console.log(`matchId: ${matchId}`);
  // // console.log(gameBetween);
  // // console.log(allTimeScore);
  // // console.log(data);
  // if (gameBetween) {
  //   io.to(data.room).emit("game_started", {
  //     matchId: gameBetween._id,
  //     allTimeScore,
  //     initialmapArr: data.initialmapArr,
  //     turn: turnRand,
  //     sameSequence,
  //   });
  // }

  // gameState.phaseData = {
  //   currentPhase: "telescope_seen",
  //   title: "تلسکوپ",
  //   type: "see",
  //   message: `🔭 بازیکن ${player.name} تصمیم گرفت کارت تلسکوپ را ${
  //     decision === "keep" ? "نگه دارد" : "به دریا بیندازد"
  //   }.`,
  // };
  // gameState.nextPhaseData = {
  //   emergency: false,
  // };
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
