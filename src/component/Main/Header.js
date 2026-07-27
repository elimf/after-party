import React from "react";
import { ChatBubbleOvalLeftIcon, XMarkIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import Connect from "../Connect";
import "../../styles/theme.css";

const Header = ({
  connected,
  currentRoom,
  currentUser,
  isChatOpen,
  onConnect,
  onDisconnect,
  onLeaveRoom,
  toggleChat,
  isGameRunning,
}) => (
  <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
    <div className="container py-3 flex items-center justify-between">
      {/* Logo / Title */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🎮 After Party
        </h1>
        {currentRoom && (
          <span className="hidden sm:block text-sm text-gray-600 ml-4 pl-4 border-l border-gray-300">
            Salle: <span className="font-semibold text-gray-900">{currentRoom.name}</span>
          </span>
        )}
      </div>

      {/* Center: Status */}
      {connected && currentUser && (
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm text-gray-600">
            👤 {currentUser.name}
          </span>
          <div className="flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-green-700">En ligne</span>
          </div>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {!connected ? (
          <Connect onConnect={onConnect} />
        ) : (
          <>
            {currentRoom && (
              <>
                {/* Chat Button */}
                <button
                  onClick={toggleChat}
                  className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
                  title={isChatOpen ? "Fermer le chat" : "Ouvrir le chat"}
                >
                  {isChatOpen ? (
                    <XMarkIcon className="w-5 h-5" />
                  ) : (
                    <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                  )}
                </button>

                {/* Leave Room Button */}
                <button
                  onClick={onLeaveRoom}
                  disabled={isGameRunning}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title={isGameRunning ? "Impossible de quitter pendant une partie" : "Quitter la salle"}
                >
                  <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                  <span className="hidden md:inline">Quitter</span>
                </button>
              </>
            )}

            {/* Disconnect Button */}
            <button
              onClick={onDisconnect}
              className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:shadow-lg transition"
            >
              <span className="hidden sm:inline">Déconnexion</span>
              <span className="sm:hidden">Déco</span>
            </button>
          </>
        )}
      </div>
    </div>
  </header>
);

export default Header;

