import { useState } from "react";
import { socket } from "../../network/socket";
import Tile from "./Tile";
import { useAppContext } from "../../context/AppContext";
import Chip from "./Chip";
import HoldToConfirmButton from "../../UI/HoldToConfirmButton";
import { useGameContext } from "../../context/GameContext";

const CHIP_COLORS = [
  "white",
  "blue",
  "red",
  "green",
  "black",
  "yellow",
  "pearl",
];

const COLOR_LABELS_FA = {
  white: "سفید",
  blue: "آبی",
  red: "قرمز",
  green: "سبز",
  black: "مشکی",
};

export default function ChipBoard({
  handleClosePanel,
  gameState,
  player,
  myIndex,
  privilegeUse,
  setPrivilegeUse,
}) {
  const { connectionState } = useAppContext();
  const { currentGameId } = connectionState;
  const [confirmed, setConfirmed] = useState(false);
  const [replenishConfirmed, setReplenishConfirmed] = useState(false);
  const [selected, setSelected] = useState([]);
  const turn = gameState.turn;
  console.log(gameState.chipQuantities);
  const chipsQuantitySum =
    ["white", "blue", "red", "green", "black", "yellow", "pearl"].reduce(
      (sum, color) =>
        sum +
        gameState.chipQuantities.find((chip) => chip.color === color).quantity,
      0
    ) || 0;
  console.log("chipsQuantitySum: ", chipsQuantitySum);
  // انتخاب چیپ
  const handleChipClick = (chip, index) => {
    console.log(chip.value);
    console.log(index);
    if (myIndex !== turn) return;
    if (!chip.value) return;
    const total = selected.length;
    console.log("total: ", total);
    const isSelectedIndex = selected.findIndex((item) => item.index === index);
    // !privilegeUse ||
    if (gameState.currentPhase === "yellow_select") {
      if (chip.value !== "yellow") return;
      // if (total === 1 && isSelectedIndex === -1) return;

      if (isSelectedIndex === -1) {
        setSelected([{ id: chip.id, index, color: chip.value }]);
      } else {
        setSelected([]);
      }
    } else if (gameState.currentPhase === "take_second_same") {
      if (chip.value !== gameState.phaseData.selectedCard.color) return;

      if (isSelectedIndex === -1) {
        setSelected([{ id: chip.id, index, color: chip.value }]);
      } else {
        setSelected([]);
      }
    } else if (privilegeUse) {
      if (chip.value === "yellow") return;
      console.log("isSelectedIndex", isSelectedIndex);
      if (total === player.privilegeTokens && isSelectedIndex === -1) return;

      if (isSelectedIndex === -1) {
        setSelected((prev) => {
          console.log("if :");
          console.log([...prev, { id: chip.id, index, color: chip.value }]);
          return [...prev, { id: chip.id, index, color: chip.value }];
        });
      } else {
        setSelected((prev) => {
          console.log("else :");
          const arr = [...prev];
          arr.splice(isSelectedIndex, 1);
          console.log(arr);
          return arr;
        });
      }
    } else {
      if (chip.value === "yellow") return;
      console.log("isSelectedIndex", isSelectedIndex);
      if (total === 3 && isSelectedIndex === -1) return;

      if (isSelectedIndex === -1) {
        setSelected((prev) => {
          console.log("if :");
          console.log([...prev, { id: chip.id, index, color: chip.value }]);
          return [...prev, { id: chip.id, index, color: chip.value }];
        });
      } else {
        setSelected((prev) => {
          console.log("else :");
          const arr = [...prev];
          arr.splice(isSelectedIndex, 1);
          console.log(arr);
          return arr;
        });
      }
    }
  };

  // اعتبارسنجی انتخاب
  const isValid = (() => {
    const total = selected.length;
    console.log("selected", selected);
    if (gameState.currentPhase === "yellow_select") {
      if (total === 1) {
        return true;
      }
    } else if (gameState.currentPhase === "take_second_same") {
      const anyChip = gameState.chipBoard.some(
        (item) => item.value === gameState.phaseData.selectedCard.color
      );
      if (anyChip) {
        if (total === 1) {
          return true;
        }
      } else {
        if (total === 0) {
          return true;
        }
      }
    } else if (privilegeUse) {
      if (total > 0 && total <= player.privilegeTokens) {
        return true;
      }
    } else {
      if (total <= 3) {
        console.log(total);
        if (total === 1) {
          return true;
        }
        selected.forEach((selectedChip) => {
          const row = Math.floor(selectedChip.index / 5);
          const column = selectedChip.index % 5;
          console.log("row", row);
          console.log("column", column);
        });
        const rowsArrSorted = selected
          .map((selectedChip) => {
            const row = Math.floor(selectedChip.index / 5);
            return row;
          })
          .sort((a, b) => a - b);
        const columnsArrSorted = selected
          .map((selectedChip) => {
            const column = selectedChip.index % 5;
            return column;
          })
          .sort((a, b) => a - b);

        console.log(rowsArrSorted);
        console.log(columnsArrSorted);

        const isSameRows = rowsArrSorted.every(
          (item) => item === rowsArrSorted[0]
        );
        const isSameColumns = columnsArrSorted.every(
          (item) => item === columnsArrSorted[0]
        );
        const isStairRows =
          total === 3
            ? rowsArrSorted[0] + 1 === rowsArrSorted[1] &&
              rowsArrSorted[1] + 1 === rowsArrSorted[2]
            : rowsArrSorted[0] + 1 === rowsArrSorted[1];

        const isStairColumns =
          total === 3
            ? columnsArrSorted[0] + 1 === columnsArrSorted[1] &&
              columnsArrSorted[1] + 1 === columnsArrSorted[2]
            : columnsArrSorted[0] + 1 === columnsArrSorted[1];
        console.log(isSameRows);
        console.log(isSameColumns);
        console.log(isStairRows);
        console.log(isStairColumns);

        if (isSameRows && isStairColumns) {
          return true;
        } else if (isSameColumns && isStairRows) {
          return true;
        } else if (isStairRows && isStairColumns) {
          return true;
        }
      }
    }

    return false;
  })();

  const handleConfirm = () => {
    console.log("انتخاب چیپ:", selected);
    // onClose?.();
    if (privilegeUse) {
      setPrivilegeUse(false);
    }
    setConfirmed(true);

    const payload = {
      data: {
        selectedList: selected,
        privilegeUse: privilegeUse ? true : false,
      },
      type: "chips_selected",
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });
    handleClosePanel?.();
  };

  const handleReplenishConfirm = () => {
    console.log("پر کردن صفحه");

    setReplenishConfirmed(true);

    const payload = {
      type: "replenish_board",
    };

    socket.emit("phase_confirm", { gameId: currentGameId, payload });
  };

  console.log(gameState);
  const chipBoard = gameState.chipBoard;
  console.log(chipBoard);
  console.log(player);
  return (
    <>
      {privilegeUse && (
        <div
          className={`
        mb-2
        `}
          style={{
            direction: "rtl",
            color: "black",
          }}
        >
          {player.privilegeTokens > 0
            ? `به اندازه ${player.privilegeTokens} عدد میتوانید چیپ بردارید: (بجز چیپ
          زرد)`
            : "کتیبه ندارید"}
        </div>
      )}
      {gameState.currentPhase === "yellow_select" &&
        gameState.turn === myIndex && (
          <div
            className={`
        mb-2
        `}
            style={{
              direction: "rtl",
              color: "black",
            }}
          >
            یک چیپ زرد را انتخاب کنید:
          </div>
        )}
      {gameState.currentPhase === "take_second_same" &&
        gameState.turn === myIndex && (
          <div
            className={`
        mb-2
        `}
            style={{
              direction: "rtl",
              color: "black",
            }}
          >
            {` یک چیپ هم رنگ با کارت خریداری شده یعنی "${[
              COLOR_LABELS_FA[gameState.phaseData.selectedCard.color],
            ]}" را انتخاب کنید:`}
          </div>
        )}

      <div
        className={`
        relative
        grid
        grid-cols-5
        grid-rows-5
        gap-1
        rounded-lg
        bg-gray-800
        p-1
        w-full
        max-w-[350px]
        sm:max-w-[420px]
        md:max-w-[480px]
        aspect-[1/1]
        `}
        style={{
          minHeight: "245px",
          minWidth: "245px",
        }}
      >
        {chipBoard.map((item, index) => (
          <div
            key={index}
            className={`
                flex items-center justify-center
                font-mono font-bold
                text-base sm:text-lg md:text-xl
                rounded
                select-none
                cursor-pointer
                transition
                duration-100
                active:scale-95
                bg-gray-700
                relative
              `}
            style={{
              aspectRatio: "1/1",
              minHeight: "28px",
              minWidth: "28px",
              maxHeight: "48px",
              maxWidth: "48px",
              backgroundColor: selected.find(
                (selectedChip) => selectedChip.index === index
              )
                ? isValid
                  ? "#1ff010"
                  : "#ff0f50"
                : `rgba(0, 0, ${(100 * (24 - item.id)) / 25}, 0.5`,
            }}
            onClick={() => {
              return handleChipClick(item, index);
            }}
          >
            {item.value && (
              <Chip
                key={index}
                index={index}
                color={item.value}
                quantity={""}
                className="w-8 h-8 z-10"
              />
            )}
            {/* {[0, 3, 7, 8, 13, 14, 15, 21, 22, 23, 4, 6, 16, 20].includes(
              item.id
            ) && (
              <>
                <span className="absolute bottom-1 left-4  pt-0.5 text-lg sm:text-xl font-bold text-blue-300 select-none drop-shadow w-5 h-5 flex items-center justify-center rotate-90">
                  ---
                </span>
              </>
            )}
            {[1, 3, 7, 9, 13, 14, 15, 21, 22, 23, 2, 8, 12, 24].includes(
              item.id
            ) && (
              <span className="absolute top-1 left-4  pt-0.5 text-lg sm:text-xl font-bold text-blue-300 select-none drop-shadow w-5 h-5 flex items-center justify-center rotate-90">
                ---
              </span>
            )}
            {[1, 5, 9, 10, 11, 17, 18, 19, 6, 20].includes(item.id) && (
              <span className="absolute bottom-4 left-1  pt-0.5 text-lg sm:text-xl font-bold text-blue-300 select-none drop-shadow w-5 h-5 flex items-center justify-center">
                ---
              </span>
            )}
            {[5, 10, 11, 17, 18, 19, 2, 4, 12, 16].includes(item.id) && (
              <span className="absolute bottom-4 right-1  pt-0.5 text-lg sm:text-xl font-bold text-blue-300 select-none drop-shadow w-5 h-5 flex items-center justify-center">
                ---
              </span>
            )} */}
          </div>
        ))}
        {/* دکمه تایید */}
      </div>
      <HoldToConfirmButton
        onConfirm={handleConfirm}
        label="تایید انتخاب"
        disabled={!isValid || confirmed}
      />

      {!(
        (gameState.currentPhase === "yellow_select" ||
          gameState.currentPhase === "take_second_same") &&
        gameState.turn === myIndex
      ) &&
        !privilegeUse && (
          <HoldToConfirmButton
            onConfirm={handleReplenishConfirm}
            label="پر کردن صفحه"
            disabled={
              turn !== myIndex || chipsQuantitySum === 0 || replenishConfirmed
            }
          />
        )}
    </>
  );
}
