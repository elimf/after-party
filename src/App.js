import React from 'react';
import Connect from './component/Connect';
import Chat from './component/Chat';
import RoomManager from './component/RoomManager';
import Quiz from './component/Quiz';
import useWebSocket from './hooks/useWebSocket';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const {
    connected,
    currentUser,
    currentRoom,
    rooms,
    users,
    quizQuestion,
    quizChoices,
    quizScores,
    connectWebSocket,
    sendMessage,
    createRoom,
    joinRoom,
    startQuiz,
    answerQuiz,
    disconnectWebSocket,
  } = useWebSocket('ws://localhost:3000');

  const handleJoinRoom = (roomId) => {
    joinRoom(roomId);
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
          <button onClick={disconnectWebSocket} className="disconnect-button">Déconnexion</button>
        )}
      </div>
      <div className="main-content">
        {connected && !currentRoom && (
          <RoomManager rooms={rooms} users={users} onJoinRoom={handleJoinRoom} onCreateRoom={createRoom} />
        )}
        {connected && currentRoom && (
          <div className="room-container">        
            <button onClick={startQuiz} className="start-quiz-button">Start Quiz</button> 
            <Chat room={currentRoom.room} onSendMessage={sendMessage} />
            {quizQuestion && (
              <Quiz question={quizQuestion} choices={quizChoices} onAnswer={handleAnswerQuiz} />
            )}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default App;
