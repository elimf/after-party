import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import '../style/QuizQuestion.css'; // Assurez-vous d'ajouter ce fichier CSS

const QuizQuestion = ({ quizQuestion, quizChoices, answerQuiz, quizStarted }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10); // Temps initial en secondes
  const [isTimeUp, setIsTimeUp] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (quizStarted) {
      setSelectedChoice(null);
      setTimeLeft(10);
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
  }, [quizQuestion, quizStarted]);

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
      <p className="quiz-question">{quizQuestion}</p>
      <div className="quiz-choices">
        {quizChoices.map((choice, index) => (
          <div
            key={index}
            className={`quiz-choice ${
              selectedChoice === index ? "selected" : ""
            } ${isTimeUp ? "disabled" : ""}`}
            onClick={() => handleChoiceSelect(index)}
          >
            {choice}
          </div>
        ))}
      </div>
      <div className="quiz-timer">
        Temps restant: {timeLeft}s
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
