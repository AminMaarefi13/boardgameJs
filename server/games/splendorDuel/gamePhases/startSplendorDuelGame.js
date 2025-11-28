const { shuffle } = require("../../../utils/shuffle");
const { generator } = require("../utils/generator");
const roomController = require("../../../controllers/roomController");
const { makePublicState } = require("../utils/makeStates");
const { chipBoardGenerator } = require("../utils/chipBoardGenerator");

// onStartGame
// onStartGame
// onStartGame
// onStartGame
// onStartGame
async function startSplendorDuelGame({
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
  console.log("gameController", gameController);
  const shuffledPlayers = shuffle([...readyPlayers]);

  let [
    levelOneDevCardsDeckRandom,
    levelTwoDevCardsDeckRandom,
    levelThreeDevCardsDeckRandom,
    levelOneDevCardsVisibleRandom,
    levelTwoDevCardsVisibleRandom,
    levelThreeDevCardsVisibleRandom,
    nobleTilesDeckRandom,
  ] = generator();

  let boardMapped = chipBoardGenerator();

  console.log(boardMapped);

  const finalPlayers = shuffledPlayers.map((player, index) => {
    const id = player.playerId;
    const name = player.nickname;
    const chips =
      index === 55
        ? [
            { color: "yellow", quantity: 1 },
            { color: "black", quantity: 3 },
            { color: "blue", quantity: 4 },
            { color: "red", quantity: 2 },
          ]
        : [
            { color: "white", quantity: 0 },
            { color: "black", quantity: 0 },
            { color: "blue", quantity: 0 },
            { color: "red", quantity: 0 },
            { color: "green", quantity: 0 },
            { color: "yellow", quantity: 0 },
            { color: "pearl", quantity: 0 },
          ];
    const devCards = index === 55 ? [] : [];
    const reservedCards = index === 55 ? [] : [];
    const nobleTilesOwned = index === 55 ? [] : [];
    const prestigePoints = index === 55 ? 13 : 0;
    const crownsOwned = 0;
    const privilegeTokens = 0;
    const seat = index;
    return {
      id,
      name,
      chips,
      devCards,
      reservedCards,
      nobleTilesOwned,
      prestigePoints,
      crownsOwned,
      privilegeTokens,
      seat,
    };
  });
  // ساخت وضعیت اولیه بازی
  const gameState = {
    gameId,
    roomId,
    players: finalPlayers,
    currentPhase: "game_start",
    devCardsDeck: [
      levelOneDevCardsDeckRandom,
      levelTwoDevCardsDeckRandom,
      levelThreeDevCardsDeckRandom,
    ],
    devCardsVisible: [
      levelOneDevCardsVisibleRandom,
      levelTwoDevCardsVisibleRandom,
      levelThreeDevCardsVisibleRandom,
    ],
    nobleTilesDeck: nobleTilesDeckRandom,
    chipQuantities: [
      { color: "white", quantity: 0 },
      { color: "blue", quantity: 0 },
      { color: "red", quantity: 0 },
      { color: "green", quantity: 0 },
      { color: "black", quantity: 0 },
      { color: "yellow", quantity: 0 },
      { color: "pearl", quantity: 0 },
    ],
    privileges: 3,
    chipBoard: boardMapped,
    turn: 0,
    phaseData: {},
    nextPhaseData: {},
    logs: [
      {
        type: "start",
        text: `🎮 بازی شروع شد `,
      },
    ],
    chat: [],
    seen: {},
    gameStatus: "onGoing",
    type: "splendorDuel",
  };

  gameState.gameId = gameId;

  // ذخیره وضعیت اولیه بازی در دیتابیس
  const gameDataToSave = {
    gameId,
    roomId,
    players: gameState.players,
    currentPhase: gameState.currentPhase,
    devCardsDeck: gameState.devCardsDeck,
    devCardsVisible: gameState.devCardsVisible,
    nobleTilesDeck: gameState.nobleTilesDeck,
    chipQuantities: gameState.chipQuantities,
    privileges: gameState.privileges,
    chipBoard: gameState.chipBoard,
    turn: gameState.turn,
    phaseData: gameState.phaseData,
    nextPhaseData: gameState.nextPhaseData,
    logs: gameState.logs,
    chat: gameState.chat,
    seen: gameState.seen,
    gameStatus: gameState.gameStatus,
    type: gameState.type,
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

module.exports = { startSplendorDuelGame };
