import React, { useState, useEffect } from "react";

const PetitBac = ({ room, onSubmit }) => {
  const [timeLeft, setTimeLeft] = useState(room.bacGame.timeLimit); // timeLimit en millisecondes
  const [localResponses, setLocalResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false); // État pour vérifier si la soumission a été faite
  const currentLetter = room.bacGame.currentLetter;

  // Gérer le compte à rebours
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1000; // Réduire de 1000ms (1 seconde) chaque intervalle
        } else {
          clearInterval(timer);
          if (!isSubmitted) handleSubmit(true); // Soumettre automatiquement si le temps est écoulé (isAutoSubmit = true)
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer); // Nettoyage à la fin du composant ou du timer
  },);

  // Écoute les mises à jour de room.bacGame.timeLimit
  useEffect(() => {
    if (room.bacGame.timeLimit === 0) {
      if (!isSubmitted) handleSubmit(true); // Soumettre automatiquement si le temps est écoulé
    } else {
      setTimeLeft(room.bacGame.timeLimit); // Met à jour le temps restant si timeLimit change
    }
  }, [room.bacGame.timeLimit]);

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

  const handleSubmit = (isAutoSubmit = false) => {
    if (isSubmitted) return; // Ne pas soumettre si déjà soumis

    const newErrors = {};
    const validatedResponses = {};

    room.bacGame.categories.forEach((category) => {
      const response = localResponses[category] || "";

      if (!response) {
        newErrors[category] = `Le champ "${category}" ne peut pas être vide.`;
      } else if (!response.startsWith(currentLetter)) {
        if (!isAutoSubmit) {
          newErrors[category] = `La réponse pour "${category}" doit commencer par "${currentLetter}".`;
        }
      } else {
        validatedResponses[category] = response;
      }
    });

    if (isAutoSubmit) {
      // Pour les soumissions automatiques, vider les catégories incorrectes
      Object.keys(localResponses).forEach((category) => {
        if (!localResponses[category].startsWith(currentLetter)) {
          validatedResponses[category] = ""; // Vider les réponses incorrectes
        }
      });
    }

    if (Object.keys(newErrors).length > 0 && !isAutoSubmit) {
      setErrors(newErrors);
    } else {
      setIsSubmitted(true); // Marquer comme soumis
      onSubmit(validatedResponses, isAutoSubmit); // Envoyer les réponses avec l'information sur le type de soumission
    }
  };

  // Convertir le temps en minutes et secondes
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Déterminer la classe du bouton en fonction des états
  const buttonClass = () => {
    if (isSubmitted) {
      return "bg-gray-500 hover:bg-gray-600"; // Couleur pour le bouton après soumission
    }
    if (timeLeft <= 0) {
      return "bg-red-500 hover:bg-red-600"; // Couleur pour le bouton lorsque le chronomètre est arrêté
    }
    return "bg-green-500 hover:bg-green-600"; // Couleur pour le bouton par défaut
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
        onClick={() => handleSubmit(false)} // handleSubmit(false) est utilisé pour la soumission manuelle
        className={`submit-button text-white py-2 px-4 rounded-lg mt-4 w-full md:w-auto ${buttonClass()}`}
        disabled={isSubmitted} // Désactiver le bouton après soumission
      >
        {isSubmitted ? "Réponses envoyées" : timeLeft <= 0 ? "Temps écoulé" : "Soumettre"}
      </button>
    </div>
  );
};

export default PetitBac;
