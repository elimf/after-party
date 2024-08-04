import React from "react";
import Connect from "./component/Connect";
import Waiting from "./component/Waiting";
import RoomManager from "./component/RoomManager";
import useWebSocket from "./hooks/useWebSocket";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
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

            {currentRoom && (
              <button onClick={handleLeaveRoom} className={`leave-room-button ${currentRoom.quiz.isRunning ? "disabled" : ""}`}>
                Quitter la salle
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
          />
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
