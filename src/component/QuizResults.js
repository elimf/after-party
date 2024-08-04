import React from "react";
import "../style/QuizResults.css"; // Import the CSS file for styling
import { difficultyTranslation } from "../hooks/quizUtils"; // Import the difficultyTranslation object

const QuizResults = ({ quiz }) => {
  const { totalQuestions, questions } = quiz;
  const questionType = questions[0].type;
  const totalPlayers = quiz.results.users.length;
  const difficultyQuiz = quiz.difficulty;

  // Obtenir la traduction en français
  const difficulty = difficultyTranslation[difficultyQuiz] || "Inconnu";

  // Trier les utilisateurs par score (du plus élevé au plus bas)
  const sortedUsers = [...quiz.results.users].sort((a, b) => b.score - a.score);

  return (
    <div className="quiz-results">
      <h2 className="quiz-results-title">Résultats du Quiz</h2>

      {/* Display additional quiz details */}
      <div className="quiz-details">
        <p>
          <strong>Nombre de joueurs:</strong> {totalPlayers}
        </p>
        <p>
          <strong>Nombre de questions:</strong> {totalQuestions}
        </p>
        <p>
          <strong>Difficulté:</strong> {difficulty}
        </p>
        <p>
          <strong>Type:</strong> {questionType}
        </p>
      </div>

      {/* Display the list of results with positioning */}
      <ul className="results-list">
        {sortedUsers.map((user, index) => (
          <li key={user.userId} className="result-item">
            <span className="result-position">{index + 1}. </span>
            <span className="result-name">{user.name}</span> -
            <span className="result-score"> Score: {user.score}</span> -
            <span className="result-time">
              Temps moyen de réponse: {(user.avgResponseTime / 1000).toFixed(2)} s
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizResults;
