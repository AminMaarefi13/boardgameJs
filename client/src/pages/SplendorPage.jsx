import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../network/socket";
import { useGameContext } from "../context/GameContext";
import { useAppContext } from "../context/AppContext";
import getGradientClass from "../UI/getGradientClass";
import getScoreShadowClass from "../UI/getScoreShadowClass";
import { splendorInitialState } from "../context/splendorInitialState";
import NobleTileCard from "../components/Splendor/NobleTileCard";
import DevCard from "../components/Splendor/DevCard";
import PlayerSidePanels from "../components/Splendor/PlayerSidePanels";
import ChipSelectDrawer from "../components/Splendor/ChipSelectDrawer";
import DevCardBuyDrawer from "../components/Splendor/DevCardBuyDrawer"; // اضافه شد
import Chip from "../components/Splendor/Chip";
import NobleCardBuyDrawer from "../components/Splendor/NobleCardBuyDrawer";
import GameOver from "../components/Splendor/GameOver";
import { canBuyDevCard } from "../components/Splendor/canBuyDevCard";
import { canBuyNobleCard } from "../components/Splendor/canBuyNobleCard";
import { canTakeChips } from "../components/Splendor/canTakeChips";
import ChipWithdrawDrawer from "../components/Splendor/ChipWithdrawDrawer";
import LogsDrawer from "../components/Splendor/LogsDrawer";
import LogsSidePanel from "../components/Splendor/LogsSidePanel";

