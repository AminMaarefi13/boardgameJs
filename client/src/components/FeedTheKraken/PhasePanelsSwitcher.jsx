import React from "react";
import GameStartPanel from "../../FeedTheKrakenPanels/MessagePanels/GameStartPanel";
import CabinetFormationPanel from "../../FeedTheKrakenPanels/MessagePanels/CabinetFormationPanel";
import CabinetSelectionPanel from "../../FeedTheKrakenPanels/CabinetSelectionPanel";
import CabinetConfirmedPanel from "../../FeedTheKrakenPanels/MessagePanels/CabinetConfirmedPanel";
import GunVotingPanel from "../../FeedTheKrakenPanels/GunVotingPanel";
import VotePreResultPanel from "../../FeedTheKrakenPanels/MessagePanels/VotePreResultPanel";
import { MutinySuccessPanel } from "../../FeedTheKrakenPanels/MessagePanels/MutinySuccessPanel";
import { MutinyFailPanel } from "../../FeedTheKrakenPanels/MessagePanels/MutinyFailPanel";
import VoteTieBreakBeforeStartPanel from "../../FeedTheKrakenPanels/MessagePanels/VoteTieBreakBeforeStartPanel";
import VoteTieBreakPanel from "../../FeedTheKrakenPanels/VoteTieBreakPanel";
import { NavigationCardsDrawPanel } from "../../FeedTheKrakenPanels/MessagePanels/NavigationCardsDrawPanel";
import NavigationCardChoicePanel from "../../FeedTheKrakenPanels/NavigationCardChoicePanel";
import { NavigatorChooseCardPanel } from "../../FeedTheKrakenPanels/MessagePanels/NavigatorChooseCardPanel";
import NavigatorNoPlayerPanel from "../../FeedTheKrakenPanels/MessagePanels/NavigatorNoPlayerPanel";
import NavigationCardChosenPanel from "../../FeedTheKrakenPanels/MessagePanels/NavigationCardChosenPanel";
import NavigatorDenialPanel from "../../FeedTheKrakenPanels/MessagePanels/NavigatorDenialPanel";
import LocationEffectResolvedNoLocationEffectPanel from "../../FeedTheKrakenPanels/MessagePanels/LocationEffectResolvedNoLocationEffectPanel";
import LocationEffectResolvedPanel from "../../FeedTheKrakenPanels/MessagePanels/LocationEffectResolvedPanel";
import EffectsStartPanel from "../../FeedTheKrakenPanels/MessagePanels/EffectsStartPanel";
import EffectCaptainChoosingPanel from "../../FeedTheKrakenPanels/MessagePanels/EffectCaptainChoosingPanel";
import LocationEffectPanel from "../../FeedTheKrakenPanels/LocationEffectPanel";
import CabinSearchResultCaptainPanel from "../../FeedTheKrakenPanels/PrivatePanels/CabinSearchResultCaptainPanel";
import FloggingResultPanel from "../../FeedTheKrakenPanels/MessagePanels/FloggingResultPanel";
import FloggingChoicePanel from "../../FeedTheKrakenPanels/FloggingChoicePanel";
import FloggingWaitingPanel from "../../FeedTheKrakenPanels/MessagePanels/FloggingWaitingPanel";
import NoEffectInfoPanel from "../../FeedTheKrakenPanels/MessagePanels/NoEffectInfoPanel";
import DrunkEffectPanel from "../../FeedTheKrakenPanels/MessagePanels/DrunkEffectPanel";
import ArmedEffectPanel from "../../FeedTheKrakenPanels/MessagePanels/ArmedEffectPanel";
import DisarmedEffectPanel from "../../FeedTheKrakenPanels/MessagePanels/DisarmedEffectPanel";
import { MermaidEffectPanel } from "../../FeedTheKrakenPanels/MessagePanels/MermaidEffectPanel";
import { TelescopeEffectPanel } from "../../FeedTheKrakenPanels/MessagePanels/TelescopeEffectPanel";
import CultUprisingEffectPanel from "../../FeedTheKrakenPanels/MessagePanels/CultUprisingEffectPanel";
import MermaidOrTelescopePanel from "../../FeedTheKrakenPanels/MermaidOrTelescopePanel";
import TelescopeChoicePanel from "../../FeedTheKrakenPanels/MessagePanels/TelescopeChoicePanel";
import MermaidChoicePanel from "../../FeedTheKrakenPanels/MessagePanels/MermaidChoicePanel";
import TelescopeCardDecisionPanel from "../../FeedTheKrakenPanels/TelescopeCardDecisionPanel";
import MermaidCardsViewPanel from "../../FeedTheKrakenPanels/MermaidCardsViewPanel";
import TelescopeSeenPanel from "../../FeedTheKrakenPanels/MessagePanels/TelescopeSeenPanel";
import MermaidSeenPanel from "../../FeedTheKrakenPanels/MessagePanels/MermaidSeenPanel";
import CultRitualChoicePanel from "../../FeedTheKrakenPanels/CultRitualChoicePanel";
import CultGunsStashChoicePanel from "../../FeedTheKrakenPanels/MessagePanels/CultGunsStashChoicePanel";
import CultGunsDistributionPanel from "../../FeedTheKrakenPanels/CultGunDirstibutionPanel";
import CultCabinSearchPanel from "../../FeedTheKrakenPanels/MessagePanels/CultCabinSearchPanel";
import CultCabinSearchResultPanel from "../../FeedTheKrakenPanels/CultCabinSearchResultPanel";
import CultConversionChoicePanel from "../../FeedTheKrakenPanels/MessagePanels/CultConversionChoicePanel";
import CultConversionPanel from "../../FeedTheKrakenPanels/CultConversionPanel";
import CultRitualResolvedPanel from "../../FeedTheKrakenPanels/MessagePanels/CultRitualResolvedPanel";
import GameOverPanel from "../../FeedTheKrakenPanels/MessagePanels/GameOverPanel";

