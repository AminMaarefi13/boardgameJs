const { buildCustomGameState } = require("../../../Mocks/buildCustomGameState");
const { confirmCabinet } = require("../../confirmCabinet");
const {
  updateAndBroadcastGame,
} = require("../../../../../utils/updateAndBroadcastGame");
const {
  getValidGameAndRoom,
} = require("../../../../../utils/getValidGameAndRoom");
const { mockRoom } = require("../../../Mocks/mockRoom");

jest.mock("../../../../../utils/updateAndBroadcastGame", () => ({
  updateAndBroadcastGame: jest.fn(),
}));

jest.mock("../../../../../utils/getValidGameAndRoom", () => ({
  getValidGameAndRoom: jest.fn(),
}));

const mockGame = buildCustomGameState({
  currentPhase: "cabinet_formation",
  mapPosition: 1,
  captainId: "1",
  firstOfficerId: "2",
  navigatorId: null,
  eliminateByIds: ["3", "4", "5"],
  nextPhaseData: { emergency: false },
});

beforeEach(() => {
  getValidGameAndRoom.mockReturnValue({
    game: mockGame,
    room: mockRoom,
    roomId: mockRoom.roomId,
    gameState: mockGame,
  });
});

test("If navigator is not selected and first officer is selected, phase should be cabinet_confirmed", async () => {
  const games = new Map([["game123", mockGame]]);
  const rooms = new Map([["room123", mockRoom]]);

  const userSocketMap = new Map([
    ["1", "S1"],
    ["2", "S2"],
    ["3", "S3"],
    ["4", "S4"],
    ["5", "S5"],
    ["6", "S6"],
  ]);
  const io = {};

  await confirmCabinet(
    games,
    mockGame.gameId,
    rooms,
    userSocketMap,
    io,
    {},
    { emergency: false, firstOfficerId: "2", navigatorId: null }
  );

  expect(mockGame.currentPhase).toBe("cabinet_confirmed");
  expect(mockGame.logs[mockGame.logs.length - 1].type).toBe(
    "cabinet_confirmed"
  );
  expect(updateAndBroadcastGame).toHaveBeenCalled();
});

// Emergency mode test
test("If navigator is not selected and first officer is selected and emergency is true, phase should be emergency_cabinet_confirmed", async () => {
  const emergencyMockGame = buildCustomGameState({
    currentPhase: "cabinet_formation",
    mapPosition: 1,
    captainId: "1",
    firstOfficerId: "2",
    navigatorId: null,
    eliminateByIds: ["3", "4", "5"],
    nextPhaseData: { emergency: true },
  });

  getValidGameAndRoom.mockReturnValue({
    game: emergencyMockGame,
    room: mockRoom,
    roomId: mockRoom.roomId,
    gameState: emergencyMockGame,
  });

  const games = new Map([["game123", emergencyMockGame]]);
  const rooms = new Map([["room123", mockRoom]]);

  const userSocketMap = new Map([
    ["1", "S1"],
    ["2", "S2"],
    ["3", "S3"],
    ["4", "S4"],
    ["5", "S5"],
    ["6", "S6"],
  ]);
  const io = {};

  await confirmCabinet(
    games,
    emergencyMockGame.gameId,
    rooms,
    userSocketMap,
    io,
    {},
    { emergency: true, firstOfficerId: "2", navigatorId: null }
  );

  expect(emergencyMockGame.currentPhase).toBe("emergency_cabinet_confirmed");
  expect(emergencyMockGame.logs[emergencyMockGame.logs.length - 1].type).toBe(
    "emergency_cabinet_confirmed"
  );
  expect(updateAndBroadcastGame).toHaveBeenCalled();
});
