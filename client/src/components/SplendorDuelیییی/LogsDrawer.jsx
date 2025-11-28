import React, { useState } from "react";
import Chip from "./Chip";
import DevCard from "./DevCard";
import NobleTileCard from "./NobleTileCard";

const COLORS = ["white", "blue", "green", "red", "black", "yellow"];
const COLOR_LABELS_FA = {
  white: "سفید",
  blue: "آبی",
  red: "قرمز",
  green: "سبز",
  black: "مشکی",
  points: "امتیاز",
};

function LogTurn({ player }) {
  console.log(player);
  return (
    <>
      <div
        style={{
          direction: "rtl",
        }}
        className="text-xs text-gray-500 flex flex-col gap-1 items-center"
      >
        <div className=" font-bold text-sm text-blue-500">{player.name}</div>
        <div className="flex flex-row-reverse gap-2 items-center font-bold text-sm text-black">
          یک دور دیگه بازی می کنه
        </div>
      </div>

      <div className=" font-bold text-sm text-gray-800">
        --------------------
      </div>
    </>
  );
}

function LogStealSelected({ player, stealSelected }) {
  console.log(player);
  console.log(stealSelected);
  return (
    <>
      <div
        style={{
          direction: "rtl",
        }}
        className="text-xs text-gray-500 flex flex-col gap-1 items-center"
      >
        <Chip
          key={stealSelected}
          color={stealSelected}
          quantity={""}
          className="w-8 h-8"
        />
        <div className=" font-bold text-sm text-blue-500">{player.name}</div>
        <div className="flex flex-row-reverse gap-2 items-center font-bold text-sm text-black">
          یک عدد چیپ از حریف برداشت
        </div>
      </div>

      <div className=" font-bold text-sm text-gray-800">
        --------------------
      </div>
    </>
  );
}

function LogTakeSecondSame({ player, selectedCard }) {
  console.log(player);
  console.log(selectedCard);
  return (
    <>
      <div
        style={{
          direction: "rtl",
        }}
        className="text-xs text-gray-500 flex flex-col gap-1 items-center"
      >
        <div className=" font-bold text-sm text-blue-500">{player.name}</div>
        <div className="flex flex-row-reverse gap-2 items-center font-bold text-sm text-black">
          در صورت وجود چیپ به رنگ {` ${COLOR_LABELS_FA[selectedCard.color]} `}
          روی صفحه، می تواند یک عدد بردارد
        </div>
      </div>

      <div className=" font-bold text-sm text-gray-800">
        --------------------
      </div>
    </>
  );
}

function LogJoker({ player, selected, selectedJokerCard }) {
  console.log(player);
  console.log(selected);
  console.log(selectedJokerCard);
  return (
    <>
      <div
        style={{
          direction: "rtl",
        }}
        className="text-xs text-gray-500 flex flex-col gap-1 items-center"
      >
        <div className=" font-bold text-sm text-blue-500">{player.name}</div>
        <div className="flex flex-row-reverse gap-2 items-center font-bold text-sm text-black">
          رنگ {COLOR_LABELS_FA[selected]} را برای کارت جوکر خودش انتخاب کرد
        </div>
      </div>

      <div className=" font-bold text-sm text-gray-800">
        --------------------
      </div>
    </>
  );
}

function LogPrivilege({ player, takenFrom }) {
  console.log(player);
  console.log(takenFrom);
  return (
    <>
      <div
        style={{
          direction: "rtl",
        }}
        className="text-xs text-gray-500 flex flex-col gap-1 items-center"
      >
        <div className=" font-bold text-sm text-blue-500">{player.name}</div>
        <div className="flex flex-row-reverse gap-2 items-center font-bold text-sm text-black">
          {takenFrom === "noPrivileges" ? "" : " یک عدد کتیبه از"}
        </div>
        <div className="flex flex-row-reverse gap-2 items-center font-bold text-sm text-black">
          {`${
            takenFrom === "board"
              ? "صفحه برداشت"
              : takenFrom === "noPrivileges"
              ? "کتیبه ای موجود نبود که بردارد"
              : `رقیبش گرفت`
          }`}
        </div>
      </div>

      <div className=" font-bold text-sm text-gray-800">
        --------------------
      </div>
    </>
  );
}

