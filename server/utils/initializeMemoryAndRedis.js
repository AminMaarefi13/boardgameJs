const redisClient = require("./redisClient");
const {
  restoreRoomsFromDB,
  restoreGamesFromDB,
} = require("./restoreRoomAndGameFromDB");

async function initializeMemoryAndRedis(rooms, games) {
  // لود بازی‌ها
  const allGames = await restoreGamesFromDB(games, rooms);
  console.log("allGames", allGames);
  for (const game of allGames) {
    games.set(game.gameId, game);
    await redisClient.set(`game:${game.gameId}`, JSON.stringify(game));
  }

  // لود روم‌ها
  const allRooms = await restoreRoomsFromDB(rooms);
  for (const room of allRooms) {
    rooms.set(room.roomId, room);
    await redisClient.set(`room:${room.roomId}`, JSON.stringify(room));
  }
}

module.exports = {
  initializeMemoryAndRedis,
};
