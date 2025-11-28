const { shuffle } = require("../../../utils/shuffle");
const { generator } = require("../utils/generator");
const roomController = require("../../../controllers/roomController");
const { makePublicState } = require("../utils/makeStates");

// onStartGame
// onStartGame
// onStartGame
// onStartGame
// onStartGame
async function startSplendorGame({
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
  const shuffledPlayers = shuffle([...readyPlayers]);

  const numberOfPlayers = shuffledPlayers.length;

  let [
    levelOneDevCardsDeckRandom,
    levelTwoDevCardsDeckRandom,
    levelThreeDevCardsDeckRandom,
    levelOneDevCardsVisibleRandom,
    levelTwoDevCardsVisibleRandom,
    levelThreeDevCardsVisibleRandom,
    nobleTilesDeckRandom,
    chipQuantity,
  ] = generator(numberOfPlayers);

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
          ];
    const devCards =
      index === 55
        ? [
            {
              color: "red",
              cost: { black: 5 },
              prestigePoints: 2,
            },
            {
              color: "red",
              cost: { red: 6 },
              prestigePoints: 3,
            },
            {
              color: "red",
              cost: { white: 2, red: 2, black: 3 },
              prestigePoints: 1,
            },
            {
              color: "red",
              cost: { white: 1, blue: 4, green: 2 },
              prestigePoints: 2,
            },
            {
              color: "red",
              cost: { blue: 3, red: 2, black: 3 },
              prestigePoints: 1,
            },
            {
              color: "green",
              cost: { white: 2, blue: 1 },
              prestigePoints: 0,
            },
            {
              color: "green",
              cost: { red: 3 },
              prestigePoints: 0,
            },
            {
              color: "green",
              cost: { white: 1, blue: 1, red: 1, black: 1 },
              prestigePoints: 0,
            },
            {
              color: "green",
              cost: { blue: 2, red: 2 },
              prestigePoints: 0,
            },
            {
              color: "green",
              cost: { black: 4 },
              prestigePoints: 1,
            },
            {
              color: "green",
              cost: { white: 1, blue: 1, red: 1, black: 2 },
              prestigePoints: 0,
            },
            {
              color: "green",
              cost: { blue: 1, red: 2, black: 2 },
              prestigePoints: 0,
            },
            {
              color: "green",
              cost: { white: 1, blue: 3, green: 1 },
              prestigePoints: 0,
            },
            // Red
            {
              color: "red",
              cost: { blue: 2, green: 1 },
              prestigePoints: 0,
            },
            {
              color: "red",
              cost: { white: 3 },
              prestigePoints: 0,
            },
            {
              color: "red",
              cost: { white: 1, blue: 1, green: 1, black: 1 },
              prestigePoints: 0,
            },
            {
              color: "red",
              cost: { white: 2, red: 2 },
              prestigePoints: 0,
            },
            {
              color: "red",
              cost: { white: 4 },
              prestigePoints: 1,
            },
            {
              color: "red",
              cost: { white: 2, blue: 1, green: 1, black: 1 },
              prestigePoints: 0,
            },
            {
              color: "red",
              cost: { white: 2, green: 1, black: 2 },
              prestigePoints: 0,
            },
            {
              color: "red",
              cost: { white: 1, red: 1, black: 3 },
              prestigePoints: 0,
            },
            {
              color: "green",
              cost: { white: 1, blue: 1, red: 1, black: 2 },
              prestigePoints: 0,
            },
            {
              color: "green",
              cost: { blue: 1, red: 2, black: 2 },
              prestigePoints: 0,
            },
            {
              color: "red",
              cost: { white: 2, red: 2 },
              prestigePoints: 0,
            },
            {
              color: "red",
              cost: { white: 4 },
              prestigePoints: 1,
            },
            {
              color: "red",
              cost: { white: 2, blue: 1, green: 1, black: 1 },
              prestigePoints: 0,
            },
            {
              color: "white",
              cost: { blue: 1, red: 1, green: 2, black: 1 },
              prestigePoints: 0,
            },
            {
              color: "green",
              cost: { white: 3, red: 3, green: 2 },
              prestigePoints: 1,
            },
            {
              color: "green",
              cost: { blue: 5, green: 3 },
              prestigePoints: 2,
            },
          ]
        : [];
    const reservedCards =
      index === 55
        ? [
            {
              color: "red",
              cost: { white: 3, blue: 5, green: 3, black: 3 },
              prestigePoints: 3,
            },
            {
              color: "white",
              cost: { red: 5, black: 3 },
              prestigePoints: 2,
            },
          ]
        : [];
    const nobleTilesOwned =
      index === 55
        ? [
            {
              cost: { red: 3, green: 3, black: 3 },
              prestigePoints: 3,
            },
            {
              cost: { red: 4, green: 4 },
              prestigePoints: 3,
            },
          ]
        : [];
    const prestigePoints = index === 55 ? 13 : 0;
    const seat = index;
    return {
      id,
      name,
      chips,
      // whiteChips,
      // blueChips,
      // redChips,
      // greenChips,
      // blackChips,
      // yellowChips,
      devCards,
      reservedCards,
      nobleTilesOwned,
      prestigePoints,
      seat,
    };
  });
  // ساخت وضعیت اولیه بازی
  const gameState = {
    gameId,
    roomId,
    players: finalPlayers,
    currentPhase: "game_start",
    // levelOneDevCardsDeck: levelOneDevCardsDeckRandom,
    // levelTwoDevCardsDeck: levelTwoDevCardsDeckRandom,
    // levelThreeDevCardsDeck: levelThreeDevCardsDeckRandom,
    // levelOneDevCardsVisible: levelOneDevCardsVisibleRandom,
    // levelTwoDevCardsVisible: levelTwoDevCardsVisibleRandom,
    // levelThreeDevCardsVisible: levelThreeDevCardsVisibleRandom,
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
      { color: "white", quantity: chipQuantity },
      { color: "blue", quantity: chipQuantity },
      { color: "red", quantity: chipQuantity },
      { color: "green", quantity: chipQuantity },
      { color: "black", quantity: chipQuantity },
      { color: "yellow", quantity: 5 },
    ],
    turn: 0,
    finalRound: false,
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
    type: "splendor",
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
    finalRound: gameState.finalRound,
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

module.exports = { startSplendorGame };
