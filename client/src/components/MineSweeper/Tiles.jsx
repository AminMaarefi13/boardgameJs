import { useState } from "react";
import { useGameContext } from "../../context/GameContext";
import Tile from "./Tile";

export default function Tiles() {
  const { gameState } = useGameContext();
  const { map } = gameState;

  const [loadingTileIndex, setLoadingTileIndex] = useState(null);

  return (
    <div
      className={`
        relative
        grid
        grid-cols-7
        grid-rows-8
        gap-1
        rounded-lg
        bg-gray-800
        p-1
        w-full
        max-w-[350px]
        sm:max-w-[420px]
        md:max-w-[480px]
        aspect-[7/8]
        `}
      style={{
        minHeight: "280px",
        minWidth: "245px",
      }}
    >
      {map.map((item) => (
        <Tile
          key={item.index}
          index={item.index}
          tileVal={item.val}
          position={item.position}
          loadingTileIndex={loadingTileIndex}
          setLoadingTileIndex={setLoadingTileIndex}
        />
      ))}
    </div>
  );
}

// import { useGameContext } from "../../context/GameContext";
// import Tile from "./Tile";

// export default function Tiles() {
//   const { gameState } = useGameContext();
//   const { map } = gameState;
//   return (
//     <div
//       className={`
//         relative
//         grid
//         grid-cols-7
//         grid-rows-8
//         gap-1
//         rounded-lg
//         bg-gray-800
//         p-1
//         w-full
//         max-w-[350px]
//         sm:max-w-[420px]
//         md:max-w-[480px]
//         aspect-[7/8]
//         `}
//       style={{
//         // تضمین نسبت ابعاد برای ریسپانسیو بودن
//         minHeight: "280px",
//         minWidth: "245px",
//       }}
//     >
//       {map.map((item) => (
//         <Tile
//           key={item.index}
//           index={item.index}
//           tileVal={item.val}
//           position={item.position}
//         />
//       ))}
//     </div>
//   );
// }

// // import Tile from "./Tile";
// // import "./Tile.css";

// // export default function Tiles({
// //   remaining,
// //   turn,
// //   clickUpper,
// //   players,
// //   playerId,
// // }) {
// //   function clickUp(index, tileVal, position, turn, group) {
// //     clickUpper(index, tileVal, position, turn, group);
// //   }
// //   return (
// //     <>
// //       <div className="tilesContainer">
// //         {remaining.map((item) => (
// //           <Tile
// //             key={item.index}
// //             index={item.index}
// //             tileVal={item.val}
// //             position={item.position}
// //             turn={turn}
// //             group={item.group}
// //             clickUp={clickUp}
// //             currentPlayerHome={players[0].playerId === playerId}
// //           ></Tile>
// //         ))}
// //       </div>
// //     </>
// //   );
// // }
