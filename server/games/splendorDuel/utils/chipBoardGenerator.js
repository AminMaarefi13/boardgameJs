const { shuffle } = require("../../../utils/shuffle");

const chipsArr = [
  ...new Array(4).fill("white"),
  ...new Array(4).fill("blue"),
  ...new Array(4).fill("green"),
  ...new Array(4).fill("red"),
  ...new Array(4).fill("black"),
  ...new Array(3).fill("yellow"),
  ...new Array(2).fill("pearl"),
];
console.log(chipsArr);

const board = [
  { id: 16 },
  { id: 17 },
  { id: 18 },
  { id: 19 },
  { id: 20 },
  { id: 15 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 21 },
  { id: 14 },
  { id: 3 },
  { id: 0 },
  { id: 7 },
  { id: 22 },
  { id: 13 },
  { id: 2 },
  { id: 1 },
  { id: 8 },
  { id: 23 },
  { id: 12 },
  { id: 11 },
  { id: 10 },
  { id: 9 },
  { id: 24 },
];

function chipBoardGenerator() {
  const shuffledChipsArr = shuffle(chipsArr);
  console.log(shuffledChipsArr);

  const boardMapped = board.map((cell, index) => {
    return { id: cell.id, value: shuffledChipsArr[index] };
  });
  console.log("boardMapped", boardMapped);

  return boardMapped;
}

module.exports = {
  chipBoardGenerator,
};
