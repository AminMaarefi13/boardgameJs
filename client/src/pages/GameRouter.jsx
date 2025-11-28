import { Navigate } from "react-router-dom";
import { useGameContext } from "../context/GameContext";
import FeedTheKrakenPage from "./FeedTheKrakenPage";
import MineSweeperPage from "./MineSweeperPage";
import SplendorPage from "./SplendorPage";
import SplendorDuelPage from "./SplendorDuelPage";

export default function GameRouter() {
  const { gameState } = useGameContext();
  console.log("GameRouter - Current Game State:", gameState);

  // اگر هنوز نوع بازی تعیین نشده، کاربر را به لابی بفرست
  if (!gameState?.type) {
    return <Navigate to="/lobby" replace />; // replace == بدون اضافه‌شدن به history
  }

  switch (gameState.type) {
    case "feedTheKraken":
      return <FeedTheKrakenPage />;
    case "mineSweeper":
      return <MineSweeperPage />;
    case "splendor":
      return <SplendorPage />;
    case "splendorDuel":
      return <SplendorDuelPage />;
    default:
      // نوع نامعتبر → برگشت به لابی
      return <Navigate to="/lobby" replace />;
  }
}
