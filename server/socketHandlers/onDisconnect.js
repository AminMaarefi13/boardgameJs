const { logAllUsers } = require("../utils/logAllusers");

async function onDisconnect(socket, userSocketMap) {
  const playerId = userSocketMap.get(socket.id);
  if (playerId) {
    // console.log(`❌ Socket disconnected: ${socket.id} for player ${playerId}`);
    userSocketMap.delete(playerId);
    connectionsArr.delete(playerId);
    // userSocketMap.delete(socket.id);
    logAllUsers(userSocketMap, rooms);
    // We intentionally do NOT remove player from room — they might reconnect.
  }
}

module.exports = {
  onDisconnect,
};
