import React, { useState } from 'react';
import Modal from 'react-modal';
import Chat from './Chat'; // Assurez-vous que ce chemin est correct
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';

const RoomManager = ({ 
  currentRoom, 
  currentUser, 
  startQuiz, 
  handleAnswerQuiz, 
  quizStarted, 
  sendMessage,
  // startPetitBac // Ajoutez une nouvelle prop pour démarrer le Petit Bac
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionType, setQuestionType] = useState('');
  const [questionCount, setQuestionCount] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isPetitBacActive, setIsPetitBacActive] = useState(false); // État pour savoir si le Petit Bac est actif
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleStartQuiz = () => {
    if (questionType && questionCount && difficulty) {
      startQuiz(questionType, questionCount, difficulty);
      closeModal();
    }
  };

  const toggleChat = () => setIsChatOpen(prevState => !prevState);

  const handleStartPetitBac = () => {
    // Assurez-vous que la fonction startPetitBac est définie pour démarrer le jeu du Petit Bac
    // startPetitBac();
    setIsPetitBacActive(true); // Marque le Petit Bac comme actif
  };

  return (
    <div className="relative min-h-screen flex">
      <div className="games-section flex-grow p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-4">
          {currentRoom.ownerId === currentUser.id && !currentRoom.quiz.isRunning && !isPetitBacActive ? (
            <div className="buttons-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={openModal} className="start-quiz-button bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                Commencer le Quiz
              </button>
              <button onClick={handleStartPetitBac} className="start-petitbac-button bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200" disabled>
                Commencer le Petit Bac
              </button>
            </div>
          ) : null}
          {quizStarted && !isPetitBacActive ? (
            <QuizQuestion
              room={currentRoom}
              answerQuiz={handleAnswerQuiz}
              quizStarted={quizStarted}
            />
          ) : null}
          {!quizStarted && !currentRoom.quiz.isRunning && !isPetitBacActive && currentRoom.quiz.results ? (
            <QuizResults quiz={currentRoom.quiz} />
          ) : null}
          {isPetitBacActive && (
            <div className="petit-bac-section bg-gray-100 p-4 rounded-lg shadow-md">
              {/* Contenu du jeu du Petit Bac ici */}
              <p className="text-lg font-medium">Le jeu du Petit Bac est en cours...</p>
            </div>
          )}
        </div>
      </div>
      {/* Chat Section */}
      <div className={`fixed top-0 right-0 bg-gray-800 text-white w-100 h-full transform transition-transform ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button className="absolute top-4 right-4 bg-gray-700 text-white p-2 w-52 rounded-full hover:bg-gray-600" onClick={toggleChat}>
          {isChatOpen ? 'Cacher le Chat' : 'Voir Chat'}
        </button>
        {isChatOpen && <Chat room={currentRoom} onSendMessage={sendMessage} />}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Sélectionner le type, le nombre de questions et la difficulté"
        className="modal max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-2xl font-semibold mb-4">Choisissez le type de question</h2>
        <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded-lg w-full">
          <option value="">Sélectionner</option>
          <option value="all">Aléatoire</option>
          <option value="Culture Générale">Culture Générale</option>
          <option value="Géographie">Géographie</option>
          <option value="Sport">Sport</option>
          <option value="Science">Science</option>
          <option value="Manga">Manga</option>
          <option value="Série/Films">Série/Films</option>
          <option value="Blindtest">Blindtest</option>
        </select>

        <h2 className="text-2xl font-semibold mb-4">Choisissez le nombre de questions</h2>
        <select value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded-lg w-full">
          <option value="">Sélectionner</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>

        <h2 className="text-2xl font-semibold mb-4">Choisissez la difficulté</h2>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded-lg w-full">
          <option value="">Sélectionner</option>
          <option value="easy">Facile</option>
          <option value="medium">Moyenne</option>
          <option value="hard">Difficile</option>
        </select>

        <div className="flex gap-4">
          <button onClick={handleStartQuiz} disabled={!questionType || !questionCount || !difficulty} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
            Commencer le Quiz
          </button>
          <button onClick={closeModal} className="btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200">Annuler</button>
        </div>
      </Modal>
    </div>
  );
};

export default RoomManager;