export default function SplendorPage() {
  const navigate = useNavigate();
  const { gameState, setGameState } = useGameContext();
  const { connectionState, setConnectionState } = useAppContext();
  const { playerId, currentRoomId, currentGameId } = connectionState;
  const [chipDrawer, setChipDrawer] = useState({ open: false, color: null });
  const [devCardDrawer, setDevCardDrawer] = useState({
    open: false,
    devCard: null,
    reserved: false,
  });
  const [nobleCardDrawer, setNobleCardDrawer] = useState({
    open: false,
    nobleCard: null,
  });

  useEffect(() => {
    if (!gameState || gameState.type !== "splendor") {
      setGameState(splendorInitialState);
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
    finalRound,
    phaseData,
    logs,
    gameStatus,
  } = gameState;
  console.log(devCardsDeckLengths);
  const myIndex = players.findIndex((p) => p.id === playerId);
  const player = players[myIndex];
  const { prestigePoints } = player;

  const moveBuy1 = gameState.devCardsVisible[0].some((devCardd) => {
    const { hasEnoughChips, canBuyWithYellow } = canBuyDevCard(
      devCardd,
      player
    );
    if (hasEnoughChips || canBuyWithYellow) {
      return true;
    }
  });
  const moveBuy2 = gameState.devCardsVisible[1].some((devCardd) => {
    const { hasEnoughChips, canBuyWithYellow } = canBuyDevCard(
      devCardd,
      player
    );
    if (hasEnoughChips || canBuyWithYellow) {
      return true;
    }
  });
  const moveBuy3 = gameState.devCardsVisible[2].some((devCardd) => {
    const { hasEnoughChips, canBuyWithYellow } = canBuyDevCard(
      devCardd,
      player
    );
    if (hasEnoughChips || canBuyWithYellow) {
      return true;
    }
  });

  const moveBuyReserved = player.reservedCards.some((reservedCard) => {
    const { hasEnoughChips, canBuyWithYellow } = canBuyDevCard(
      reservedCard,
      player
    );
    if (hasEnoughChips || canBuyWithYellow) {
      return true;
    }
  });

  const moveReserve = player.reservedCards.length >= 3 ? false : true;
  const moveNobleBuy = gameState.nobleTilesDeck.some((nobleCard) => {
    const { canBuyNobleCardBoolean } = canBuyNobleCard(nobleCard, player);
    if (canBuyNobleCardBoolean) {
      return true;
    }
  });
  const canTakeChipsBoolean = canTakeChips(gameState.chipQuantities, player);
  const moveTakeChips = canTakeChipsBoolean;

  const canMove =
    moveBuy1 ||
    moveBuy2 ||
    moveBuy3 ||
    moveBuyReserved ||
    moveReserve ||
    moveNobleBuy ||
    moveTakeChips;

  console.log("moveBuy1", moveBuy1);
  console.log("moveBuy2", moveBuy2);
  console.log("moveBuy3", moveBuy3);
  console.log("moveBuyReserved", moveBuyReserved);
  console.log("moveReserve", moveReserve);
  console.log("moveNobleBuy", moveNobleBuy);
  console.log("moveTakeChips", moveTakeChips);
  console.log("canMove", canMove);

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

  return (
    <div className="flex-1 w-full bg-gray-900 flex flex-col items-center pt-4 pb-4 px-2">
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
          {gameState.finalRound && <div>راند آخر</div>}
          <div className="flex-1 w-full bg-gray-900 flex flex-col items-center pt-4 pb-1 px-2">
            امتیاز پرستیژ: {prestigePoints}
          </div>
          <div className="flex-1 w-full bg-gray-900 flex flex-col items-center pt-1 pb-2 px-2">
            نوبت:{" "}
            {turn === myIndex ? " من" : `${players[turn].name} (${turn + 1})`}
          </div>

          <div className="w-full max-w-2xl flex flex-row flex-wrap gap-2 justify-center mb-6">
            {nobleTilesDeck &&
              Array.from({ length: gameState.players.length + 1 }).map(
                (_, idx) => (
                  <div
                    key={idx}
                    className="w-14 h-18 sm:w-20 sm:h-24 flex items-center justify-center"
                  >
                    {nobleTilesDeck && nobleTilesDeck[idx] ? (
                      <NobleTileCard
                        key={nobleTilesDeck.length}
                        // uuu={"44"}
                        uuu={`${nobleTilesDeck.length}`}
                        cost={nobleTilesDeck[idx].cost}
                        prestigePoints={nobleTilesDeck[idx].prestigePoints}
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
                )
              )}
            {/* {nobleTilesDeck &&
              nobleTilesDeck.map((noble) => (
                <NobleTileCard
                  key={nobleTilesDeck.length}
                  cost={noble.cost}
                  prestigePoints={noble.prestigePoints}
                  player={player}
                  onClick={() =>
                    setNobleCardDrawer({ open: true, nobleCard: noble })
                  }
                  disabled={turn !== myIndex}
                />
              ))} */}
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
              Array.from({ length: 4 }).map((_, idx) => (
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
            {/* {devCardsVisible[2] &&
              devCardsVisible[2].map((dev, idx) => (
                <DevCard
                  key={idx}
                  color={dev.color}
                  cost={dev.cost}
                  prestigePoints={dev.prestigePoints}
                  level={dev.level}
                  player={player}
                  onClick={() =>
                    setDevCardDrawer({
                      open: true,
                      devCard: dev,
                      reserved: false,
                    })
                  }
                  disabled={turn !== myIndex || currentPhase === "noble_phase"}
                  className="cursor-pointer"
                />
              ))} */}
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
            {/* {devCardsVisible[1] &&
              devCardsVisible[1].map((dev, idx) => (
                <DevCard
                  key={idx}
                  color={dev.color}
                  cost={dev.cost}
                  prestigePoints={dev.prestigePoints}
                  level={dev.level}
                  player={player}
                  onClick={() =>
                    setDevCardDrawer({
                      open: true,
                      devCard: dev,
                      reserved: false,
                    })
                  }
                  disabled={turn !== myIndex || currentPhase === "noble_phase"}
                  className="cursor-pointer"
                />
              ))} */}
          </div>
          <div className="w-full max-w-2xl flex flex-row flex-wrap gap-2 justify-center mb-6">
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
            {devCardsVisible[0] &&
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-14 h-24 sm:w-20 sm:h-32 flex items-center justify-center "
                >
                  {devCardsVisible[0] && devCardsVisible[0][idx] ? (
                    <DevCard
                      key={`${devCardsVisible[0][idx].level}${idx}`}
                      color={devCardsVisible[0][idx].color}
                      cost={devCardsVisible[0][idx].cost}
                      prestigePoints={devCardsVisible[0][idx].prestigePoints}
                      level={devCardsVisible[0][idx].level}
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
            {/* {devCardsVisible[0] &&
              devCardsVisible[0].map((dev, idx) => (
                <DevCard
                  key={idx}
                  color={dev.color}
                  cost={dev.cost}
                  prestigePoints={dev.prestigePoints}
                  level={dev.level}
                  player={player}
                  onClick={() =>
                    setDevCardDrawer({
                      open: true,
                      devCard: dev,
                      reserved: false,
                    })
                  }
                  disabled={turn !== myIndex || currentPhase === "noble_phase"}
                  className="cursor-pointer"
                />
              ))} */}
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
                  disabled={
                    myIndex !== turn ||
                    currentPhase === "noble_phase" ||
                    chip.color === "yellow"
                  }
                />
              ))}
          </div>
        </>
      )}
      <ChipSelectDrawer
        key={`${chipQuantities[0].quantity}${chipQuantities[1].quantity}${chipQuantities[2].quantity}${chipQuantities[3].quantity}${chipQuantities[4].quantity}${chipQuantities[5].quantity}`}
        open={chipDrawer.open && turn === myIndex}
        onClose={() => setChipDrawer({ open: false, color: null })}
        availableChips={chipQuantities}
        initialColor={chipDrawer.color}
      />
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
    </div>
  );
}
