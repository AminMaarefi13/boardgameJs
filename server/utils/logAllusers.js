function logAllUsers(userSocketMap, rooms) {
  console.log("👥 All Connected Users:");
  console.log("userSocketMap");
  console.log(userSocketMap);

  for (const [playerId, socketId] of userSocketMap.entries()) {
    console.log(`   - ID: ${playerId}, Socket: ${socketId}`);
  }

  console.log("📦 All Rooms:");
  for (const [roomId, room] of rooms.entries()) {
    console.log(`   🏠 Room ${roomId}`);
    room.players.forEach((p) => {
      console.log(
        `     • ${p.nickname} (ID: ${p.playerId}, Socket: ${p.socketId})`
      );
    });
  }
}

module.exports = {
  logAllUsers,
};
