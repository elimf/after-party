import React from "react";
import { difficultyTranslation } from "../../utils/quizUtils";
import "../../styles/theme.css";

const QuizResults = ({ quiz }) => {
  const { totalQuestions, type } = quiz;
  const totalPlayers = quiz.results.users.length;
  const difficultyQuiz = quiz.difficulty;
  const difficulty = difficultyTranslation[difficultyQuiz] || "Inconnu";

  const sortedUsers = [...quiz.results.users].sort((a, b) => b.score - a.score);

  const getMedalEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="container max-w-2xl fade-in">
        <div className="card">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">🏆 Résultats</h1>
            <p className="text-neutral-600">{totalPlayers} joueur{totalPlayers > 1 ? "s" : ""}</p>
          </div>

          {/* Quiz Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-neutral-50 rounded-lg p-3 text-center">
              <p className="text-xs text-neutral-500 mb-1">Type</p>
              <p className="font-bold text-neutral-900">{type}</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3 text-center">
              <p className="text-xs text-neutral-500 mb-1">Difficulté</p>
              <p className="font-bold text-neutral-900">{difficulty}</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3 text-center">
              <p className="text-xs text-neutral-500 mb-1">Questions</p>
              <p className="font-bold text-neutral-900">{totalQuestions}</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3 text-center">
              <p className="text-xs text-neutral-500 mb-1">Joueurs</p>
              <p className="font-bold text-neutral-900">{totalPlayers}</p>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-3">
            {sortedUsers.map((user, index) => (
              <div
                key={user.userId}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition ${
                  index === 0
                    ? "bg-yellow-50 border-yellow-300"
                    : index === 1
                    ? "bg-gray-50 border-gray-300"
                    : index === 2
                    ? "bg-orange-50 border-orange-300"
                    : "bg-neutral-50 border-neutral-200"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-3xl font-bold w-12 text-center">
                    {getMedalEmoji(index)}
                  </span>
                  <div>
                    <p className="font-bold text-neutral-900">{user.name}</p>
                    <p className="text-xs text-neutral-500">
                      ⏱️ {(user.avgResponseTime / 1000).toFixed(1)}s/rép
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {user.score}
                  </p>
                  <p className="text-xs text-neutral-500">pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
