import React, { useState } from "react";
import Chat from "./Chat";
import QuizQuestion from "./Game/QuizQuestion";
import QuizResults from "./Game/QuizResults";
import PetitBac from "./Game/PetitBac";
import GameModal from "./GameModal";
import VoteComponent from "./Game/VoteComponent";

const RoomManager = ({
  currentRoom,
  currentUser,
  startQuiz,
  handleAnswerQuiz,
  quizStarted,
  sendMessage,
  startBacGame,
  submitBacResponses,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlindtestModalOpen, setIsBlindtestModalOpen] = useState(false);
  const [isPetitBacModalOpen, setIsPetitBacModalOpen] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [timeLimit, setTimeLimit] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const isOwner = currentRoom.ownerId === currentUser.id;
  const isQuizRunning = currentRoom.quiz?.isRunning;
  const isBacGameRunning = currentRoom.bacGame?.isRunning;
  const showQuizResults = !quizStarted && !isQuizRunning && !isBacGameRunning && currentRoom.quiz?.results;
  const isBacGameVoting = currentRoom.bacGame?.isVoting;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openBlindtestModal = () => setIsBlindtestModalOpen(true);
  const closeBlindtestModal = () => setIsBlindtestModalOpen(false);

  const openPetitBacModal = () => setIsPetitBacModalOpen(true);
  const closePetitBacModal = () => setIsPetitBacModalOpen(false);

  const handleStartQuiz = () => {
    if (questionType && questionCount && difficulty) {
      startQuiz(questionType, questionCount, difficulty);
      closeModal();
    }
  };

  const handleStartBlindtest = () => {
    if (difficulty && questionCount) {
      startQuiz("Blindtest", questionCount, difficulty);
      closeBlindtestModal();
    }
  };

  const handleStartPetitBac = () => {
    if (timeLimit) {
      startBacGame(timeLimit);
      closePetitBacModal();
    }
  };

  const toggleChat = () => setIsChatOpen(prevState => !prevState);

  return (
    <div className="relative min-h-screen flex">
      <div className="games-section flex-grow p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-4">
          {isOwner && !isQuizRunning && !isBacGameRunning && (
            <div className="buttons-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={openModal}
                className="start-quiz-button bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Commencer le Quiz
              </button>
              <button
                onClick={openPetitBacModal}
                className="start-petitbac-button bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Commencer le Petit Bac
              </button>
              <button
                onClick={openBlindtestModal}
                className="start-blindtest-button bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-200"
              >
                Commencer le Blindtest
              </button>
            </div>
          )}
          {quizStarted && !isBacGameRunning && (
            <QuizQuestion
              room={currentRoom}
              answerQuiz={handleAnswerQuiz}
              quizStarted={quizStarted}
            />
          )}
          {showQuizResults && (
            <QuizResults quiz={currentRoom.quiz} />
          )}
          {isBacGameRunning && (
            <div className="petit-bac-section bg-gray-100 p-4 rounded-lg shadow-md">
              <PetitBac
                room={currentRoom}
                onSubmit={submitBacResponses}
              />
            </div>
          )}
          {isBacGameVoting && (
            <div className="bac-vote-section bg-gray-100 p-4 rounded-lg shadow-md">
              <VoteComponent
                room={currentRoom}
                onVoteSubmit={submitBacResponses}
              />
            </div>
          )}
          
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 bg-gray-800 text-white w-100 h-full transform transition-transform ${
          isChatOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 bg-gray-700 text-white p-2 w-52 rounded-full hover:bg-gray-600"
          onClick={toggleChat}
        >
          {isChatOpen ? "Cacher le Chat" : "Voir Chat"}
        </button>
        {isChatOpen && <Chat room={currentRoom} onSendMessage={sendMessage} />}
      </div>

      {/* Modal Quiz */}
      <GameModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        title="Quiz"
        options={[
          {
            label: "Choisissez le type de question",
            choices: [
              { value: "Aléatoire", label: "Aléatoire" },
              { value: "Culture Générale", label: "Culture Générale" },
              { value: "Géographie", label: "Géographie" },
              { value: "Sport", label: "Sport" },
              { value: "Science", label: "Science" },
              { value: "Manga", label: "Manga" },
              { value: "Série/Films", label: "Série/Films" },
            ],
          },
          {
            label: "Choisissez le nombre de questions",
            choices: [
              { value: "5", label: "5" },
              { value: "10", label: "10" },
              { value: "15", label: "15" },
              { value: "20", label: "20" },
            ],
          },
          {
            label: "Choisissez la difficulté",
            choices: [
              { value: "easy", label: "Facile" },
              { value: "medium", label: "Moyenne" },
              { value: "hard", label: "Difficile" },
            ],
          },
        ]}
        values={[questionType, questionCount, difficulty]}
        setValues={(index, value) => {
          const setters = [setQuestionType, setQuestionCount, setDifficulty];
          setters[index](value);
        }}
        onStart={handleStartQuiz}
        startButtonText="Commencer le Quiz"
        disableStartButton={!questionType || !questionCount || !difficulty}
      />

      {/* Modal Blindtest */}
      <GameModal
        isOpen={isBlindtestModalOpen}
        onRequestClose={closeBlindtestModal}
        title="Blindtest"
        options={[
          {
            label: "Choisissez le nombre de chansons pour le Blindtest",
            choices: [
              { value: "5", label: "5" },
              { value: "10", label: "10" },
              { value: "15", label: "15" },
              { value: "20", label: "20" },
            ],
          },
          {
            label: "Choisissez la difficulté pour le Blindtest",
            choices: [
              { value: "easy", label: "Facile" },
              { value: "medium", label: "Moyenne" },
              { value: "hard", label: "Difficile" },
            ],
          },
        ]}
        values={[questionCount, difficulty]}
        setValues={(index, value) => {
          const setters = [setQuestionCount, setDifficulty];
          setters[index](value);
        }}
        onStart={handleStartBlindtest}
        startButtonText="Commencer le Blindtest"
        disableStartButton={!difficulty || !questionCount}
      />

      {/* Modal Petit Bac */}
      <GameModal
        isOpen={isPetitBacModalOpen}
        onRequestClose={closePetitBacModal}
        title="Petit Bac"
        options={[
          {
            label: "Sélectionnez une durée",
            choices: [
              { value: 180000, label: "3min" },
              { value: 240000, label: "4min" },
              { value: 300000, label: "5min" },
              { value: 360000, label: "6min" },
              { value: 420000, label: "7min" },
              { value: 480000, label: "8min" },
              { value: 540000, label: "9min" },
              { value: 600000, label: "10min" },
              { value: 660000, label: "11min" },
              { value: 720000, label: "12min" },
              { value: 780000, label: "13min" },
              { value: 840000, label: "14min" },
              { value: 900000, label: "15min" },
            ],
          },
        ]}
        values={[timeLimit]}
        setValues={(index, value) => setTimeLimit(value)}
        onStart={handleStartPetitBac}
        startButtonText="Commencer"
        disableStartButton={!timeLimit}
      />
    </div>
  );
};

export default RoomManager;
