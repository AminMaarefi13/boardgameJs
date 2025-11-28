import React, { useEffect, useState } from "react";
import ChatPanel from "../components/Chat/ChatPanel";
import NavigationMenu from "../components/NavigationMenu";
import { useAppContext } from "../context/AppContext";
import { useGameContext } from "../context/GameContext";
import { socket } from "../network/socket";

const AppLayout = ({ children, showChat = false }) => {
  const [chatOpen, setChatOpen] = useState(true);
  const { userState, setUserState, connectionState, setConnectionState } =
    useAppContext();
  const { gameState, setGameState } = useGameContext();
  const { playerId, name, currentRoomId, currentGameId } = connectionState;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white w-full overflow-x-hidden">
      <div className="flex-1 overflow-y-auto w-full">
        <div className="w-full px-1 sm:px-2 md:px-4 pt-2">{children}</div>
      </div>
      {currentRoomId && showChat && chatOpen && (
        <div className="bg-gray-800 shadow-inner max-h-[40vh] overflow-y-auto w-full">
          <div className="w-full md:px-4 ">
            <ChatPanel roomId={currentRoomId} />
          </div>
        </div>
      )}
      <footer className="bg-gray-950 border-t border-gray-700 w-full">
        <div className="w-full">
          <NavigationMenu />
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
