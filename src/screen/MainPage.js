import React, { useState } from "react";
import Connect from "../component/Connect";
import Waiting from "../component/Waiting";
import RoomManager from "../component/RoomManager";
import useWebSocket from "../hooks/useWebSocket";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatBubbleOvalLeftIcon, XMarkIcon } from "@heroicons/react/24/outline"; // Importation correcte pour Heroicons v2

const MainPage = () => {
  const apiUrl = process.env.REACT_APP_API_WS_URL;
  const {
    connected,
    currentUser,
    currentRoom,
    rooms,
    users,
    quizStarted,
    connectWebSocket,
    sendMessage,
    createRoom,
    joinRoom,
    leaveRoom,
    startQuiz,
    answerQuiz,
    startBacGame,
    submitBacResponses,
    disconnectWebSocket,
  } = useWebSocket(apiUrl);

  const handleJoinRoom = (roomId) => {
    joinRoom(roomId);
  };
  const handleLeaveRoom = () => {
    leaveRoom();
  };
  const handleAnswerQuiz = (answer) => {
    answerQuiz(answer);
  };
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => setIsChatOpen((prevState) => !prevState);
  return (
    <div className="app-container">
      <div className="header">
        {!connected ? (
          <Connect onConnect={connectWebSocket} />
        ) : (
          <>
            <button onClick={disconnectWebSocket} className="disconnect-button">
              Déconnexion
            </button>

            {currentRoom && (currentRoom.quiz || currentRoom.bacGame) && (
              <button
                onClick={handleLeaveRoom}
                className={`leave-room-button ${
                  (currentRoom.quiz && currentRoom.quiz.isRunning) ||
                  (currentRoom.bacGame && currentRoom.bacGame.isRunning)
                    ? "disabled"
                    : ""
                }`}
              >
                Quitter la salle
              </button>
            )}
            {currentRoom && (
              <button
                className="z-10 absolute top-0 right-4 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition duration-200"
                onClick={toggleChat}
              >
                {isChatOpen ? (
                  <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <ChatBubbleOvalLeftIcon
                    className="w-6 h-6"
                    aria-hidden="true"
                  />
                )}
              </button>
            )}
          </>
        )}
      </div>
      <div className="main-content">
        {connected && !currentRoom && (
          <Waiting
            rooms={rooms}
            users={users}
            onJoinRoom={handleJoinRoom}
            onCreateRoom={createRoom}
            currentUser={currentUser}
          />
        )}
        {connected && currentRoom && (
          <RoomManager
            currentRoom={currentRoom}
            currentUser={currentUser}
            startQuiz={startQuiz}
            handleAnswerQuiz={handleAnswerQuiz}
            quizStarted={quizStarted}
            sendMessage={sendMessage}
            startBacGame={startBacGame}
            submitBacResponses={submitBacResponses}
            isChatOpen={isChatOpen}
            toggleChat={toggleChat}
          />
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
    </div>
  );
};

export default MainPage;
