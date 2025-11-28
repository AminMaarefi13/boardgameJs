// game/logic/phaseManager.js

import { PHASES } from "../../utils/gamePhases";

let currentPhase = PHASES.SETUP;

export function getCurrentPhase() {
  return currentPhase;
}

export function advancePhase() {
  if (currentPhase === PHASES.SETUP) {
    currentPhase = PHASES.ROLE_ASSIGNMENT;
  } else if (currentPhase === PHASES.ROLE_ASSIGNMENT) {
    currentPhase = PHASES.CABINET_SELECTION;
  }
  // و غیره...
  return currentPhase;
}
