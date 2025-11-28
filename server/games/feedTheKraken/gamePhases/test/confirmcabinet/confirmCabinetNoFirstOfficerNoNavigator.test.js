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
  firstOfficerId: null,
  navigatorId: null,
  eliminateByIds: ["2", "3", "4", "5"],
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

test("If neither first officer nor navigator is selected, phase should be only_captain_cabinet_confirmed", async () => {
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
    { emergency: false, firstOfficerId: null, navigatorId: null }
  );

  expect(mockGame.currentPhase).toBe("only_captain_cabinet_confirmed");
  expect(mockGame.logs[mockGame.logs.length - 1].type).toBe(
    "only_captain_cabinet_confirmed"
  );
  expect(updateAndBroadcastGame).toHaveBeenCalled();
});

// Emergency mode test
test("If neither first officer nor navigator is selected and emergency is true, phase should be only_captain_cabinet_confirmed", async () => {
  const emergencyMockGame = buildCustomGameState({
    currentPhase: "cabinet_formation",
    mapPosition: 1,
    captainId: "1",
    firstOfficerId: null,
    navigatorId: null,
    eliminateByIds: ["2", "3", "4", "5"],
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
    { emergency: true, firstOfficerId: null, navigatorId: null }
  );

  expect(emergencyMockGame.currentPhase).toBe("only_captain_cabinet_confirmed");
  expect(emergencyMockGame.logs[emergencyMockGame.logs.length - 1].type).toBe(
    "only_captain_cabinet_confirmed"
  );
  expect(updateAndBroadcastGame).toHaveBeenCalled();
});

// const { buildCustomGameState } = require("../../Mocks/buildCustomGameState");
// const { confirmCabinet } = require("../confirmCabinet");
// const {
//   updateAndBroadcastGame,
// } = require("../../../../utils/updateAndBroadcastGame");
// const {
//   getValidGameAndRoom,
// } = require("../../../../utils/getValidGameAndRoom");
// const { mockRoom } = require("../../Mocks/mockRoom");
// // ماژول مربوط به برادکست رو ماک می‌کنیم
// jest.mock("../../../../utils/updateAndBroadcastGame", () => ({
//   updateAndBroadcastGame: jest.fn(),
// }));

// jest.mock("../../../../utils/getValidGameAndRoom", () => ({
//   getValidGameAndRoom: jest.fn(),
// }));

// const mockGame = buildCustomGameState({
//   currentPhase: "cabinet_formation",
//   mapPosition: 1,
//   captainId: "1",
//   firstOfficerId: null,
//   navigatorId: null,
//   // eliminateCount: 2,
//   // eliminateSkipRole: "cultLeader",
//   eliminateByIds: ["2", "3", "4", "5"],
//   // setRole: { id: "2", role: "kraken" },
//   // setPlayerProps: [
//   //   // { id: "1", eliminated: true, guns: 0 },
//   //   { id: "3", role: "pirate", offDuty: true },
//   // ],
//   // setAllPlayersProps: { tongueOff: true },
//   // phaseData: { phase: "custom_phase", title: "تست" },
//   nextPhaseData: { emergency: false },
//   // override: { gameStatus: "finished" },
// });

// beforeEach(() => {
//   getValidGameAndRoom.mockReturnValue({
//     game: mockGame,
//     room: mockRoom,
//     roomId: mockRoom.roomId,
//     gameState: mockGame,
//   });
// });

// test("✅ اگر افسر و کشتیران انتخاب نشده باشند، باید فاز only_captain_cabinet_confirmed فعال شود", async () => {
//   const games = new Map([["game123", mockGame]]);
//   const rooms = new Map([["room123", mockRoom]]);

//   const userSocketMap = new Map([
//     ["1", "S1"],
//     ["2", "S2"],
//     ["3", "S3"],
//     ["4", "S4"],
//     ["5", "S5"],
//     ["6", "S6"],
//   ]);
//   const io = {}; // نیازی نیست ماک بشه چون استفاده مستقیم نداره

//   await confirmCabinet(
//     games,
//     mockGame.gameId,
//     rooms,
//     userSocketMap,
//     io,
//     {},
//     { emergency: false, firstOfficerId: null, navigatorId: null }
//   );

//   expect(mockGame.currentPhase).toBe("only_captain_cabinet_confirmed");
//   expect(mockGame.logs[mockGame.logs.length - 1].type).toBe(
//     "only_captain_cabinet_confirmed"
//   );
//   expect(updateAndBroadcastGame).toHaveBeenCalled();
// });
