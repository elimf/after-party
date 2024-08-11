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
    <div className="vote-component p-4">
      <h2 className="text-xl font-bold mb-4">Votez pour les réponses</h2>
      {categories.map((category) => (
        <div key={category} className="category-section mb-6">
          <h4 className="text-lg font-semibold">{category}</h4>
          <div className="responses-list mt-2">
            {responses[category]?.map((response) => (
              <div key={response.userId} className="response-item mb-2 p-2 border rounded">
                <p className="font-medium">{response.userName}: {response.response}</p>
                <div className="vote-options mt-2">
                  <button onClick={() => handleVoteChange(category, response.userId, 1)} className="vote-button bg-blue-500 text-white py-1 px-2 rounded mr-2">1</button>
                  <button onClick={() => handleVoteChange(category, response.userId, 2)} className="vote-button bg-green-500 text-white py-1 px-2 rounded mr-2">2</button>
                  <button onClick={() => handleVoteChange(category, response.userId, 3)} className="vote-button bg-red-500 text-white py-1 px-2 rounded">3</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmitVotes}
        className="submit-button bg-blue-600 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700"
      >
        Soumettre les votes
      </button>
    </div>
  );
};

export default VoteComponent;
