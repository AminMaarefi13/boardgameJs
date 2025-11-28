// game/config/journeyMapNodes.js
export const JOURNEY_TYPES = {
  QUICK: "quick",
  LONG: "long",
};

export const journeyMapNodes = {
  [JOURNEY_TYPES.QUICK]: {
    0: {
      id: 0,
      name: "Start",
      isEnd: false,
      effect: null,
      next: {
        blue: 1,
        yellow: 2,
        red: 3,
      },
    },
    1: {
      id: 1,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 4,
        yellow: 5,
        red: 2,
      },
    },
    2: {
      id: 2,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 5,
        yellow: 7,
        red: 7,
      },
    },
    3: {
      id: 3,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 2,
        yellow: 7,
        red: 8,
      },
    },
    4: {
      id: 4,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 9,
        yellow: 9,
        red: 5,
      },
    },
    5: {
      id: 5,
      name: "",
      isEnd: false,
      effect: "Cabin Search",
      next: {
        blue: 9,
        yellow: 10,
        red: 6,
      },
    },
    6: {
      id: 6,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 10,
        yellow: 11,
        red: 12,
      },
    },
    7: {
      id: 7,
      name: "",
      isEnd: false,
      effect: "Cabin Search",
      next: {
        blue: 6,
        yellow: 12,
        red: 13,
      },
    },
    8: {
      id: 8,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 7,
        yellow: 13,
        red: 13,
      },
    },
    9: {
      id: 9,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 14,
        yellow: 15,
        red: 10,
      },
    },
    10: {
      id: 10,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 15,
        yellow: 16,
        red: 11,
      },
    },
    11: {
      id: 11,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 16,
        yellow: 17,
        red: 18,
      },
    },
    12: {
      id: 12,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 11,
        yellow: 18,
        red: 19,
      },
    },
    13: {
      id: 13,
      name: "",
      isEnd: false,
      effect: "Cabin Search",
      next: {
        blue: 12,
        yellow: 19,
        red: 20,
      },
    },
    14: {
      id: 14,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 21,
        yellow: 15,
        red: 15,
      },
    },
    15: {
      id: 15,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 21,
        yellow: 16,
        red: 16,
      },
    },
    16: {
      id: 16,
      name: "",
      isEnd: false,
      effect: "Feed the Kraken",
      next: {
        blue: 21,
        yellow: 21,
        red: 17,
      },
    },
    17: {
      id: 17,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 21,
        yellow: 22,
        red: 23,
      },
    },
    18: {
      id: 18,
      name: "",
      isEnd: false,
      effect: "Feed the Kraken",
      next: {
        blue: 17,
        yellow: 23,
        red: 23,
      },
    },
    19: {
      id: 19,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 18,
        yellow: 18,
        red: 23,
      },
    },
    20: {
      id: 20,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 19,
        yellow: 19,
        red: 23,
      },
    },
    21: {
      id: 21,
      name: "",
      isEnd: true,
      effect: null,
      winner: "sailors",
      next: {},
    },
    22: {
      id: 22,
      name: "",
      isEnd: true,
      winner: "cult team",
      effect: null,
      next: {},
    },
    23: {
      id: 23,
      name: "",
      isEnd: true,
      winner: "pirates",
      effect: null,
      next: {},
    },
  },

  [JOURNEY_TYPES.LONG]: {
    0: {
      id: 0,
      name: "Start",
      isEnd: false,
      effect: null,
      next: {
        blue: 1,
        yellow: 2,
        red: 3,
      },
    },

    1: {
      id: 1,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 4,
        yellow: 4,
        red: 2,
      },
    },

    2: {
      id: 2,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 4,
        yellow: 5,
        red: 6,
      },
    },

    3: {
      id: 3,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 2,
        yellow: 6,
        red: 6,
      },
    },
    4: {
      id: 4,
      name: "",
      isEnd: false,
      effect: "Cabin Search",
      next: {
        blue: 7,
        yellow: 8,
        red: 5,
      },
    },
    5: {
      id: 5,
      name: "",
      isEnd: false,
      effect: "Cabin Search",
      next: {
        blue: 8,
        yellow: 10,
        red: 10,
      },
    },
    6: {
      id: 6,
      name: "",
      isEnd: false,
      effect: "Cabin Search",
      next: {
        blue: 5,
        yellow: 10,
        red: 11,
      },
    },
    7: {
      id: 7,
      name: "",
      isEnd: false,
      effect: null,
      gunReload: true,
      next: {
        blue: 12,
        yellow: 12,
        red: 8,
      },
    },
    8: {
      id: 8,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 12,
        yellow: 13,
        red: 9,
      },
    },
    9: {
      id: 9,
      name: "",
      isEnd: false,
      effect: "Off with Tongue",
      next: {
        blue: 13,
        yellow: 14,
        red: 15,
      },
    },
    10: {
      id: 10,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 9,
        yellow: 15,
        red: 16,
      },
    },
    11: {
      id: 11,
      name: "",
      isEnd: false,
      effect: "Cabin Search",
      gunReload: true,
      next: {
        blue: 10,
        yellow: 16,
        red: 16,
      },
    },
    12: {
      id: 12,
      name: "",
      isEnd: false,
      effect: null,
      gunReload: true,
      next: {
        blue: 17,
        yellow: 18,
        red: 13,
      },
    },
    13: {
      id: 13,
      name: "",
      isEnd: false,
      effect: "Flogging",
      next: {
        blue: 18,
        yellow: 19,
        red: 14,
      },
    },
    14: {
      id: 14,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 19,
        yellow: 20,
        red: 21,
      },
    },
    15: {
      id: 15,
      name: "",
      isEnd: false,
      effect: "Flogging",
      next: {
        blue: 14,
        yellow: 21,
        red: 22,
      },
    },
    16: {
      id: 16,
      name: "",
      isEnd: false,
      effect: null,
      gunReload: true,
      next: {
        blue: 15,
        yellow: 22,
        red: 23,
      },
    },
    17: {
      id: 17,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 24,
        yellow: 18,
        red: 18,
      },
    },
    18: {
      id: 18,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 24,
        yellow: 19,
        red: 19,
      },
    },
    19: {
      id: 19,
      name: "",
      isEnd: false,
      effect: "Feed the Kraken",
      next: {
        blue: 24,
        yellow: 24,
        red: 20,
      },
    },
    20: {
      id: 20,
      name: "",
      isEnd: false,
      effect: "Feed the Kraken",
      next: {
        blue: 24,
        yellow: 25,
        red: 26,
      },
    },
    21: {
      id: 21,
      name: "",
      isEnd: false,
      effect: "Feed the Kraken",
      next: {
        blue: 20,
        yellow: 26,
        red: 26,
      },
    },
    22: {
      id: 22,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 21,
        yellow: 21,
        red: 26,
      },
    },
    23: {
      id: 23,
      name: "",
      isEnd: false,
      effect: null,
      next: {
        blue: 22,
        yellow: 22,
        red: 26,
      },
    },
    24: {
      id: 24,
      name: "",
      isEnd: true,
      effect: null,
      winner: "sailors",
      next: {},
    },
    25: {
      id: 25,
      name: "",
      isEnd: true,
      winner: "cult team",
      effect: null,
      next: {},
    },
    26: {
      id: 26,
      name: "",
      isEnd: true,
      winner: "pirates",
      effect: null,
      next: {},
    },
  },
};


