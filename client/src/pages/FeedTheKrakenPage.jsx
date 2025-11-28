import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../network/socket";
import ProgressBar from "../UI/ProgressBar";
import EnergyBar from "../components/Energy/EnergyBar";
import RewardedAdButton from "../components/Energy/RewardedAdButton";
import { feedTheKrakenInitialState } from "../context/feedTheKrakenInitialState";
import { useGameContext } from "../context/GameContext";
import { useAppContext } from "../context/AppContext";
import PlayersAndSecretInfoPanel from "../components/FeedTheKraken/PlayersAndSecretInfoPanel";
import GameLogPanel from "../components/FeedTheKraken/GameLogPanel";
import PhasePanelsSwitcher from "../components/FeedTheKraken/PhasePanelsSwitcher";

export default function FeedTheKrakenPage() {
  const navigate = useNavigate();
  const { gameState, setGameState } = useGameContext();
  const {
    userState,
    setUserState,
    connectionState,
    setConnectionState,
    energy,
    subscription,
  } = useAppContext();

  useEffect(() => {
    if (!gameState || gameState.type !== "feedTheKraken") {
      setGameState(feedTheKrakenInitialState);
    }
  }, [gameState, gameState.type, setGameState]);

  const {
    journeyType,
    mapPosition,
    currentPhase,
    players,
    captainId,
    firstOfficerId,
    navigatorId,
    logs,
    currentVoteSessionId,
    phaseData,
  } = gameState;

  const { role, knownRoles, characterCard, privatePhaseData } = userState;
  const { playerId, currentRoomId, currentGameId } = connectionState;
  // ⛵ جلوگیری از ورود بدون انتخاب بازی
  useEffect(() => {
    if (!currentGameId) {
      alert("لطفاً ابتدا یک بازی را انتخاب کنید.");
      navigate("/lobby");
      return;
    }

    if (currentRoomId && playerId && currentGameId) {
      // socket.emit("join_game", {
      //   gameId: currentGameId,
      //   roomId: currentRoomId,
      //   playerId,
      // });
      console.log("درخواست وضعیت بازی برای:", currentGameId);
      socket.emit(
        "request_game_state",
        currentGameId,
        (gameStateFromServer) => {
          console.log("📥 وضعیت بازی دریافتی:", gameStateFromServer);
          console.log(gameStateFromServer.publicState);
          console.log(gameStateFromServer.privateState);
          if (gameStateFromServer) {
            setGameState(gameStateFromServer.publicState);
            setUserState((prev) => ({
              ...prev,
              ...gameStateFromServer.privateState,
            }));
            setConnectionState((prev) => ({
              ...prev,
              currentRoomId: gameStateFromServer.publicState.roomId,
              currentGameId: gameStateFromServer.publicState.gameId,
            }));
            localStorage.setItem(
              "currentGameId",
              gameStateFromServer.publicState.gameId
            );
            // navigate("/game");
          } else {
            alert("❌ دریافت اطلاعات بازی ممکن نشد.");
          }
        }
      );
    }
  }, [currentRoomId, currentGameId, playerId, navigate]);
  // نمایش مناسب هنگام عدم دریافت اطلاعات یا ورود زودهنگام
  if (!currentGameId || !players || players.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        لطفاً ابتدا یک بازی را از لابی انتخاب کنید.
      </div>
    );
  }
  // console.log(phaseData);
  return (
    <div>
      <div
        className="p-2 sm:p-4 md:p-6 bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen text-gray-800 w-full"
        dir="rtl"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-right font-vazir flex flex-row-reverse items-center gap-2">
          <span>🧭</span>
          <span>سفر در حال جریان: {journeyType}</span>
        </h1>
        <div className="bg-white shadow rounded-2xl p-4 mb-6 w-full border border-blue-100 text-right font-vazir">
          <h2 className="text-lg sm:text-xl font-extrabold mb-2 text-blue-700 flex  items-center gap-2">
            <span>🚢</span>
            <span>وضعیت کشتی</span>
          </h2>
          <p className="mb-1 text-gray-700">
            📍 موقعیت نقشه: <span className="font-bold">{mapPosition}</span>
          </p>
          <p className="mb-1 text-gray-700">
            🧩 فاز فعلی: <span className="font-bold">{currentPhase}</span>
          </p>
        </div>
        <EnergyBar />
        {!subscription && energy < 1 && <RewardedAdButton />}

        {phaseData?.total &&
          phaseData?.current &&
          typeof phaseData.current === "number" &&
          typeof phaseData.total === "number" &&
          phaseData.total > 0 && (
            <ProgressBar current={phaseData.current} total={phaseData.total} />
          )}

        <PhasePanelsSwitcher
          currentPhase={currentPhase}
          playerId={playerId}
          captainId={captainId}
          firstOfficerId={firstOfficerId}
          navigatorId={navigatorId}
          privatePhaseData={privatePhaseData}
          phaseData={phaseData}
          currentVoteSessionId={currentVoteSessionId}
          gameState={gameState}
        />
        <PlayersAndSecretInfoPanel
          players={players}
          playerId={playerId}
          captainId={captainId}
          firstOfficerId={firstOfficerId}
          navigatorId={navigatorId}
          knownRoles={knownRoles}
          role={role}
          characterCard={characterCard}
        />
        <GameLogPanel logs={logs} />
      </div>
    </div>
  );
}
