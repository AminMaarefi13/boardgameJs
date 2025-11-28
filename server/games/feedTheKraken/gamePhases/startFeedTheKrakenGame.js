const { describeKnownRoles } = require("../utils/describeKnownRoles");
const { makePublicState, makePrivateState } = require("../utils/makeStates");
const { gameStartPhase } = require("../utils/gameStartPhase");
const roomController = require("../../../controllers/roomController");
/**
 * ساخت وضعیت اولیه بازی Feed the Kraken و ارسال به بازیکنان
 */
async function startFeedTheKrakenGame({
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
  // ساخت وضعیت اولیه بازی
  const gameState = gameStartPhase(readyPlayers, "quick", roomId);

  // ⚠️ اضافه کردن phaseSeen برای بازیکن‌های زنده
  const captain = gameState.players.find((pl) => pl.id === gameState.captainId);
  gameState.phaseData = {
    phase: "start_game",
    title: "شروع بازی",
    type: "see",
    phaseSeen: [],
    // message: "بازی شروع شد! نقش مخفی خود را ببینید. کاپیتان: " + captain.name,
    phaseSeen: [],
  };
  for (const pl of gameState.players) {
    if (pl.knownRoles.length > 0) {
      const privateMessage = describeKnownRoles(pl.knownRoles, gameState);
      pl.privatePhaseData = {
        phase: "start_game",
        title: "شروع بازی",
        // message: privateMessage,
      };
    }
  }
  gameState.nextPhaseData = { emergency: false };
  gameState.gameId = gameId;

  // ذخیره وضعیت اولیه بازی در دیتابیس
  const gameDataToSave = {
    gameId,
    roomId,
    journeyType: gameState.journeyType,
    players: gameState.players,
    captainId: gameState.captainId,
    firstOfficerId: gameState.firstOfficerId,
    navigatorId: gameState.navigatorId,
    offDutyIds: gameState.offDutyIds,
    mapPosition: gameState.mapPosition,
    currentPhase: gameState.currentPhase,
    navigationDeck: gameState.navigationDeck,
    discardPile: gameState.discardPile,
    cultRitualDeck: gameState.cultRitualDeck,
    playedNavCards: gameState.playedNavCards,
    gunReloadUsed: gameState.gunReloadUsed,
    currentVoteSessionId: gameState.currentVoteSessionId,
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

    const gamePlayer = gameState.players.find((gp) => gp.id === p.playerId);
    console.log("%%%%%%%%%%%%%%%%%%%%%%");
    console.log(gamePlayer);
    console.log(p.playerId);
    console.log("&&&&&&&&&&&&&&&&&&&&&&");
    if (gamePlayer) {
      const publicState = makePublicState(gameState);
      const privateState = makePrivateState(gamePlayer);
      io.to(socketId).emit("gameState", { publicState, privateState });
    }
    io.to(socketId).emit("room_updated", room);
    io.to(socketId).emit("game_started", gameId, gamePlayer);
  }
}

module.exports = { startFeedTheKrakenGame };