// const quickJeorneyMapNodes = {
//   0: {
//     id: 0,
//     name: "Start",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 1,
//       yellow: 2,
//       red: 3,
//     },
//   },

//   1: {
//     id: 1,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 4,
//       yellow: 5,
//       red: 2,
//     },
//   },

//   2: {
//     id: 2,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 5,
//       yellow: 7,
//       red: 7,
//     },
//   },

//   3: {
//     id: 3,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 2,
//       yellow: 7,
//       red: 8,
//     },
//   },
//   4: {
//     id: 4,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 9,
//       yellow: 9,
//       red: 5,
//     },
//   },
//   5: {
//     id: 5,
//     name: "",
//     isEnd: false,
//     effect: "Cabin Search",
//     next: {
//       blue: 9,
//       yellow: 10,
//       red: 6,
//     },
//   },
//   6: {
//     id: 6,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 10,
//       yellow: 11,
//       red: 12,
//     },
//   },
//   7: {
//     id: 7,
//     name: "",
//     isEnd: false,
//     effect: "Cabin Search",
//     next: {
//       blue: 6,
//       yellow: 12,
//       red: 13,
//     },
//   },
//   8: {
//     id: 8,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 7,
//       yellow: 13,
//       red: 13,
//     },
//   },
//   9: {
//     id: 9,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 14,
//       yellow: 15,
//       red: 10,
//     },
//   },
//   10: {
//     id: 10,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 15,
//       yellow: 16,
//       red: 11,
//     },
//   },
//   11: {
//     id: 11,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 16,
//       yellow: 17,
//       red: 18,
//     },
//   },
//   12: {
//     id: 12,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 11,
//       yellow: 18,
//       red: 19,
//     },
//   },
//   13: {
//     id: 13,
//     name: "",
//     isEnd: false,
//     effect: "Cabin Search",
//     next: {
//       blue: 12,
//       yellow: 19,
//       red: 20,
//     },
//   },
//   14: {
//     id: 14,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 21,
//       yellow: 15,
//       red: 15,
//     },
//   },
//   15: {
//     id: 15,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 21,
//       yellow: 16,
//       red: 16,
//     },
//   },
//   16: {
//     id: 16,
//     name: "",
//     isEnd: false,
//     effect: "Feed the Kraken",
//     next: {
//       blue: 21,
//       yellow: 21,
//       red: 17,
//     },
//   },
//   17: {
//     id: 17,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 21,
//       yellow: 22,
//       red: 23,
//     },
//   },
//   18: {
//     id: 18,
//     name: "",
//     isEnd: false,
//     effect: "Feed the Kraken",
//     next: {
//       blue: 17,
//       yellow: 23,
//       red: 23,
//     },
//   },
//   19: {
//     id: 19,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 18,
//       yellow: 18,
//       red: 23,
//     },
//   },
//   20: {
//     id: 20,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 19,
//       yellow: 19,
//       red: 23,
//     },
//   },
//   21: {
//     id: 21,
//     name: "",
//     isEnd: true,
//     effect: null,
//     winner: "sailors",
//     next: {},
//   },
//   22: {
//     id: 22,
//     name: "",
//     isEnd: true,
//     winner: "cult team",
//     effect: null,
//     next: {},
//   },
//   23: {
//     id: 23,
//     name: "",
//     isEnd: true,
//     winner: "pirates",
//     effect: null,
//     next: {},
//   },
// };

