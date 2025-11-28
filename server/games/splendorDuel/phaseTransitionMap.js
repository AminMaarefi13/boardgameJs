const { onConfirmMove } = require("./gamePhases/onConfrmMove");

const phaseTransitionMap = {
  confirm_move: {
    next: "no_phases",
    handler: onConfirmMove,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
};

module.exports = phaseTransitionMap;