function LogReplenishBoard({ player }) {
  console.log(player);

  return (
    <>
      <div
        style={{
          direction: "rtl",
        }}
        className="text-xs text-gray-500 flex flex-col gap-1 items-center"
      >
        <div className=" font-bold text-sm text-blue-500">{player.name}</div>
        <div className="flex flex-row-reverse gap-2 items-center font-bold text-sm text-black">
          چیپ ها رو روی صفحه چید
        </div>
      </div>

      <div className=" font-bold text-sm text-gray-800">
        --------------------
      </div>
    </>
  );
}

function LogChipWithdraw({ player, chipsWithdrew }) {
  console.log(player);
  console.log(chipsWithdrew);
  const chipsSum = chipsWithdrew.reduce(
    (sum, chip) => sum + chip.quantity || 0,
    0
  );

  console.log("chipsSum: ", chipsSum);
  return (
    <>
      <div
        style={{
          direction: "rtl",
        }}
        className="text-xs text-gray-500 flex flex-col gap-1 items-center"
      >
        <div className=" font-bold text-sm text-blue-500">{player.name}</div>
        <div className=" font-bold text-sm text-gray-800">
          {chipsSum} عدد چیپ را پس داد
        </div>
      </div>
      <div className="flex flex-row-reverse gap-2 items-center">
        {chipsWithdrew.map((chip) => {
          {
            console.log(chip);
            return (
              chip.quantity > 0 && (
                <Chip
                  key={chip.color}
                  color={chip.color}
                  quantity={chip.quantity || 0}
                  className="mb-1 mt-1 w-8 h-8 sm:w-10 sm:h-10 text-base opacity-70"
                />
              )
            );
          }
        })}
      </div>
      <div className=" font-bold text-sm text-gray-800">
        --------------------
      </div>
    </>
  );
}

function LogDevCardReserved({ player, reservedCard }) {
  console.log(player);
  console.log(reservedCard);

  return (
    <>
      <div
        style={{
          direction: "rtl",
        }}
        className="text-xs text-gray-500 flex flex-col gap-1 items-center"
      >
        <div className=" font-bold text-sm text-blue-500">{player.name}</div>
        <div className=" font-bold text-sm text-gray-800">
          این کارت را رزرو کرد
        </div>
        <div className="flex flex-row-reverse gap-2 mb-0">
          <DevCard
            color={reservedCard.color}
            cost={reservedCard.cost}
            prestigePoints={reservedCard.prestigePoints}
            level={reservedCard.level}
            className="w-20 h-32"
          />
        </div>
      </div>
      <div className=" font-bold text-sm text-gray-800">
        --------------------
      </div>
    </>
  );
}

function LogNobleCardBuy({ player, selectedNobleCard }) {
  console.log(player);
  console.log(selectedNobleCard);

  return (
    <>
      <div
        style={{
          direction: "rtl",
        }}
        className="text-xs text-gray-500 flex flex-col gap-1 items-center"
      >
        <div className=" font-bold text-sm text-blue-500">{player.name}</div>
        <div className=" font-bold text-sm text-gray-800">
          این کارت رویال را خرید
        </div>
        <div className="flex flex-row-reverse gap-2 mb-0">
          <NobleTileCard
            prestigePoints={selectedNobleCard.prestigePoints}
            ability={selectedNobleCard?.ability}
            player={player}
            log={true}
            // disabled={false}
          />
        </div>
      </div>
      <div className=" font-bold text-sm text-gray-800">
        --------------------
      </div>
    </>
  );
}

