import React, { useState, useEffect } from 'react';

const VoteComponent = ({ room, onVoteSubmit }) => {
  const [votes, setVotes] = useState({});
  const [categories, setCategories] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    // Initialisation des catégories et des réponses à partir de la room
    if (room?.bacGame?.responses) {
      setCategories(room.bacGame.categories);
      setResponses(room.bacGame.responses);
    }
  }, [room]);

  const handleVoteChange = (category, responseId, voteValue) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [category]: {
        ...prevVotes[category],
        [responseId]: voteValue
      }
    }));
  };

  const handleSubmitVotes = () => {
    if (onVoteSubmit) {
      onVoteSubmit(votes);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Votez pour les réponses</h2>
      {categories.map((category) => (
        <div key={category} className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 capitalize">{category}</h4>
          <div className="space-y-3">
            {responses[category]?.map((response) => (
              <div key={response.userId} className="mb-3 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition">
                <p className="font-semibold text-gray-900 mb-3">{response.userName}: <span className="text-purple-600">{response.response}</span></p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVoteChange(category, response.userId, 1)}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-md transition text-sm">
                    Valide
                  </button>
                  <button
                    onClick={() => handleVoteChange(category, response.userId, 2)}
                    className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:shadow-md transition text-sm">
                    Partiel
                  </button>
                  <button
                    onClick={() => handleVoteChange(category, response.userId, 3)}
                    className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-md transition text-sm">
                    Invalide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmitVotes}
        className="w-full px-4 py-3 mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
      >
        Soumettre les votes
      </button>
    </div>
  );
};

export default VoteComponent;
