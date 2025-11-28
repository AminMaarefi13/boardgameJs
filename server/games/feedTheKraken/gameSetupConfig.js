// game/config/gameSetupConfig.js

const JOURNEY_TYPES = {
  QUICK: "quick",
  LONG: "long",
};

const navigationCards = {
  [JOURNEY_TYPES.QUICK]: [
    // Yellow
    { color: "yellow", type: "cult_uprising" },
    { color: "yellow", type: "cult_uprising" },
    { color: "yellow", type: "cult_uprising" },
    { color: "yellow", type: "cult_uprising" },
    { color: "yellow", type: "cult_uprising" },
    // Blue
    { color: "blue", type: "drunk" },
    { color: "blue", type: "drunk" },
    { color: "blue", type: "drunk" },
    { color: "blue", type: "disarmed" },
    { color: "blue", type: "disarmed" },
    // Red
    { color: "red", type: "drunk" },
    { color: "red", type: "drunk" },
    { color: "red", type: "drunk" },
    { color: "red", type: "drunk" },
    { color: "red", type: "drunk" },
    { color: "red", type: "mermaid" },
    { color: "red", type: "mermaid" },
    { color: "red", type: "telescope" },
    { color: "red", type: "telescope" },
  ],
  [JOURNEY_TYPES.LONG]: [
    // Yellow
    { color: "yellow", type: "cult_uprising" },
    { color: "yellow", type: "cult_uprising" },
    { color: "yellow", type: "cult_uprising" },
    { color: "yellow", type: "cult_uprising" },
    { color: "yellow", type: "cult_uprising" },
    { color: "yellow", type: "cult_uprising" },
    // Blue
    { color: "blue", type: "drunk" },
    { color: "blue", type: "drunk" },
    { color: "blue", type: "drunk" },
    { color: "blue", type: "drunk" },
    { color: "blue", type: "disarmed" },
    { color: "blue", type: "disarmed" },
    // Red
    { color: "red", type: "drunk" },
    { color: "red", type: "drunk" },
    { color: "red", type: "drunk" },
    { color: "red", type: "drunk" },
    { color: "red", type: "drunk" },
    { color: "red", type: "mermaid" },
    { color: "red", type: "mermaid" },
    { color: "red", type: "telescope" },
    { color: "red", type: "telescope" },
    { color: "red", type: "armed" },
    { color: "red", type: "armed" },
  ],
};

// const navigationCards = {
//   [JOURNEY_TYPES.QUICK]: [
//     // Yellow
//     { color: "yellow", type: "cult_uprising" },
//     { color: "yellow", type: "cult_uprising" },
//     { color: "yellow", type: "cult_uprising" },
//     { color: "yellow", type: "cult_uprising" },
//     { color: "yellow", type: "cult_uprising" },
//     // Blue
//     { color: "blue", type: "drunk" },
//     { color: "blue", type: "drunk" },
//     { color: "blue", type: "drunk" },
//     { color: "blue", type: "disarmed" },
//     { color: "blue", type: "disarmed" },
//     // Red
//     { color: "red", type: "drunk" },
//     { color: "red", type: "drunk" },
//     { color: "red", type: "drunk" },
//     { color: "red", type: "drunk" },
//     { color: "red", type: "drunk" },
//     { color: "red", type: "mermaid" },
//     { color: "red", type: "mermaid" },
//     { color: "red", type: "telescope" },
//     { color: "red", type: "telescope" },
//   ],
//   [JOURNEY_TYPES.LONG]: [
//     // Yellow
//     { color: "yellow", type: "cult_uprising" },
//     { color: "yellow", type: "cult_uprising" },
//     { color: "yellow", type: "cult_uprising" },
//     { color: "yellow", type: "cult_uprising" },
//     { color: "yellow", type: "cult_uprising" },
//     { color: "yellow", type: "cult_uprising" },
//     // Blue
//     { color: "blue", type: "drunk" },
//     { color: "blue", type: "drunk" },
//     { color: "blue", type: "drunk" },
//     { color: "blue", type: "drunk" },
//     { color: "blue", type: "disarmed" },
//     { color: "blue", type: "disarmed" },
//     // Red
//     { color: "red", type: "drunk" },
//     { color: "red", type: "drunk" },
//     { color: "red", type: "drunk" },
//     { color: "red", type: "drunk" },
//     { color: "red", type: "drunk" },
//     { color: "red", type: "mermaid" },
//     { color: "red", type: "mermaid" },
//     { color: "red", type: "telescope" },
//     { color: "red", type: "telescope" },
//     { color: "red", type: "armed" },
//     { color: "red", type: "armed" },
//   ],
// };

const cultRitualCards = [
  "cult_conversion",
  "cult_conversion",
  "cult_conversion",
  "cult_guns_stash",
  "cult_cabin_search",
];

// const cultRitualCards = [
//   "cult_conversion",
//   "cult_conversion",
//   "cult_conversion",
//   "cult_guns_stash",
//   "cult_cabin_search",
// ];

const offDutyCards = {
  [JOURNEY_TYPES.QUICK]: {
    5: ["Navigator"],
    6: ["Navigator"],
    7: ["Lieutenant", "Navigator"],
    8: ["Lieutenant", "Navigator"],
    9: ["Captain", "Lieutenant", "Navigator"],
    10: ["Captain", "Lieutenant", "Navigator"],
    11: ["Captain", "Lieutenant", "Navigator"],
  },
  [JOURNEY_TYPES.LONG]: {
    7: ["Lieutenant", "Navigator"],
    8: ["Lieutenant", "Navigator"],
    9: ["Captain", "Lieutenant", "Navigator"],
    10: ["Captain", "Lieutenant", "Navigator"],
    11: ["Captain", "Lieutenant", "Navigator"],
  },
};

const mapTokens = {
  [JOURNEY_TYPES.QUICK]: {
    cabin_search: 3,
    feed_the_kraken: 2,
  },
  [JOURNEY_TYPES.LONG]: {
    cabin_search: 4,
    feed_the_kraken: 3,
    flogging: 2,
    off_with_tongue: 1,
  },
};

const characterCards = [
  "captain",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
]; // شامل 1x Captain + یک کارت رندوم دیگر برای Captain

const roleDistribution = {
  5: [
    { sailor: 3, pirate: 1, cultLeader: 1, cultist: 0 },
    { sailor: 2, pirate: 2, cultLeader: 1, cultist: 0 },
  ],
  6: [{ sailor: 3, pirate: 2, cultLeader: 1, cultist: 0 }],
  7: [{ sailor: 4, pirate: 2, cultLeader: 1, cultist: 0 }],
  8: [{ sailor: 4, pirate: 3, cultLeader: 1, cultist: 0 }],
  9: [{ sailor: 5, pirate: 3, cultLeader: 1, cultist: 0 }],
  10: [{ sailor: 5, pirate: 4, cultLeader: 1, cultist: 0 }],
  11: [{ sailor: 5, pirate: 4, cultLeader: 1, cultist: 1 }],
};

module.exports = {
  JOURNEY_TYPES,
  navigationCards,
  offDutyCards,
  mapTokens,
  cultRitualCards,
  characterCards,
  roleDistribution,
};
