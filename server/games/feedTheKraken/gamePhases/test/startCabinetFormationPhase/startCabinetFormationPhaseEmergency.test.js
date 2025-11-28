const { buildCustomGameState } = require("../../../Mocks/buildCustomGameState");
const {
  startCabinetFormationPhase,
} = require("../../startCabinetFormationPhase");
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
  navigatorId: "3",
  nextPhaseData: { emergency: true },
});

beforeEach(() => {
  getValidGameAndRoom.mockReturnValue({
    game: mockGame,
    room: mockRoom,
    roomId: mockRoom.roomId,
    gameState: mockGame,
  });
});

test("If emergency is true, phase should be cabinet_formation and only navigator selection is allowed", async () => {
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

  await startCabinetFormationPhase(
    games,
    mockGame.gameId,
    rooms,
    userSocketMap,
    io,
    { emergency: true },
    {}
  );

  expect(mockGame.currentPhase).toBe("cabinet_formation");
  expect(mockGame.phaseData.currentPhase).toBe("cabinet_formation");
  expect(mockGame.phaseData.emergency).toBe(true);
  expect(mockGame.logs[mockGame.logs.length - 1].type).toBe("phase");
  expect(updateAndBroadcastGame).toHaveBeenCalled();
});
