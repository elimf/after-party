import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import '../style/QuizQuestion.css'; // Assurez-vous d'ajouter ce fichier CSS

const QuizQuestion = ({ room, answerQuiz, quizStarted }) => {
  console.log(room);
  const { quiz, currentQuestionIndex } = room;
  const { questions, totalQuestions, difficulty, type, timeLimit } = quiz;

  const [selectedChoice, setSelectedChoice] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit / 1000); // Temps initial en secondes
  const [isTimeUp, setIsTimeUp] = useState(false);
  const timerRef = useRef(null);

  const quizQuestion = questions[currentQuestionIndex]?.text || ""; // Question actuelle
  const quizChoices = questions[currentQuestionIndex]?.choices || []; // Choix pour la question actuelle

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
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [quizStarted, currentQuestionIndex, timeLimit]);

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
    <div className="quiz-question-container">
      <h2>Question du Quiz</h2>
      
      {/* Afficher le type du quiz, le numéro de la question et le nombre total de questions */}
      <div className="quiz-info">
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Question:</strong> {currentQuestionIndex + 1} / {totalQuestions}</p>
        <p><strong>Difficulté:</strong> {difficulty}</p>
      </div>

      <p className="quiz-question">{quizQuestion}</p>
      <div className="quiz-choices">
        {quizChoices.map((choice, index) => (
          <div
            key={index}
            className={`quiz-choice ${
              selectedChoice === index ? "selected" : ""
            } ${isTimeUp ? "disabled" : ""}`}
            onClick={() => handleChoiceSelect(index)}
            role="button"
            aria-pressed={selectedChoice === index}
          >
            {choice}
          </div>
        ))}
      </div>
      <div className="quiz-timer">
        <span className={`timer-text ${isTimeUp ? 'time-up' : ''}`}>Temps restant: {timeLeft}s</span>
      </div>
      <button
        onClick={handleSubmit}
        disabled={isTimeUp || selectedChoice === null}
        className="submit-button"
      >
        Soumettre
      </button>
    </div>
  );
};

export default QuizQuestion;
