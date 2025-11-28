const mockRoom = {
  roomId: "room123",
  hostId: "1",
  hostName: "First",
  players: [
    {
      nickname: "First",
      playerId: "1",
      socketId: "S1",
    },
    {
      nickname: "Second",
      playerId: "2",
      socketId: "S2",
    },
    {
      nickname: "Third",
      playerId: "3",
      socketId: "S3",
    },
    {
      nickname: "Fourth",
      playerId: "4",
      socketId: "S4",
    },
    {
      nickname: "Fifth",
      playerId: "5",
      socketId: "S5",
    },
    {
      nickname: "Sixth",
      playerId: "6",
      socketId: "S6",
    },
  ],
  games: [
    {
      gameId: "game123",
      roomId: "room123",
      type: "feedTheKraken",
      players: [
        {
          nickname: "First",
          playerId: "1",
          socketId: "S1",
          isReady: true,
        },
        {
          nickname: "Second",
          playerId: "2",
          socketId: "S2",
          isReady: true,
        },
        {
          nickname: "Third",
          playerId: "3",
          socketId: "S3",
          isReady: true,
        },
        {
          nickname: "Fourth",
          playerId: "4",
          socketId: "S4",
          isReady: true,
        },
        {
          nickname: "Fifth",
          playerId: "5",
          socketId: "S5",
          isReady: true,
        },
        // {
        //   nickname: "Sixth",
        //   playerId: "6",
        //   socketId: "S6",
        //   isReady: true,
        // },
      ],
      gameStatus: "onGoing",
    },
  ],
  pendingInvites: [],
};

module.exports = {
  mockRoom,
};
