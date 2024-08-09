import React from "react";
import { difficultyTranslation } from "../hooks/quizUtils"; // Importer l'objet difficultyTranslation

const QuizResults = ({ quiz }) => {
  const { totalQuestions, type } = quiz;
  const totalPlayers = quiz.results.users.length;
  const difficultyQuiz = quiz.difficulty;

  // Obtenir la traduction en français
  const difficulty = difficultyTranslation[difficultyQuiz] || "Inconnu";

  // Trier les utilisateurs par score (du plus élevé au plus bas)
  const sortedUsers = [...quiz.results.users].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Résultats du Quiz</h2>

        {/* Afficher les détails du quiz */}
        <div className="mb-6">
          <p className="text-lg font-semibold mb-2">
            <strong>Nombre de joueurs:</strong> {totalPlayers}
          </p>
          <p className="text-lg font-semibold mb-2">
            <strong>Nombre de questions:</strong> {totalQuestions}
          </p>
          <p className="text-lg font-semibold mb-2">
            <strong>Difficulté:</strong> {difficulty}
          </p>
          <p className="text-lg font-semibold mb-2">
            <strong>Type:</strong> {type}
          </p>
        </div>

        {/* Afficher la liste des résultats avec un positionnement réactif */}
        <ul className="list-none">
          {sortedUsers.map((user, index) => (
            <li key={user.userId} className="flex flex-col md:flex-row md:items-center mb-4 p-4 border rounded-lg bg-gray-50 shadow-sm">
              <span className="text-xl font-medium mr-4">{index + 1}. {user.name}</span>
              <span className="text-lg text-gray-700 mr-4">Score: {user.score}</span>
              <span className="text-lg text-gray-500">Temps moyen de réponse: {(user.avgResponseTime / 1000).toFixed(2)} s</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuizResults;
