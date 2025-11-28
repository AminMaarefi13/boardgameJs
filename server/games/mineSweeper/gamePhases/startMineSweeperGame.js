const { shuffle } = require("../../../utils/shuffle");
const { generator } = require("../utils/generator");
const roomController = require("../../../controllers/roomController");
const { makePublicState } = require("../utils/makeStates");
const { getStats } = require("../../../controllers/mineSweeperStatsContoller");

// onStartGame
// onStartGame
// onStartGame
// onStartGame
// onStartGame
async function startMineSweeperGame({
  readyPlayers,
  roomId,
  gameId,
  room,
  io,
  userSocketMap,
  gameController,
  games,
  rooms,
}) {
  const rows = 8;
  const columns = 7;

  let [nullsArr, mapArr] = generator(rows, columns);
  console.log(nullsArr);
  console.log(mapArr);
  let initialmapArr = mapArr.map((item, index) => {
    return {
      index: index,
      // val: "none",
      val: item,
      position: "none",
      group: "none",
    };
  });

  nullsArr.forEach((item, index) => {
    item.forEach((setItem) => {
      initialmapArr[setItem].group = index;
    });
  });

  const clientInitialmapArr = initialmapArr.map((item, index) => {
    return {
      index: index,
      val: "none",
      position: "none",
      group: "none",
    };
  });

  const shuffledPlayers = shuffle([...readyPlayers]);

  const finalPlayers = shuffledPlayers.map((player) => {
    const id = player.playerId;
    const name = player.nickname;
    const score = 0;
    return {
      id,
      name,
      score,
    };
  });
  // ساخت وضعیت اولیه بازی
  const gameState = {
    gameId,
    roomId,
    players: finalPlayers,
    currentPhase: "game_start",
    map: initialmapArr,
    clientMap: clientInitialmapArr,
    turn: 0,
    phaseData: {},
    nextPhaseData: {},
    logs: [
      {
        type: "event",
        text: `🎮 بازی شروع شد `,
      },
    ],
    chat: [],
    seen: {},
    gameStatus: "onGoing",
    type: "mineSweeper",
  };

  // gameState.phaseData = {
  //   phase: "start_game",
  //   title: "شروع بازی",
  //   // type: "see",
  //   message: "بازی شروع شد! نقش مخفی خود را ببینید. کاپیتان: " + captain.name,
  //   phaseSeen: [],
  // };

  // gameState.nextPhaseData = { emergency: false };
  gameState.gameId = gameId;

  const stats = await getStats(finalPlayers[0].id, finalPlayers[1].id);
  console.log("statsaaaaaaaaaaaaaaaaaaaaaaaaaa");
  console.log(stats);

  const id0 = finalPlayers[0].id;
  const id1 = finalPlayers[1].id;
  console.log("ddddddddddddd");
  console.log(id0);
  console.log(id1);
  // console.log(stats.playerA);
  // console.log(id0);
  // console.log(id1);
  // console.log(stats.playerA === id0);
  // console.log(stats.playerA === id1);
  console.log("ddddddddddddd");

  let allTimeScore = [0, 0]; // [player0Wins, player1Wins]

  if (stats) {
    console.log(stats);
    if (stats.playerA === id0 && stats.playerB === id1) {
      allTimeScore = [stats.aWins, stats.bWins];
      console.log("allTimeScore");
      console.log(allTimeScore);
    } else if (stats.playerA === id1 && stats.playerB === id0) {
      allTimeScore = [stats.bWins, stats.aWins];
      console.log("allTimeScore");
      console.log(allTimeScore);
    }
  }

  gameState.allTime = allTimeScore;

  // ذخیره وضعیت اولیه بازی در دیتابیس
  const gameDataToSave = {
    gameId,
    roomId,
    players: gameState.players,
    currentPhase: gameState.currentPhase,
    map: gameState.map,
    clientMap: gameState.clientMap,
    turn: gameState.turn,
    phaseData: gameState.phaseData,
    nextPhaseData: gameState.nextPhaseData,
    logs: gameState.logs,
    gameStatus: gameState.gameStatus,
    chat: gameState.chat,
    seen: gameState.seen,
    type: gameState.type,
    allTime: gameState.allTime,
  };
  await gameController.createGame(gameDataToSave);

  const game = room.games.find((g) => g.gameId === gameId);
  if (!game) return;

  game.gameStatus = "onGoing"; // تغییر وضعیت بازی به در حال انجام
  // بروزرسانی دیتابیس روم
  await roomController.updateRoom(roomId, {
    games: room.games,
  });
  // ثبت در حافظه
  games.set(gameId, gameState);
  rooms.set(roomId, room);
  // ارسال وضعیت اولیه به بازیکنان
  console.log(gameState.players);
  console.log(room.players);

  for (const p of room.players) {
    const socketId = userSocketMap.get(p.playerId);
    if (!socketId) {
      console.warn(`No socketId found for player ${p.playerId} (${p.name})`);
      continue;
    }

    // آیا این بازیکن عضو بازی است؟
    const gamePlayer = gameState.players.find((gp) => gp.id === p.playerId);
    console.log("%%%%%%%%%%%%%%%%%%%%%%");
    console.log(gamePlayer);
    console.log(p.playerId);
    const publicState = makePublicState(gameState);
    console.log("&&&&&&&&&&&&&&&&&&&&&&");
    if (gamePlayer) {
      io.to(socketId).emit("gameState", { publicState });
    }
    io.to(socketId).emit("room_updated", room);
    io.to(socketId).emit("game_started", gameId, gamePlayer);
  }
}

module.exports = { startMineSweeperGame };
