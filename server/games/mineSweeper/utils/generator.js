const { getRandom } = require("./getRandom");
const { indCalc } = require("./indCalc");

function generator(rows, columns) {
  let ss = getRandom(Array.from(Array(56).keys()), 15);

  // console.log(ss);
  let mapArr = new Array(56).fill(0).map((item, index) => {
    let isThere = ss.includes(index) ? "bomb" : item;
    // console.log(index in ss);
    return isThere;
  });

  mapArr.map((item, index) => {
    if (item !== "bomb") {
      let rowInd = Math.floor(index / columns);
      let colInd = index % columns;
      // console.log(rowInd, colInd);
      let calcArr = [
        indCalc(rowInd - 1, colInd - 1),
        indCalc(rowInd - 1, colInd),
        indCalc(rowInd - 1, colInd + 1),
        indCalc(rowInd, colInd - 1),
        indCalc(rowInd, colInd),
        indCalc(rowInd, colInd + 1),
        indCalc(rowInd + 1, colInd - 1),
        indCalc(rowInd + 1, colInd),
        indCalc(rowInd + 1, colInd + 1),
      ];
      let mappedCalc = calcArr.map((calcItem) => {
        if (calcItem === 999) {
          return 0;
        } else {
          return mapArr[calcItem];
        }
      });
      // console.log(mappedCalc);
      let numberOfBombs = mappedCalc.reduce((prev, current) => {
        // console.log(prev);
        // console.log(current);
        if (current === "bomb") {
          prev += 1;
          return prev;
        } else {
          return prev;
        }
      }, 0);
      // console.log(numberOfBombs);
      mapArr[index] = numberOfBombs;
      return mapArr;
    }
  });
  let nullsArr = [];
  mapArr.forEach((item, index) => {
    if (item === 0) {
      // console.log(nullsArr);
      if (
        !nullsArr.some((nullItem) => {
          // console.log(nullItem);
          // console.log(index);
          return nullItem.has(index);
        })
      ) {
        let rowInd = Math.floor(index / columns);
        let colInd = index % columns;
        // console.log(rowInd, colInd);
        let indexArr = new Set([index]);
        // console.log(indexArr);
        for (let i = rowInd - 1; i <= rowInd + 1; i++) {
          for (let j = colInd - 1; j <= colInd + 1; j++) {
            // console.log(i, j);
            if (indCalc(i, j) !== 999) {
              if (mapArr[indCalc(i, j)] === 0) {
                // console.log(i, j);
                if (!indexArr.has(indCalc(i, j))) {
                  indexArr.add(indCalc(i, j));
                  // console.log(indexArr);
                }
              }
            }
          }
        }
        let found = false;
        indexArr.forEach((indexArrItem) => {
          nullsArr.forEach((nullForEachItem) => {
            if (nullForEachItem.has(indexArrItem)) {
              nullForEachItem.add(...indexArr);
              found = true;
              return;
            }
          });
        });
        if (!found) {
          nullsArr.push(new Set(indexArr));
        }
      }
    }
  });
  // console.log(nullsArr);
  return [nullsArr, mapArr];
}

module.exports = {
  generator,
};
