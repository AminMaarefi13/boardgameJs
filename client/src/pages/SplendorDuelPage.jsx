import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import { useAppContext } from "../context/AppContext";
import getGradientClass from "../UI/getGradientClass";
import getScoreShadowClass from "../UI/getScoreShadowClass";
import { splendorDuelInitialState } from "../context/splendorDuelInitialState";
import NobleTileCard from "../components/SplendorDuel/NobleTileCard";
import DevCard from "../components/SplendorDuel/DevCard";
import PlayerSidePanels from "../components/SplendorDuel/PlayerSidePanels";
import DevCardBuyDrawer from "../components/SplendorDuel/DevCardBuyDrawer"; // اضافه شد
import NobleCardBuyDrawer from "../components/SplendorDuel/NobleCardBuyDrawer";
import GameOver from "../components/SplendorDuel/GameOver";
import ChipWithdrawDrawer from "../components/SplendorDuel/ChipWithdrawDrawer";
import LogsSidePanel from "../components/SplendorDuel/LogsSidePanel";
import ChipBoardPanel from "../components/SplendorDuel/ChipBoardPanel";
import JokerSelectDrawer from "../components/SplendorDuel/JokerSelectDrawer";
import Chip from "../components/SplendorDuel/Chip";
import ChipSelectDrawer from "../components/SplendorDuel/ChipSelectDrawer";

