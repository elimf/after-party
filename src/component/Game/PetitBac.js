import React, { useState, useEffect } from "react";

const PetitBac = ({ room, onSubmit }) => {
  const [timeLeft, setTimeLeft] = useState(room.bacGame.timeLimit); // timeLimit en millisecondes
  const [localResponses, setLocalResponses] = useState({});
  const [errors, setErrors] = useState({});
  const currentLetter = room.bacGame.currentLetter;

  // Gérer le compte à rebours
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1000; // Réduire de 1000ms (1 seconde) chaque intervalle
        } else {
          clearInterval(timer);
          handleSubmit(); // Soumettre automatiquement lorsque le temps est écoulé
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer); // Nettoyage à la fin du composant ou du timer
  },);

  const handleChange = (category, value) => {
    setLocalResponses((prev) => ({
      ...prev,
      [category]: value,
    }));
    // Enlever l'erreur en cas de modification
    if (errors[category]) {
      setErrors((prev) => ({
        ...prev,
        [category]: "",
      }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    const validatedResponses = {};

    room.bacGame.categories.forEach((category) => {
      const response = localResponses[category] || "";
      
      if (!response) {
        newErrors[category] = `Le champ "${category}" ne peut pas être vide.`;
      } else if (!response.startsWith(currentLetter)) {
        newErrors[category] = `La réponse pour "${category}" doit commencer par "${currentLetter}".`;
      } else {
        validatedResponses[category] = response;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      onSubmit(validatedResponses);
    }
  };

  // Convertir le temps en minutes et secondes
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="petit-bac p-4">
      <h2 className="text-xl font-bold mb-4">
        Petit Bac - Lettre : {currentLetter}
      </h2>
      <p className="text-red-600 font-semibold mb-4">
        Temps restant : {formatTime(timeLeft)}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {room.bacGame.categories.map((category) => (
          <div key={category} className="category-input">
            <label
              className="block font-medium mb-2"
              htmlFor={`input-${category}`}
            >
              {category}
            </label>
            <input
              id={`input-${category}`}
              type="text"
              value={localResponses[category] || ""}
              onChange={(e) => handleChange(category, e.target.value)}
              className={`input w-full p-2 border ${
                errors[category]
                  ? "border-red-500 bg-red-100"
                  : "border-gray-300"
              } rounded-lg`}
              aria-label={`Réponse pour ${category}`}
              placeholder={`Entrez une réponse`}
            />
            {errors[category] && (
              <p className="text-red-500 text-sm mt-1">{errors[category]}</p>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="submit-button bg-green-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-green-600 w-full md:w-auto"
      >
        Soumettre
      </button>
    </div>
  );
};

export default PetitBac;
