const { logAllUsers } = require("../utils/logAllusers");

async function onLogout(socket, connectionsArr, rooms,userSocketMap) {
  const playerId = socket.user._id.toString();
  userSocketMap.delete(playerId);
  connectionsArr.delete(playerId);
  console.log(`User ${playerId} logged out and removed from maps`);
  logAllUsers(userSocketMap, rooms);
}

module.exports = {
  onLogout,
};
