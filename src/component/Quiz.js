import React from 'react';

const Quiz = ({ question, choices, onAnswer }) => {
  return (
    <div className="quiz-container">
      <h3>{question}</h3>
      <div className="choices">
        {choices.map((choice, index) => (
          <button key={index} onClick={() => onAnswer(choice)}>
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
