import React, { useState } from 'react';
import Modal from 'react-modal';
import Chat from './Chat'; // Assurez-vous que ce chemin est correct
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import '../style/RoomManager.css'; // Assurez-vous que ce chemin est correct

const RoomManager = ({ currentRoom, currentUser, startQuiz, handleAnswerQuiz, quizStarted, sendMessage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionType, setQuestionType] = useState('');
  const [questionCount, setQuestionCount] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleStartQuiz = () => {
    if (questionType && questionCount && difficulty) {
      startQuiz(questionType, questionCount, difficulty );
      closeModal();
    }
  };

  return (
    <div className="room-container">
      <div className="games-section">
        {currentRoom.ownerId === currentUser.id && !currentRoom.quiz.isRunning ? (
          <button onClick={openModal} className="start-quiz-button">
            Commencer le Quiz
          </button>
        ) : (
          <></>
        )}
        {quizStarted && (
          <QuizQuestion
            room={currentRoom}
            answerQuiz={handleAnswerQuiz}
            quizStarted={quizStarted}
          />
        )}
        {!quizStarted && !currentRoom.quiz.isRunning && currentRoom.quiz.results ? (
        <QuizResults quiz={currentRoom.quiz} />
      ) : (
        <></>
      )}
      </div>
      <div className="chat-section">
        <Chat room={currentRoom} onSendMessage={sendMessage} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Sélectionner le type, le nombre de questions et la difficulté"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Choisissez le type de question</h2>
        <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
          <option value="">Sélectionner</option>
          <option value="all">Aléatoire</option>
          <option value="Culture Générale">Culture Générale</option>
          <option value="Géographie">Géographie</option>
          <option value="Sport">Sport</option>
          <option value="Science">Science</option>
          <option value="Manga">Manga</option>
          <option value="Série/Films">Série/Films</option>
        </select>

        <h2>Choisissez le nombre de questions</h2>
        <select value={questionCount} onChange={(e) => setQuestionCount(e.target.value)}>
          <option value="">Sélectionner</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>

        <h2>Choisissez la difficulté</h2>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">Sélectionner</option>
          <option value="easy">Facile</option>
          <option value="medium">Moyenne</option>
          <option value="hard">Difficile</option>
        </select>

        <button onClick={handleStartQuiz} disabled={!questionType || !questionCount || !difficulty}>Commencer le Quiz</button>
        <button onClick={closeModal}>Annuler</button>
      </Modal>
    </div>
  );
};

export default RoomManager;
