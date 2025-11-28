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

describe("startCabinetFormationPhase - no navigator and no first officer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("If enabledCount > 1, phaseData.selectablePlayers should have more than one enabled", async () => {
    // ساخت بازی با بازیکنان کافی که همه فعال باشند (enabledCount > 1)
    const mockGame = buildCustomGameState({
      currentPhase: "cabinet_formation",
      mapPosition: 1,
      captainId: "1",
      firstOfficerId: null,
      navigatorId: null,
    });

    getValidGameAndRoom.mockReturnValue({
      game: mockGame,
      room: mockRoom,
      roomId: mockRoom.roomId,
      gameState: mockGame,
    });

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
      { emergency: false },
      {}
    );

    const selectablePlayers = mockGame.players.find(
      (p) => p.id === mockGame.captainId
    ).privatePhaseData.selectablePlayers;
    console.log("selectablePlayers");
    console.log(selectablePlayers);

    expect(mockGame.currentPhase).toBe("cabinet_formation");
    expect(mockGame.phaseData.currentPhase).toBe("cabinet_formation");
    expect(mockGame.phaseData.emergency).toBe(false);
    // باید بیش از یک بازیکن فعال وجود داشته باشد
    const enabledCount = selectablePlayers
      ? selectablePlayers.filter((p) => !p.disabled).length
      : mockGame.players.filter((p) => p.id !== mockGame.captainId).length;
    expect(enabledCount).toBeGreaterThan(1);
    expect(updateAndBroadcastGame).toHaveBeenCalled();
  });

  test("If enabledCount === 0, offDuty player(s) should become enabled", async () => {
    // ساخت بازی با فقط یک بازیکن فعال و بقیه offDuty باشند (enabledCount <= 1)
    const mockGame = buildCustomGameState({
      currentPhase: "cabinet_formation",
      mapPosition: 1,
      captainId: "1",
      firstOfficerId: null,
      navigatorId: null,
      setPlayerProps: [{ id: "2", offDuty: true }],
      eliminateByIds: ["3", "4", "5"],
    });

    getValidGameAndRoom.mockReturnValue({
      game: mockGame,
      room: mockRoom,
      roomId: mockRoom.roomId,
      gameState: mockGame,
    });

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
      { emergency: false },
      {}
    );

    expect(mockGame.currentPhase).toBe("cabinet_formation");
    expect(mockGame.phaseData.currentPhase).toBe("cabinet_formation");
    expect(mockGame.phaseData.emergency).toBe(false);

    // باید بازیکنان offDuty فعال شده باشند (disabled=false)
    const selectablePlayers = mockGame.players.find(
      (p) => p.id === mockGame.captainId
    ).privatePhaseData.selectablePlayers;

    console.log("selectablePlayers ssssssssss");
    console.log(selectablePlayers);
    const enabledCount = selectablePlayers.filter((p) => !p.disabled).length;
    expect(enabledCount).toBe(1);
    expect(updateAndBroadcastGame).toHaveBeenCalled();
  });

  test("If enabledCount === 1, offDuty player(s) should become enabled", async () => {
    // ساخت بازی با فقط یک بازیکن فعال و بقیه offDuty باشند (enabledCount <= 1)
    const mockGame = buildCustomGameState({
      currentPhase: "cabinet_formation",
      mapPosition: 1,
      captainId: "1",
      firstOfficerId: null,
      navigatorId: null,
      setPlayerProps: [{ id: "2", offDuty: true }],
      eliminateByIds: ["4", "5"],
    });

    getValidGameAndRoom.mockReturnValue({
      game: mockGame,
      room: mockRoom,
      roomId: mockRoom.roomId,
      gameState: mockGame,
    });

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
      { emergency: false },
      {}
    );

    expect(mockGame.currentPhase).toBe("cabinet_formation");
    expect(mockGame.phaseData.currentPhase).toBe("cabinet_formation");
    expect(mockGame.phaseData.emergency).toBe(false);

    // باید بازیکنان offDuty فعال شده باشند (disabled=false)
    const selectablePlayers = mockGame.players.find(
      (p) => p.id === mockGame.captainId
    ).privatePhaseData.selectablePlayers;

    const enabledCount = selectablePlayers.filter((p) => !p.disabled).length;
    expect(enabledCount).toBe(2);
    expect(updateAndBroadcastGame).toHaveBeenCalled();
  });
});
