const { shuffle } = require("../../../utils/shuffle");
const {
  DEV_CARDS,
  CHIPS_QUANTITY,
  NOBLE_TILES_QUNTITY,
  NOBLE_TILES,
  PLAYERS,
} = require("../gameSetupConfig");

// Map number to player key
function getPlayerKey(num) {
  if (num === 2) return PLAYERS.TWO_PLAYERS;
  if (num === 3) return PLAYERS.THREE_PLAYERS;
  if (num === 4) return PLAYERS.FOUR_PLAYERS;
  throw new Error("Invalid player count");
}

function generator(numberOfPlayers) {
  // 1. Chip quantity
  const playerKey = getPlayerKey(numberOfPlayers);
  const chipQuantity = CHIPS_QUANTITY[playerKey].chipQuantity;
  console.log("chipQuantity");
  console.log(chipQuantity);
  // 2. Noble tiles
  const nobleCount = NOBLE_TILES_QUNTITY[playerKey].nobleTiles;
  const nobleTilesDeckRandom = shuffle(NOBLE_TILES).slice(0, nobleCount);
  console.log("nobleCount");
  console.log(nobleCount);
  console.log("nobleTilesDeckRandom");
  console.log(nobleTilesDeckRandom);
  // 3. Dev cards for each level
  // Level One
  const levelOneShuffled = shuffle(DEV_CARDS["LEVEL_ONE"]);
  const levelOneDevCardsVisibleRandom = levelOneShuffled.slice(0, 4);
  const levelOneDevCardsDeckRandom = levelOneShuffled.slice(4);
  console.log("levelOneDevCardsVisibleRandom");
  console.log(levelOneDevCardsVisibleRandom);

  // Level Two
  const levelTwoShuffled = shuffle(DEV_CARDS["LEVEL_TWO"]);
  const levelTwoDevCardsVisibleRandom = levelTwoShuffled.slice(0, 4);
  const levelTwoDevCardsDeckRandom = levelTwoShuffled.slice(4);
  console.log("levelTwoDevCardsVisibleRandom");
  console.log(levelTwoDevCardsVisibleRandom);
  // Level Three
  const levelThreeShuffled = shuffle(DEV_CARDS["LEVEL_THREE"]);
  const levelThreeDevCardsVisibleRandom = levelThreeShuffled.slice(0, 4);
  const levelThreeDevCardsDeckRandom = levelThreeShuffled.slice(4);
  console.log("levelThreeDevCardsVisibleRandom");
  console.log(levelThreeDevCardsVisibleRandom);
  return [
    levelOneDevCardsDeckRandom,
    levelTwoDevCardsDeckRandom,
    levelThreeDevCardsDeckRandom,
    levelOneDevCardsVisibleRandom,
    levelTwoDevCardsVisibleRandom,
    levelThreeDevCardsVisibleRandom,
    nobleTilesDeckRandom,
    chipQuantity,
  ];
}

module.exports = {
  generator,
};
