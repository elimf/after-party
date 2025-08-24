import React, { useState } from "react";
import Waiting from "../component/Waiting";
import RoomManager from "../component/RoomManager";
import useWebSocket from "../hooks/useWebSocket";
import { ToastContainer } from "react-toastify";
import Header from "../component/Main/Header";
import "react-toastify/dist/ReactToastify.css";

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
  const handleAnswerQuiz = (answer) => {
    answerQuiz(answer);
  };
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => setIsChatOpen((prevState) => !prevState);
   const isGameRunning = currentRoom &&
    ((currentRoom.quiz && currentRoom.quiz.isRunning) ||
    (currentRoom.bacGame && currentRoom.bacGame.isRunning));
  return (
    <div className="app-container">
     <Header
        connected={connected}
        currentRoom={currentRoom}
        isChatOpen={isChatOpen}
        onConnect={connectWebSocket}
        onDisconnect={disconnectWebSocket}
        onLeaveRoom={leaveRoom}
        toggleChat={toggleChat}
        isGameRunning={isGameRunning}
      />
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
