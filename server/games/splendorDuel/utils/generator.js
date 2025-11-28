const { shuffle } = require("../../../utils/shuffle");
const { DEV_CARDS, NOBLE_TILES } = require("../gameSetupConfig");

function generator() {
  // 2. Noble tiles
  const nobleTilesDeckRandom = shuffle(NOBLE_TILES).slice(0, 4);
  console.log("nobleTilesDeckRandom");
  console.log(nobleTilesDeckRandom);
  // 3. Dev cards for each level
  // Level One
  const levelOneShuffled = shuffle(DEV_CARDS["LEVEL_ONE"]);
  const levelOneDevCardsVisibleRandom = levelOneShuffled.slice(0, 5);
  const levelOneDevCardsDeckRandom = levelOneShuffled.slice(5);
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
  const levelThreeDevCardsVisibleRandom = levelThreeShuffled.slice(0, 3);
  const levelThreeDevCardsDeckRandom = levelThreeShuffled.slice(3);
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
  ];
}

module.exports = {
  generator,
};
