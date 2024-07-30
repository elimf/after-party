import React from 'react';
import Chat from './Chat'; // Assurez-vous que ce chemin est correct
import Quiz from './Quiz'; // Assurez-vous que ce chemin est correct
import '../style/RoomManager.css'; // Assurez-vous que ce chemin est correct

const RoomManager = ({ currentRoom, currentUser, startQuiz, quizQuestion, quizChoices, handleAnswerQuiz, sendMessage }) => {
  return (
    <div className="room-container">
      <div className="games-section">
        {currentRoom.room.ownerId === currentUser.id ? (
          <button onClick={startQuiz} className="start-quiz-button">
            Start Quiz
          </button>
        ) : (
          <h2>Patientez</h2>
        )}

        {quizQuestion && (
          <Quiz
            question={quizQuestion}
            choices={quizChoices}
            onAnswer={handleAnswerQuiz}
          />
        )}
      </div>
      <div className="chat-section">
        <Chat room={currentRoom.room} onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default RoomManager;
