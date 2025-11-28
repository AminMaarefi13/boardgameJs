function broadcastChatHandler(io, chatState, userSocketMap) {
  for (const p of chatState.players) {
    const socketId = userSocketMap.get(p.id);
    if (!socketId) continue;

    const player = chatState.players.find((pl) => pl.id === p.id);
    if (!player) continue;

    io.to(socketId).emit("chatState", chatState);
  }
}

module.exports = {
  broadcastChatHandler,
};
