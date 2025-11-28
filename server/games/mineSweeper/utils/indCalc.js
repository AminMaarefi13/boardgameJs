function indCalc(row, col) {
  const rows = 8;
  const columns = 7;
  if (row > -1 && col > -1 && row < rows && col < columns) {
    return row * 7 + col;
  } else {
    return 999;
  }
}

module.exports = {
  indCalc,
};
