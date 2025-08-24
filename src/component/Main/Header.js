
import { ChatBubbleOvalLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Connect from "../Connect";
const Header = ({
  connected,
  currentRoom,
  isChatOpen,
  onConnect,
  onDisconnect,
  onLeaveRoom,
  toggleChat,
  isGameRunning,
}) => (
  <header className="header">
    {!connected ? (
      <Connect onConnect={onConnect} />
    ) : (
      <>
        <button onClick={onDisconnect} className="disconnect-button">
          Déconnexion
        </button>

        {currentRoom && (
          <>
            <button
              onClick={onLeaveRoom}
              disabled={isGameRunning}
              className={`leave-room-button ${isGameRunning ? "disabled" : ""}`}
            >
              Quitter la salle
            </button>

            <button
              className="z-10 absolute top-0 right-4 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition duration-200"
              onClick={toggleChat}
            >
              {isChatOpen ? (
                <XMarkIcon className="w-6 h-6" aria-hidden="true" />
              ) : (
                <ChatBubbleOvalLeftIcon className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </>
        )}
      </>
    )}
  </header>
);
export default Header;

