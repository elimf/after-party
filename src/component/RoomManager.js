import React from 'react';
import Chat from './Chat'; // Assurez-vous que ce chemin est correct
import QuizQuestion from './QuizQuestion';
import '../style/RoomManager.css'; // Assurez-vous que ce chemin est correct

const RoomManager = ({ currentRoom, currentUser, startQuiz, quizQuestion, quizChoices, handleAnswerQuiz,quizStarted, sendMessage }) => {
    console.log(currentRoom);
  return (
    <div className="room-container">
      <div className="games-section">
        {currentRoom.ownerId === currentUser.id && currentRoom.isTriviaRunning ===false  ? (
          <button onClick={startQuiz} className="start-quiz-button">
            Commencer le Quiz
          </button>
        ) : (
          <></>
        )}
        {quizStarted && (
        <QuizQuestion
          quizQuestion={quizQuestion}
          quizChoices={quizChoices}
          answerQuiz={handleAnswerQuiz}
          quizStarted={quizStarted}
        />
      )}
        
      </div>
      <div className="chat-section">
        <Chat room={currentRoom} onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default RoomManager;