// const longJeorneyMapNodes = {
//   0: {
//     id: 0,
//     name: "Start",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 1,
//       yellow: 2,
//       red: 3,
//     },
//   },

//   1: {
//     id: 1,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 4,
//       yellow: 4,
//       red: 2,
//     },
//   },

//   2: {
//     id: 2,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 4,
//       yellow: 5,
//       red: 6,
//     },
//   },

//   3: {
//     id: 3,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 2,
//       yellow: 6,
//       red: 6,
//     },
//   },
//   4: {
//     id: 4,
//     name: "",
//     isEnd: false,
//     effect: "Cabin Search",
//     next: {
//       blue: 7,
//       yellow: 8,
//       red: 5,
//     },
//   },
//   5: {
//     id: 5,
//     name: "",
//     isEnd: false,
//     effect: "Cabin Search",
//     next: {
//       blue: 8,
//       yellow: 10,
//       red: 10,
//     },
//   },
//   6: {
//     id: 6,
//     name: "",
//     isEnd: false,
//     effect: "Cabin Search",
//     next: {
//       blue: 5,
//       yellow: 10,
//       red: 11,
//     },
//   },
//   7: {
//     id: 7,
//     name: "",
//     isEnd: false,
//     effect: null,
//     gunReload: true,
//     next: {
//       blue: 12,
//       yellow: 12,
//       red: 8,
//     },
//   },
//   8: {
//     id: 8,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 12,
//       yellow: 13,
//       red: 9,
//     },
//   },
//   9: {
//     id: 9,
//     name: "",
//     isEnd: false,
//     effect: "Off with Tongue",
//     next: {
//       blue: 13,
//       yellow: 14,
//       red: 15,
//     },
//   },
//   10: {
//     id: 10,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 9,
//       yellow: 15,
//       red: 16,
//     },
//   },
//   11: {
//     id: 11,
//     name: "",
//     isEnd: false,
//     effect: "Cabin Search",
//     gunReload: true,
//     next: {
//       blue: 10,
//       yellow: 16,
//       red: 16,
//     },
//   },
//   12: {
//     id: 12,
//     name: "",
//     isEnd: false,
//     effect: null,
//     gunReload: true,
//     next: {
//       blue: 17,
//       yellow: 18,
//       red: 13,
//     },
//   },
//   13: {
//     id: 13,
//     name: "",
//     isEnd: false,
//     effect: "Flogging",
//     next: {
//       blue: 18,
//       yellow: 19,
//       red: 14,
//     },
//   },
//   14: {
//     id: 14,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 19,
//       yellow: 20,
//       red: 21,
//     },
//   },
//   15: {
//     id: 15,
//     name: "",
//     isEnd: false,
//     effect: "Flogging",
//     next: {
//       blue: 14,
//       yellow: 21,
//       red: 22,
//     },
//   },
//   16: {
//     id: 16,
//     name: "",
//     isEnd: false,
//     effect: null,
//     gunReload: true,
//     next: {
//       blue: 15,
//       yellow: 22,
//       red: 23,
//     },
//   },
//   17: {
//     id: 17,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 24,
//       yellow: 18,
//       red: 18,
//     },
//   },
//   18: {
//     id: 18,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 24,
//       yellow: 19,
//       red: 19,
//     },
//   },
//   19: {
//     id: 19,
//     name: "",
//     isEnd: false,
//     effect: "Feed the Kraken",
//     next: {
//       blue: 24,
//       yellow: 24,
//       red: 20,
//     },
//   },
//   20: {
//     id: 20,
//     name: "",
//     isEnd: false,
//     effect: "Feed the Kraken",
//     next: {
//       blue: 24,
//       yellow: 25,
//       red: 26,
//     },
//   },
//   21: {
//     id: 21,
//     name: "",
//     isEnd: false,
//     effect: "Feed the Kraken",
//     next: {
//       blue: 20,
//       yellow: 26,
//       red: 26,
//     },
//   },
//   22: {
//     id: 22,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 21,
//       yellow: 21,
//       red: 26,
//     },
//   },
//   23: {
//     id: 23,
//     name: "",
//     isEnd: false,
//     effect: null,
//     next: {
//       blue: 22,
//       yellow: 22,
//       red: 26,
//     },
//   },
//   24: {
//     id: 24,
//     name: "",
//     isEnd: true,
//     effect: null,
//     winner: "sailors",
//     next: {},
//   },
//   25: {
//     id: 25,
//     name: "",
//     isEnd: true,
//     winner: "cult team",
//     effect: null,
//     next: {},
//   },
//   26: {
//     id: 26,
//     name: "",
//     isEnd: true,
//     winner: "pirates",
//     effect: null,
//     next: {},
//   },
// };

