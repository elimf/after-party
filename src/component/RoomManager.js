import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import QuizQuestion from "./Game/QuizQuestion";
import QuizResults from "./Game/QuizResults";
import PetitBac from "./Game/PetitBac";
import GameModal from "./GameModal";
import BacResults from "./Game/BacResults";
import BlindtestSetup from "./BlindtestSetup";

const RoomManager = ({
  currentRoom,
  currentUser,
  startQuiz,
  handleAnswerQuiz,
  quizStarted,
  sendMessage,
  startBacGame,
  submitBacResponses,
  bacResults,
  isChatOpen,
  toggleChat,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlindtestModalOpen, setIsBlindtestModalOpen] = useState(false);
  const [isPetitBacModalOpen, setIsPetitBacModalOpen] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [timeLimit, setTimeLimit] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [themes, setThemes] = useState([
    { id: 'top100', name: 'Top 100 Global' },
    { id: 'rap', name: 'Rap' },
    { id: 'rnb', name: 'R&B' },
    { id: 'electro', name: 'Électronique' },
  ]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);

  const isOwner = currentRoom.ownerId === currentUser.id;
  const isQuizRunning = currentRoom.quiz?.isRunning;
  const isBacGameRunning = currentRoom.bacGame?.isRunning;
  const showQuizResults = !quizStarted && !isQuizRunning && !isBacGameRunning && currentRoom.quiz?.results;
  const isBacRoundScored = currentRoom.bacGame?.phase === "scored";

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

  const handleStartBlindtest = (blindtestConfig) => {
    if (blindtestConfig.difficulty && blindtestConfig.questionCount) {
      // Pass new music source parameters to backend
      startQuiz(
        "Blindtest",
        blindtestConfig.questionCount,
        blindtestConfig.difficulty,
        blindtestConfig.musicSource,
        blindtestConfig.sourceId
      );
      closeBlindtestModal();
    }
  };

  const handleStartPetitBac = () => {
    if (timeLimit) {
      startBacGame(timeLimit);
      closePetitBacModal();
    }
  };

  return (
    <div className="relative min-h-screen flex">
      <div className="games-section flex-grow p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-4">
          {isOwner && !isQuizRunning && !isBacGameRunning && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={openModal}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
              >
                📝 Quiz
              </button>
              <button
                onClick={openPetitBacModal}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📚 Petit Bac
              </button>
              <button
                onClick={openBlindtestModal}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
              >
                🎵 Blindtest
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
            <PetitBac
              room={currentRoom}
              onSubmit={submitBacResponses}
            />
          )}
          {isBacRoundScored && bacResults && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <BacResults results={bacResults} />
            </div>
          )}
          
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform transition-transform z-40 ${
          isChatOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
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
              { value: "Art", label: "Art" },
              { value: "Histoire", label: "Histoire" },
              { value: "Littérature", label: "Littérature" },
              { value: "Technologie", label: "Technologie" },
            ],
          },
          {
            label: "Choisissez le nombre de questions",
            choices: [
              { value: 5, label: "5" },
              { value: 10, label: "10" },
              { value: 15, label: "15" },
              { value: 20, label: "20" },
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

      {/* Modal Blindtest (New) */}
      <BlindtestSetup
        isOpen={isBlindtestModalOpen}
        onRequestClose={closeBlindtestModal}
        onStart={handleStartBlindtest}
        playlists={playlists}
        themes={themes}
        loading={loadingPlaylists}
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
