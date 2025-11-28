const ioEmitToRoom = (io, userSocketMap, gameState, event, data) => {
  gameState.players.forEach((p) => {
    const sid = userSocketMap.get(p.id);
    if (sid) io.to(sid).emit(event, data);
  });
};

module.exports = {
  ioEmitToRoom,
};
