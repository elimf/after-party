import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { difficultyTranslation } from "../hooks/quizUtils";

const QuizQuestion = ({ room, answerQuiz, quizStarted }) => {
  const { quiz, currentQuestionIndex } = room;
  const { questions, totalQuestions, difficulty, type, timeLimit } = quiz;

  const [selectedChoice, setSelectedChoice] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit / 1000); // Temps initial en secondes
  const [isTimeUp, setIsTimeUp] = useState(false);
  const timerRef = useRef(null);
  const audioRef = useRef(null); // Référence pour le lecteur audio

  const quizQuestion = questions[currentQuestionIndex]?.text || ""; // Question actuelle
  const quizChoices = questions[currentQuestionIndex]?.choices || []; // Choix pour la question actuelle
  const mediaUrl = questions[currentQuestionIndex]?.mediaUrl || ""; // URL du média
  const difficultyQuiz = difficultyTranslation[difficulty] || "Inconnu";

  useEffect(() => {
    if (quizStarted) {
      setSelectedChoice(null);
      setTimeLeft(timeLimit / 1000);
      setIsTimeUp(false);

      // Démarrer le chronomètre
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimeUp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Gérer le lecteur audio
      const audioElement = audioRef.current;
      if (audioElement) {
        audioElement.pause(); // Pause l'audio en cours
        audioElement.currentTime = 0; // Réinitialise le temps de lecture
      }

      // Assurer que l'audio joue pour la question actuelle
      if (type === 'Blindtest' && mediaUrl) {
        if (audioElement) {
          audioElement.src = mediaUrl;
          audioElement.play();
        }
      }
    }

    return () => {
      clearInterval(timerRef.current);
      const audioElement = audioRef.current;
      if (audioElement) {
        audioElement.pause(); // Assurez-vous de stopper la lecture lorsque le composant se démonte
      }
    };
  }, [quizStarted, currentQuestionIndex, timeLimit, type, mediaUrl]);

  const handleChoiceSelect = (choiceIndex) => {
    if (!isTimeUp) {
      setSelectedChoice(choiceIndex);
    }
  };

  const handleSubmit = () => {
    if (selectedChoice !== null) {
      answerQuiz(selectedChoice);
      setIsTimeUp(true);
    } else {
      toast.warn("Veuillez sélectionner une réponse avant de soumettre.");
    }
  };

  if (!quizQuestion) {
    return <div>Aucune question disponible pour le moment.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Question du Quiz</h2>

        {/* Afficher le type du quiz, le numéro de la question et le nombre total de questions */}
        <div className="text-sm mb-4 text-gray-700">
          <p><strong>Type:</strong> {type}</p>
          <p><strong>Question:</strong> {currentQuestionIndex + 1} / {totalQuestions}</p>
          <p><strong>Difficulté:</strong> {difficultyQuiz}</p>
        </div>

        {/* Afficher le média si le type est 'blindtest' */}
        {type === 'Blindtest' && mediaUrl && (
          <div className="mb-4">
            <audio ref={audioRef} autoPlay />
          </div>
        )}

        <p className="text-lg mb-4 text-center">{quizQuestion}</p>
        <div className="space-y-2">
          {quizChoices.map((choice, index) => (
            <div
              key={index}
              className={`cursor-pointer p-4 border rounded-lg text-center ${
                selectedChoice === index ? "bg-blue-100 border-blue-500" : "bg-gray-100 border-gray-300"
              } ${isTimeUp ? "opacity-50 pointer-events-none" : ""}`}
              onClick={() => handleChoiceSelect(index)}
              role="button"
              aria-pressed={selectedChoice === index}
            >
              {choice}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <span className={`text-lg ${isTimeUp ? 'text-red-500' : 'text-gray-700'}`}>Temps restant: {timeLeft}s</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isTimeUp || selectedChoice === null}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Soumettre
        </button>
      </div>
    </div>
  );
};

export default QuizQuestion;