function LogDevCardBuy({ player, selectedCard }) {
  console.log(player);
  console.log(selectedCard);

  return (
    <>
      <div
        style={{
          direction: "rtl",
        }}
        className="text-xs text-gray-500 flex flex-col gap-1 items-center"
      >
        <div className=" font-bold text-sm text-blue-500">{player.name}</div>
        <div className=" font-bold text-sm text-gray-800">این کارت را خرید</div>
        <div className="flex flex-row-reverse gap-2 mb-0">
          <DevCard
            color={selectedCard.color}
            cost={selectedCard.cost}
            ability={selectedCard?.ability}
            crowns={selectedCard?.crowns}
            bonus={selectedCard?.bonus}
            prestigePoints={selectedCard.prestigePoints}
            level={selectedCard.level}
            className="w-20 h-32"
          />
        </div>
      </div>
      <div className=" font-bold text-sm text-gray-800">
        --------------------
      </div>
    </>
  );
}

function LogChipSelected({ player, selectedList }) {
  console.log(player);
  console.log(selectedList);
  const chipsSum = selectedList.length;

  console.log("chipsSum: ", chipsSum);

  return (
    <>
      <div
        style={{
          direction: "rtl",
        }}
        className="text-xs text-gray-500 flex flex-col gap-1 items-center"
      >
        <div className=" font-bold text-sm text-blue-500">{player.name}</div>
        <div className=" font-bold text-sm text-gray-800">
          {chipsSum} عدد چیپ برداشت
        </div>
      </div>
      <div className="flex flex-row-reverse gap-2 items-center">
        {selectedList.map((chip, index) => {
          {
            console.log(chip);
            return (
              <Chip
                key={index}
                color={chip.color}
                quantity={""}
                className="mb-1 mt-1 w-8 h-8 sm:w-10 sm:h-10 text-base opacity-70"
              />
            );
          }
        })}
      </div>
      <div className=" font-bold text-sm text-gray-800">
        --------------------
      </div>
    </>
  );
}

export default function LogsDrawer({ logs }) {
  return (
    <div
      style={{ overflowY: "scroll" }}
      className="w-full h-80 flex flex-col-reverse items-center font-vazir"
    >
      {logs.map((log, index) => {
        if (log.type === "chip_selected") {
          return (
            <LogChipSelected
              key={index}
              player={log.player}
              selectedList={log.selectedList}
            />
          );
        } else if (log.type === "dev_card_buy") {
          return (
            <LogDevCardBuy
              key={index}
              player={log.player}
              selectedCard={log.selectedCard}
            />
          );
        } else if (log.type === "noble_card_buy") {
          return (
            <LogNobleCardBuy
              key={index}
              player={log.player}
              selectedNobleCard={log.selectedNobleCard}
            />
          );
        } else if (log.type === "dev_card_reserved") {
          return (
            <LogDevCardReserved
              key={index}
              player={log.player}
              reservedCard={log.reservedCard}
            />
          );
        } else if (log.type === "chip_withdraw") {
          return (
            <LogChipWithdraw
              key={index}
              player={log.player}
              chipsWithdrew={log.chipsWithdrew}
            />
          );
        } else if (log.type === "replenish_board") {
          return <LogReplenishBoard key={index} player={log.player} />;
        } else if (log.type === "privilege_ability") {
          return (
            <LogPrivilege
              key={index}
              player={log.player}
              takenFrom={log.takenFrom}
            />
          );
        } else if (log.type === "joker_select") {
          return (
            <LogJoker
              key={index}
              player={log.player}
              selected={log.selected}
              selectedJokerCard={log.selectedJokerCard}
            />
          );
        } else if (log.type === "take_second_same") {
          return (
            <LogTakeSecondSame
              key={index}
              player={log.player}
              selectedCard={log.selectedCard}
            />
          );
        } else if (log.type === "steal_selected") {
          return (
            <LogStealSelected
              key={index}
              player={log.player}
              stealSelected={log.stealSelected}
            />
          );
        } else if (log.type === "turn") {
          return <LogTurn key={index} player={log.player} />;
        }

        // gameState.logs.push({  type: "take_second_same", player, selectedCard });
      })}
    </div>
  );
}