export default function SplendorDuelPage() {
  const navigate = useNavigate();
  const { gameState, setGameState } = useGameContext();
  const { connectionState, setConnectionState } = useAppContext();
  const { playerId, currentRoomId, currentGameId } = connectionState;
  const [chipDrawer, setChipDrawer] = useState({ open: false, color: null });
  const [chipBoardPanel, setChipBoardPanel] = useState({ open: false });
  const [devCardDrawer, setDevCardDrawer] = useState({
    open: false,
    devCard: null,
    reserved: false,
  });
  const [nobleCardDrawer, setNobleCardDrawer] = useState({
    open: false,
    nobleCard: null,
  });

  const [jokerSelectDrawer, setJokerSelectDrawer] = useState({
    open: false,
    color: null,
  });

  useEffect(() => {
    if (!gameState || gameState.type !== "splendorDuel") {
      setGameState(splendorDuelInitialState);
    }
  }, [gameState, gameState.type, setGameState]);

  const {
    turn,
    currentPhase,
    players,
    devCardsDeckLengths,
    devCardsVisible,
    nobleTilesDeck,
    chipQuantities,
    chipBoard,
    phaseData,
    logs,
    gameStatus,
  } = gameState;
  console.log(devCardsDeckLengths);
  const myIndex = players.findIndex((p) => p.id === playerId);
  const player = players[myIndex];
  const { prestigePoints, crownsOwned } = player;

  useEffect(() => {
    if (!currentGameId) {
      alert("لطفاً ابتدا یک بازی را انتخاب کنید.");
      navigate("/lobby");
      return;
    }

    if (currentRoomId && playerId && currentGameId) {
      socket.emit(
        "request_game_state",
        currentGameId,
        (gameStateFromServer) => {
          if (gameStateFromServer.publicState) {
            setGameState(gameStateFromServer.publicState);
            setConnectionState((prev) => ({
              ...prev,
              currentRoomId: gameStateFromServer.publicState.roomId,
              currentGameId: gameStateFromServer.publicState.gameId,
            }));
            localStorage.setItem(
              "currentGameId",
              gameStateFromServer.publicState.gameId
            );
          } else {
            alert("❌ دریافت اطلاعات بازی ممکن نشد.");
          }
        }
      );
    }
  }, [currentRoomId, currentGameId, playerId, navigate]);
  if (
    !gameState ||
    !gameState.players ||
    gameState.players.length < 2 ||
    gameState.players.length > 4
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        لطفاً ابتدا یک بازی را از لابی انتخاب کنید.
      </div>
    );
  }

  const handleDevCardBuy = (devCard) => {
    console.log("خرید کارت توسعه:", devCard);
    setDevCardDrawer({ open: false, devCard: null, reserved: false });
  };
  // هندل خرید کارت توسعه (فعلاً فقط لاگ)
  const handleNobleCardBuy = (nobleCard) => {
    console.log("خرید کارت توسعه:", nobleCard);
    setNobleCardDrawer({ open: false, nobleCard: null });
  };
  console.log("currentPhase", currentPhase);

  return (
    <div className="flex-1 w-full bg-gray-900 flex flex-col items-center pt-2 pb-4 px-0">
      <PlayerSidePanels
        turn={turn}
        myIndex={myIndex}
        currentPhase={currentPhase}
        setDevCardDrawer={setDevCardDrawer}
      />
      <LogsSidePanel />

      {currentPhase === "game_over" && (
        <GameOver gameState={gameState} myIndex={myIndex}></GameOver>
      )}
      {currentPhase !== "game_over" && (
        <>
          <div className="flex-1 w-full bg-gray-900 flex flex-col items-center pt-0 pb-1 px-2">
            امتیاز پرستیژ: {player.prestigePoints} 👑{player.crownsOwned} 🎟
            {player.privilegeTokens}
          </div>
          {/* <div className="flex-1 w-full bg-gray-900 flex flex-col items-center pt-4 pb-1 px-2"></div> */}
          <div className="flex-1 w-full bg-gray-900 flex flex-col items-center pt-1 pb-2 px-2">
            نوبت:
            {turn === myIndex ? " من" : `${players[turn].name} (${turn + 1})`} -
            🎟
            {gameState.privileges}
          </div>

          <div className="w-full max-w-2xl flex flex-row flex-wrap gap-2 justify-center mb-6">
            {nobleTilesDeck &&
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-14 h-18 sm:w-20 sm:h-24 flex items-center justify-center"
                >
                  {nobleTilesDeck && nobleTilesDeck[idx] ? (
                    <NobleTileCard
                      key={idx}
                      prestigePoints={nobleTilesDeck[idx].prestigePoints}
                      ability={nobleTilesDeck[idx].ability}
                      player={player}
                      onClick={() =>
                        setNobleCardDrawer({
                          open: true,
                          nobleCard: nobleTilesDeck[idx],
                        })
                      }
                      disabled={
                        turn !== myIndex || currentPhase !== "noble_phase"
                      }
                    />
                  ) : (
                    <div className="w-14 h-20 sm:w-20 sm:h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                      Noble
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="w-full max-w-2xl flex flex-row flex-wrap gap-2 justify-center mb-6">
            <DevCard
              key={devCardsDeckLengths[2]}
              levelIndex={3}
              amount={devCardsDeckLengths[2]}
              player={player}
              onClick={() =>
                setDevCardDrawer({
                  open: true,
                  devCard: {
                    color: "unknown",
                    cost: "unknown",
                    prestigePoints: "unknown",
                    level: 3,
                  },
                  reserved: false,
                })
              }
              disabled={
                turn !== myIndex ||
                currentPhase === "noble_phase" ||
                devCardsDeckLengths[3] === 0
              }
            />
            {devCardsVisible[2] &&
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-14 h-24 sm:w-20 sm:h-32 flex items-center justify-center"
                >
                  {devCardsVisible[2] && devCardsVisible[2][idx] ? (
                    <DevCard
                      key={`${devCardsVisible[2][idx].level}${idx}`}
                      color={devCardsVisible[2][idx].color}
                      cost={devCardsVisible[2][idx].cost}
                      prestigePoints={devCardsVisible[2][idx].prestigePoints}
                      level={devCardsVisible[2][idx].level}
                      crowns={devCardsVisible[2][idx].crowns}
                      ability={devCardsVisible[2][idx].ability}
                      player={player}
                      onClick={() =>
                        setDevCardDrawer({
                          open: true,
                          devCard: devCardsVisible[2][idx],
                          reserved: false,
                        })
                      }
                      disabled={
                        turn !== myIndex || currentPhase === "noble_phase"
                      }
                      className="cursor-pointer"
                    />
                  ) : (
                    <div className="w-14 h-24 sm:w-20 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                      سطح 3
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="w-full max-w-2xl flex flex-row flex-wrap gap-2 justify-center mb-6">
            <DevCard
              key={devCardsDeckLengths[1]}
              levelIndex={2}
              amount={devCardsDeckLengths[1]}
              player={player}
              onClick={() =>
                setDevCardDrawer({
                  open: true,
                  devCard: {
                    color: "unknown",
                    cost: "unknown",
                    prestigePoints: "unknown",
                    level: 2,
                  },
                  reserved: false,
                })
              }
              disabled={
                turn !== myIndex ||
                currentPhase === "noble_phase" ||
                devCardsDeckLengths[1] === 0
              }
            />
            {devCardsVisible[1] &&
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-14 h-24 sm:w-20 sm:h-32 flex items-center justify-center"
                >
                  {devCardsVisible[1] && devCardsVisible[1][idx] ? (
                    <DevCard
                      key={`${devCardsVisible[1][idx].level}${idx}`}
                      color={devCardsVisible[1][idx].color}
                      cost={devCardsVisible[1][idx].cost}
                      prestigePoints={devCardsVisible[1][idx].prestigePoints}
                      level={devCardsVisible[1][idx].level}
                      crowns={devCardsVisible[1][idx].crowns}
                      ability={devCardsVisible[1][idx].ability}
                      bonus={devCardsVisible[1][idx].bonus}
                      player={player}
                      onClick={() =>
                        setDevCardDrawer({
                          open: true,
                          devCard: devCardsVisible[1][idx],
                          reserved: false,
                        })
                      }
                      disabled={
                        turn !== myIndex || currentPhase === "noble_phase"
                      }
                      className="cursor-pointer"
                    />
                  ) : (
                    <div className="w-14 h-24 sm:w-20 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                      سطح 2
                    </div>
                  )}
                </div>
              ))}
          </div>
          <div className="w-full max-w-2xl flex flex-row flex-wrap gap-1 justify-center mb-6">
            <DevCard
              key={devCardsDeckLengths[0]}
              levelIndex={1}
              amount={devCardsDeckLengths[0]}
              player={player}
              onClick={() =>
                setDevCardDrawer({
                  open: true,
                  devCard: {
                    color: "unknown",
                    cost: "unknown",
                    prestigePoints: "unknown",
                    level: 1,
                  },
                  reserved: false,
                })
              }
              disabled={
                turn !== myIndex ||
                currentPhase === "noble_phase" ||
                devCardsDeckLengths[0] === 0
              }
            />
            <div className="w-70 flex gap-1">
              {devCardsVisible[0] &&
                Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-14 h-24 sm:w-20 sm:h-32 flex items-center justify-center"
                  >
                    {devCardsVisible[0] && devCardsVisible[0][idx] ? (
                      <DevCard
                        key={`${devCardsVisible[0][idx].level}${idx}`}
                        color={devCardsVisible[0][idx].color}
                        cost={devCardsVisible[0][idx].cost}
                        prestigePoints={devCardsVisible[0][idx].prestigePoints}
                        level={devCardsVisible[0][idx].level}
                        crowns={devCardsVisible[0][idx].crowns}
                        ability={devCardsVisible[0][idx].ability}
                        bonus={devCardsVisible[0][idx].bonus}
                        player={player}
                        onClick={() =>
                          setDevCardDrawer({
                            open: true,
                            devCard: devCardsVisible[0][idx],
                            reserved: false,
                          })
                        }
                        disabled={
                          turn !== myIndex || currentPhase === "noble_phase"
                        }
                        className="cursor-pointer"
                      />
                    ) : (
                      <div className="w-14 h-24 sm:w-20 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        سطح 1
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <div className="w-full max-w-2xl flex flex-row-reverse flex-wrap gap-2 justify-center mb-6">
            <ChipBoardPanel
              myIndex={myIndex}
              player={player}
              open={chipBoardPanel.open && turn === myIndex}
              onClose={() => setChipBoardPanel({ open: false })}
            />
          </div>
          <div className="w-full max-w-2xl flex flex-row-reverse flex-wrap gap-2 justify-center mb-6">
            {chipQuantities &&
              chipQuantities.map((chip, idx) => (
                <Chip
                  key={idx}
                  color={chip.color}
                  quantity={chip.quantity}
                  onClick={
                    myIndex === turn && chip.color !== "yellow"
                      ? () => setChipDrawer({ open: true, color: chip.color })
                      : undefined
                  }
                  disabled={true}
                />
              ))}
          </div>
        </>
      )}

      <DevCardBuyDrawer
        key={devCardDrawer?.devCard?.index}
        open={devCardDrawer.open}
        onClose={() =>
          setDevCardDrawer({ open: false, devCard: null, reserved: false })
        }
        devCard={devCardDrawer?.devCard}
        reserved={devCardDrawer?.reserved}
        onConfirm={handleDevCardBuy}
        player={player}
      />
      <NobleCardBuyDrawer
        key={nobleTilesDeck.length}
        open={nobleCardDrawer.open}
        onClose={() => setNobleCardDrawer({ open: false, nobleCard: null })}
        nobleCard={nobleCardDrawer?.nobleCard}
        onConfirm={handleNobleCardBuy}
        player={player}
      />
      {currentPhase === "chips_withdraw" && (
        <ChipWithdrawDrawer
          key={`${chipQuantities[0].quantity}${chipQuantities[1].quantity}${chipQuantities[2].quantity}${chipQuantities[3].quantity}${chipQuantities[4].quantity}${chipQuantities[5].quantity}`}
          open={currentPhase === "chips_withdraw" && turn === myIndex}
          onClose={() => setChipDrawer({ open: false, color: null })}
          player={player}
          initialColor={chipDrawer.color}
        />
      )}
      {currentPhase === "joker_select" && (
        <JokerSelectDrawer
          // key={}
          open={currentPhase === "joker_select" && turn === myIndex}
          onClose={() => setJokerSelectDrawer({ open: false, color: null })}
          player={player}
        />
      )}

      {currentPhase === "steal" && (
        <ChipSelectDrawer
          // key={`${chipQuantities[0].quantity}${chipQuantities[1].quantity}${chipQuantities[2].quantity}${chipQuantities[3].quantity}${chipQuantities[4].quantity}${chipQuantities[5].quantity}`}
          gameState={gameState}
          myIndex={myIndex}
          open={currentPhase === "steal" && turn === myIndex}
          onClose={() => setChipDrawer({ open: false, color: null })}
        />
      )}
    </div>
  );
}