export default function PhasePanelsSwitcher({
  currentPhase,
  playerId,
  captainId,
  firstOfficerId,
  navigatorId,
  privatePhaseData,
  phaseData,
  currentVoteSessionId,
  gameState,
  ...props
}) {
  console.log(privatePhaseData);
  console.log(currentPhase === "cabinet_formation");
  console.log(captainId === playerId);
  console.log(privatePhaseData?.selectablePlayers);
  console.log(
    currentPhase === "cabinet_formation" &&
      privatePhaseData?.selectablePlayers &&
      captainId === playerId
  );
  // توجه: props را برای ارسال سایر داده‌های مورد نیاز به پنل‌ها نگه داشته‌ایم
  switch (true) {
    case currentPhase === "game_start":
      return <GameStartPanel />;
    case currentPhase === "cabinet_formation":
      return (
        <>
          <CabinetFormationPanel />
          <CabinetSelectionPanel />
        </>
      );
    case [
      "cabinet_confirmed",
      "emergency_cabinet_confirmed",
      "only_captain_cabinet_confirmed",
    ].includes(currentPhase):
      return <CabinetConfirmedPanel />;
    case currentPhase === "start_voting":
      return <GunVotingPanel key={currentVoteSessionId} />;
    case currentPhase === "vote_pre_result":
      return <VotePreResultPanel />;
    case currentPhase === "mutiny_success":
      return <MutinySuccessPanel />;
    case currentPhase === "mutiny_fail":
      return <MutinyFailPanel />;
    case currentPhase === "vote_tie_break_before_start":
      return (
        <VoteTieBreakBeforeStartPanel
          topCandidates={phaseData?.topCandidates}
          playerId={playerId}
        />
      );
    case currentPhase === "vote_tie_break" ||
      currentPhase === "vote_tie_break_resolved":
      return <VoteTieBreakPanel />;
    case currentPhase === "navigation_cards_draw" &&
      privatePhaseData?.cards &&
      (playerId === captainId || playerId === firstOfficerId):
      return <NavigationCardChoicePanel />;
    case currentPhase === "navigation_cards_draw":
      return <NavigationCardsDrawPanel />;
    case currentPhase === "navigator_choose_card" &&
      !gameState.nextPhaseDataphaseData?.noNavigator &&
      privatePhaseData?.cards &&
      playerId === navigatorId:
      return <NavigationCardChoicePanel />;
    case currentPhase === "navigator_choose_card" &&
      !gameState.nextPhaseDataphaseData?.noNavigator:
      return <NavigatorChooseCardPanel />;
    case currentPhase === "navigator_choose_card" &&
      gameState.nextPhaseData?.noNavigator:
      return <NavigatorNoPlayerPanel />;
    case currentPhase === "navigation_card_chosen":
      return <NavigationCardChosenPanel />;
    case currentPhase === "navigator_denial":
      return <NavigatorDenialPanel />;
    case currentPhase === "location_effect_resolved":
      return (
        <>
          <LocationEffectResolvedNoLocationEffectPanel />
          <LocationEffectResolvedPanel />
          <CabinSearchResultCaptainPanel />
          <FloggingResultPanel />
        </>
      );
    case currentPhase === "cabin_search_effect" ||
      currentPhase === "feed_the_kraken_effect" ||
      currentPhase === "off_with_tongue_effect" ||
      currentPhase === "flogging_effect":
      return <EffectsStartPanel />;
    case currentPhase === "cabin_search" ||
      currentPhase === "feed_the_kraken" ||
      currentPhase === "off_with_tongue" ||
      currentPhase === "flogging":
      return (
        <>
          <LocationEffectPanel className="mb-4 sm:mb-6 p-2 sm:p-4 border border-yellow-500 rounded-md bg-yellow-50 shadow" />
          <EffectCaptainChoosingPanel />
        </>
      );
    case currentPhase === "select_flogging_card":
      return (
        <>
          <FloggingChoicePanel />
          <FloggingWaitingPanel />
        </>
      );

    case currentPhase === "drunk":
      return (
        <>
          <DrunkEffectPanel />
          <NoEffectInfoPanel />
        </>
      );
    case currentPhase === "armed":
      return (
        <>
          <ArmedEffectPanel />
          <NoEffectInfoPanel />
        </>
      );
    case currentPhase === "disarmed":
      return (
        <>
          <DisarmedEffectPanel />
          <NoEffectInfoPanel />
        </>
      );
    case currentPhase === "mermaid":
      return (
        <>
          <MermaidEffectPanel />
          <MermaidChoicePanel />
          <MermaidOrTelescopePanel />
          <NoEffectInfoPanel />
        </>
      );
    case currentPhase === "telescope":
      return (
        <>
          <TelescopeEffectPanel />
          <TelescopeChoicePanel />
          <MermaidOrTelescopePanel />
          <NoEffectInfoPanel />
        </>
      );
    case currentPhase === "cult_uprising":
      return (
        <>
          <CultUprisingEffectPanel />
          <CultRitualChoicePanel />
          <NoEffectInfoPanel />
        </>
      );
    // case ["telescope", "mermaid"].includes(currentPhase) &&
    //   playerId === captainId:
    //   return <MermaidOrTelescopePanel />;
    case currentPhase === "telescope_choice":
      return (
        <>
          <TelescopeChoicePanel />
          <TelescopeCardDecisionPanel />
        </>
      );
    case currentPhase === "mermaid_choice":
      return (
        <>
          <MermaidChoicePanel />
          <MermaidCardsViewPanel />
        </>
      );
    // case currentPhase === "telescope_choice" &&
    //   privatePhaseData.targetPlayerId === playerId:
    //   return <TelescopeCardDecisionPanel />;
    // case currentPhase === "mermaid_choice" &&
    //   privatePhaseData.targetPlayerId === playerId:
    //   return <MermaidCardsViewPanel />;
    case currentPhase === "telescope_seen":
      return <TelescopeSeenPanel />;
    case currentPhase === "mermaid_seen":
      return <MermaidSeenPanel />;
    // case currentPhase === "cult_uprising" && playerId === captainId:
    //   return <CultRitualChoicePanel />;
    case currentPhase === "cult_guns_stash_choice":
      return (
        <>
          <CultGunsStashChoicePanel />
          <CultGunsDistributionPanel />
        </>
      );
    // case currentPhase === "cult_guns_stash_choice" &&
    //   playerId === privatePhaseData.cultLeaderId:
    //   return <CultGunsDistributionPanel />;
    case currentPhase === "cult_cabin_search_result":
      return (
        <>
          <CultCabinSearchPanel />
          <CultCabinSearchResultPanel />
        </>
      );
    // case currentPhase === "cult_cabin_search_result" &&
    //   playerId === privatePhaseData.cultLeaderId:
    //   return <CultCabinSearchResultPanel />;
    case currentPhase === "cult_conversion_choice":
      return (
        <>
          <CultConversionChoicePanel />
          <CultConversionPanel />
        </>
      );
    // case currentPhase === "cult_conversion_choice" &&
    //   playerId === privatePhaseData.cultLeaderId:
    //   return <CultConversionPanel />;
    case currentPhase === "cult_ritual_resolved":
      return <CultRitualResolvedPanel />;
    case currentPhase === "game_over":
      return <GameOverPanel />;
    default:
      return null;
  }
}