// module.exports = { quickJeorneyMapNodes, longJeorneyMapNodes };

/// Graph Visualization
/// https://dreampuf.github.io/GraphvizOnline/
/// Script:
// function toGraphviz(mapNodes, title = "Map") {
//   let lines = [`digraph ${title} {`];
//   for (const node of Object.values(mapNodes)) {
//     if (node.isEnd) {
//       lines.push(`  ${node.id} [shape=doublecircle, label="${node.id} (${node.winner})"]`);
//     } else {
//       lines.push(`  ${node.id} [label="${node.id}${node.effect ? ' (' + node.effect + ')' : ''}"]`);
//       for (const [color, nextId] of Object.entries(node.next)) {
//         lines.push(`  ${node.id} -> ${nextId} [label="${color}"];`);
//       }
//     }
//   }
//   lines.push("}");
//   return lines.join("\n");
// }

/// Quick Jeorney Output String:
/// Quick Jeorney Output String:
/// Quick Jeorney Output String:
// digraph Map {
//   0 [label="0"]
//   0 -> 1 [label="blue"];
//   0 -> 2 [label="yellow"];
//   0 -> 3 [label="red"];
//   1 [label="1"]
//   1 -> 4 [label="blue"];
//   1 -> 5 [label="yellow"];
//   1 -> 2 [label="red"];
//   2 [label="2"]
//   2 -> 5 [label="blue"];
//   2 -> 7 [label="yellow"];
//   2 -> 7 [label="red"];
//   3 [label="3"]
//   3 -> 2 [label="blue"];
//   3 -> 7 [label="yellow"];
//   3 -> 8 [label="red"];
//   4 [label="4"]
//   4 -> 9 [label="blue"];
//   4 -> 9 [label="yellow"];
//   4 -> 5 [label="red"];
//   5 [label="5 (Cabin Search)"]
//   5 -> 9 [label="blue"];
//   5 -> 10 [label="yellow"];
//   5 -> 6 [label="red"];
//   6 [label="6"]
//   6 -> 10 [label="blue"];
//   6 -> 11 [label="yellow"];
//   6 -> 12 [label="red"];
//   7 [label="7 (Cabin Search)"]
//   7 -> 6 [label="blue"];
//   7 -> 12 [label="yellow"];
//   7 -> 13 [label="red"];
//   8 [label="8"]
//   8 -> 7 [label="blue"];
//   8 -> 13 [label="yellow"];
//   8 -> 13 [label="red"];
//   9 [label="9"]
//   9 -> 14 [label="blue"];
//   9 -> 15 [label="yellow"];
//   9 -> 10 [label="red"];
//   10 [label="10"]
//   10 -> 15 [label="blue"];
//   10 -> 16 [label="yellow"];
//   10 -> 11 [label="red"];
//   11 [label="11"]
//   11 -> 16 [label="blue"];
//   11 -> 17 [label="yellow"];
//   11 -> 18 [label="red"];
//   12 [label="12"]
//   12 -> 11 [label="blue"];
//   12 -> 18 [label="yellow"];
//   12 -> 19 [label="red"];
//   13 [label="13 (Cabin Search)"]
//   13 -> 12 [label="blue"];
//   13 -> 19 [label="yellow"];
//   13 -> 20 [label="red"];
//   14 [label="14"]
//   14 -> 21 [label="blue"];
//   14 -> 15 [label="yellow"];
//   14 -> 15 [label="red"];
//   15 [label="15"]
//   15 -> 21 [label="blue"];
//   15 -> 16 [label="yellow"];
//   15 -> 16 [label="red"];
//   16 [label="16 (Feed the Kraken)"]
//   16 -> 21 [label="blue"];
//   16 -> 21 [label="yellow"];
//   16 -> 17 [label="red"];
//   17 [label="17"]
//   17 -> 21 [label="blue"];
//   17 -> 22 [label="yellow"];
//   17 -> 23 [label="red"];
//   18 [label="18 (Feed the Kraken)"]
//   18 -> 17 [label="blue"];
//   18 -> 23 [label="yellow"];
//   18 -> 23 [label="red"];
//   19 [label="19"]
//   19 -> 18 [label="blue"];
//   19 -> 18 [label="yellow"];
//   19 -> 23 [label="red"];
//   20 [label="20"]
//   20 -> 19 [label="blue"];
//   20 -> 19 [label="yellow"];
//   20 -> 23 [label="red"];
//   21 [shape=doublecircle, label="21 (sailors)"]
//   22 [shape=doublecircle, label="22 (cult team)"]
//   23 [shape=doublecircle, label="23 (pirates)"]
// }
/// Quick Jeorney Output String:
/// Quick Jeorney Output String:
/// Quick Jeorney Output String:
/// Long Jeorney Output String:
/// Long Jeorney Output String:
/// Long Jeorney Output String:
// digraph Map {
//   0 [label="0"]
//   0 -> 1 [label="blue"];
//   0 -> 2 [label="yellow"];
//   0 -> 3 [label="red"];
//   1 [label="1"]
//   1 -> 4 [label="blue"];
//   1 -> 4 [label="yellow"];
//   1 -> 2 [label="red"];
//   2 [label="2"]
//   2 -> 4 [label="blue"];
//   2 -> 5 [label="yellow"];
//   2 -> 6 [label="red"];
//   3 [label="3"]
//   3 -> 2 [label="blue"];
//   3 -> 6 [label="yellow"];
//   3 -> 6 [label="red"];
//   4 [label="4 (Cabin Search)"]
//   4 -> 7 [label="blue"];
//   4 -> 8 [label="yellow"];
//   4 -> 5 [label="red"];
//   5 [label="5 (Cabin Search)"]
//   5 -> 8 [label="blue"];
//   5 -> 10 [label="yellow"];
//   5 -> 10 [label="red"];
//   6 [label="6 (Cabin Search)"]
//   6 -> 5 [label="blue"];
//   6 -> 10 [label="yellow"];
//   6 -> 11 [label="red"];
//   7 [label="7"]
//   7 -> 12 [label="blue"];
//   7 -> 12 [label="yellow"];
//   7 -> 8 [label="red"];
//   8 [label="8"]
//   8 -> 12 [label="blue"];
//   8 -> 13 [label="yellow"];
//   8 -> 9 [label="red"];
//   9 [label="9 (Off with Tongue)"]
//   9 -> 13 [label="blue"];
//   9 -> 14 [label="yellow"];
//   9 -> 15 [label="red"];
//   10 [label="10"]
//   10 -> 9 [label="blue"];
//   10 -> 15 [label="yellow"];
//   10 -> 16 [label="red"];
//   11 [label="11 (Cabin Search)"]
//   11 -> 10 [label="blue"];
//   11 -> 16 [label="yellow"];
//   11 -> 16 [label="red"];
//   12 [label="12"]
//   12 -> 17 [label="blue"];
//   12 -> 18 [label="yellow"];
//   12 -> 13 [label="red"];
//   13 [label="13 (Flogging)"]
//   13 -> 18 [label="blue"];
//   13 -> 19 [label="yellow"];
//   13 -> 14 [label="red"];
//   14 [label="14"]
//   14 -> 19 [label="blue"];
//   14 -> 20 [label="yellow"];
//   14 -> 21 [label="red"];
//   15 [label="15 (Flogging)"]
//   15 -> 14 [label="blue"];
//   15 -> 21 [label="yellow"];
//   15 -> 22 [label="red"];
//   16 [label="16"]
//   16 -> 15 [label="blue"];
//   16 -> 22 [label="yellow"];
//   16 -> 23 [label="red"];
//   17 [label="17"]
//   17 -> 24 [label="blue"];
//   17 -> 18 [label="yellow"];
//   17 -> 18 [label="red"];
//   18 [label="18"]
//   18 -> 24 [label="blue"];
//   18 -> 19 [label="yellow"];
//   18 -> 19 [label="red"];
//   19 [label="19 (Feed the Kraken)"]
//   19 -> 24 [label="blue"];
//   19 -> 24 [label="yellow"];
//   19 -> 20 [label="red"];
//   20 [label="20 (Feed the Kraken)"]
//   20 -> 24 [label="blue"];
//   20 -> 25 [label="yellow"];
//   20 -> 26 [label="red"];
//   21 [label="21 (Feed the Kraken)"]
//   21 -> 20 [label="blue"];
//   21 -> 26 [label="yellow"];
//   21 -> 26 [label="red"];
//   22 [label="22"]
//   22 -> 21 [label="blue"];
//   22 -> 21 [label="yellow"];
//   22 -> 26 [label="red"];
//   23 [label="23"]
//   23 -> 22 [label="blue"];
//   23 -> 22 [label="yellow"];
//   23 -> 26 [label="red"];
//   24 [shape=doublecircle, label="24 (sailors)"]
//   25 [shape=doublecircle, label="25 (cult team)"]
//   26 [shape=doublecircle, label="26 (pirates)"]
// }
/// Long Jeorney Output String:
/// Long Jeorney Output String:
/// Long Jeorney Output String:
