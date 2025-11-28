const { applyNodeEffect } = require("./gamePhases/applyNodeEffect");
const { confirmCabinet } = require("./gamePhases/confirmCabinet");
const {
  confirmMermaidOrTelescopeChoice,
} = require("./gamePhases/confirmMermaidOrTelescopeChoice");
const { cultRitualChoice } = require("./gamePhases/cultRitualChoice");
const { cultRitualFinished } = require("./gamePhases/cultRitualFinished");
const { handleNavigatorCard } = require("./gamePhases/handleNavigatorCard");
const { mermaidCardsSeen } = require("./gamePhases/mermaidCardsSeen");
const { navigationCardChosen } = require("./gamePhases/navigationCardChosen");
const { resolveLocationEffect } = require("./gamePhases/resolveLocationEffect");
const { selectFloggingCard } = require("./gamePhases/selectFloggingCard");
const {
  startCabinetFormationPhase,
} = require("./gamePhases/startCabinetFormationPhase");
const { startNavCardEffect } = require("./gamePhases/startNavCardEffect");
const {
  startNavigationDrawPhase,
} = require("./gamePhases/startNavigationDrawPhase");
const { startVoting } = require("./gamePhases/startVoting");
const { telescopeCardDecision } = require("./gamePhases/telescopeCardDecision");
const { votePreResult } = require("./gamePhases/votePreResult");
const { submitVote } = require("./gamePhases/submitVote");
const voteTieBeforeStart = require("./gamePhases/voteTieBeforeStarts");
const { voteTieBreak } = require("./gamePhases/voteTieBreaks");

const phaseTransitionMap = {
  game_start: {
    next: "cabinet_formation",
    handler: startCabinetFormationPhase,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  cabinet_formation: {
    next: "cabinet_confirmed",
    handler: confirmCabinet,
  },
  cabinet_confirmed: {
    next: "start_voting",
    handler: startVoting,
  },
  start_voting: {
    next: "start_voting",
    handler: submitVote,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  mutiny_success: {
    next: "cabinet_formation",
    handler: startCabinetFormationPhase,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  vote_pre_result: {
    next: "vote_tie_break_before_start",
    handler: votePreResult,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  vote_tie_break_before_start: {
    next: "vote_tie_break",
    handler: voteTieBeforeStart,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  vote_tie_break: {
    next: "vote_tie_break",
    handler: voteTieBreak,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  vote_tie_break_resolved: {
    next: "cabinet_formation",
    handler: startCabinetFormationPhase,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  mutiny_fail: {
    next: "navigation_cards_draw",
    handler: startNavigationDrawPhase,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  navigation_cards_draw: {
    next: "navigator_choose_card",
    handler: navigationCardChosen,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  navigator_choose_card: {
    next: "navigation_card_chosen",
    handler: navigationCardChosen,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  navigator_denial: {
    next: "cabinet_formation",
    handler: startCabinetFormationPhase,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  navigation_card_chosen: {
    next: "handle_navigator_card",
    handler: handleNavigatorCard,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  emergency_cabinet_confirmed: {
    next: "navigation_cards_draw",
    handler: startNavigationDrawPhase,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  only_captain_cabinet_confirmed: {
    next: "navigation_cards_draw",
    handler: startNavigationDrawPhase,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  cabin_search_effect: {
    next: "cabin_search",
    handler: applyNodeEffect,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  feed_the_kraken_effect: {
    next: "feed_the_kraken",
    handler: applyNodeEffect,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  off_with_tongue_effect: {
    next: "off_with_tongue",
    handler: applyNodeEffect,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  flogging_effect: {
    next: "flogging",
    handler: applyNodeEffect,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  cabin_search: {
    next: "location_effect_resolved",
    handler: resolveLocationEffect,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  feed_the_kraken: {
    next: "location_effect_resolved",
    handler: resolveLocationEffect,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  off_with_tongue: {
    next: "location_effect_resolved",
    handler: resolveLocationEffect,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  flogging: {
    next: "location_effect_resolved",
    handler: resolveLocationEffect,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  select_flogging_card: {
    next: "location_effect_resolved",
    handler: selectFloggingCard,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  location_effect_resolved: {
    next: "start_nav_card_effect",
    handler: startNavCardEffect,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  drunk: {
    next: "cabinet_formation",
    handler: startCabinetFormationPhase,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  armed: {
    next: "cabinet_formation",
    handler: startCabinetFormationPhase,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  disarmed: {
    next: "cabinet_formation",
    handler: startCabinetFormationPhase,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  mermaid: {
    next: "mermaid_choice",
    handler: confirmMermaidOrTelescopeChoice,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  mermaid_choice: {
    next: "mermaid_seen",
    handler: mermaidCardsSeen,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  mermaid_seen: {
    next: "cabinet_formation",
    handler: startCabinetFormationPhase,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  telescope: {
    next: "telescope_choice",
    handler: confirmMermaidOrTelescopeChoice,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  telescope_choice: {
    next: "telescope_seen",
    handler: telescopeCardDecision,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  telescope_seen: {
    next: "cabinet_formation",
    handler: startCabinetFormationPhase,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  cult_uprising: {
    next: "cult_ritual_choice",
    handler: cultRitualChoice,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  cult_guns_stash: {
    next: "cult_ritual_choice",
    handler: cultRitualChoice,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  cult_guns_stash_choice: {
    next: "cultRitualFinished",
    handler: cultRitualFinished,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  cult_cabin_search: {
    next: "cult_ritual_choice",
    handler: cultRitualChoice,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  cult_cabin_search_result: {
    next: "cultRitualFinished",
    handler: cultRitualFinished,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  cult_conversion: {
    next: "cult_ritual_choice",
    handler: cultRitualChoice,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  cult_conversion_choice: {
    next: "cultRitualFinished",
    handler: cultRitualFinished,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
  cult_ritual_resolved: {
    next: "cabinet_formation",
    handler: startCabinetFormationPhase,
    prepare: (gameState) => gameState.nextPhaseData || {},
  },
};

module.exports = phaseTransitionMap;
