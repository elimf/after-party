import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PetitBac = ({ room, onSubmit }) => {
  const currentLetter = room.bacGame.currentLetter || "";
  const categories = room.bacGame.categories || [];
  const [timeLeft, setTimeLeft] = useState(room.bacGame.timeLimit);
  const [localResponses, setLocalResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const roundStartedAtRef = useRef(Date.now());

  const normalizedLetter = useMemo(
    () => normalize(currentLetter),
    [currentLetter]
  );

  useEffect(() => {
    setTimeLeft(room.bacGame.timeLimit);
    setLocalResponses({});
    setErrors({});
    setIsSubmitted(false);
    roundStartedAtRef.current = Date.now();
  }, [room.bacGame.currentLetter, room.bacGame.timeLimit]);

  const handleChange = (category, value) => {
    setLocalResponses((prev) => ({
      ...prev,
      [category]: value,
    }));
    if (errors[category]) {
      setErrors((prev) => ({
        ...prev,
        [category]: "",
      }));
    }
  };

  const handleSubmit = useCallback((isAutoSubmit = false) => {
    if (isSubmitted) return;

    const newErrors = {};
    const responseTime = Date.now() - roundStartedAtRef.current;
    const formattedResponses = {};

    categories.forEach((category) => {
      const response = (localResponses[category] || "").trim();
      const normalizedResponse = normalize(response);

      if (!isAutoSubmit && !response) {
        newErrors[category] = `Le champ "${category}" ne peut pas être vide.`;
      }

      if (
        !isAutoSubmit &&
        response &&
        normalizedLetter &&
        !normalizedResponse.startsWith(normalizedLetter)
      ) {
        newErrors[category] = `La réponse pour "${category}" doit commencer par "${currentLetter}".`;
      }

      formattedResponses[category] = {
        response,
        responseTime,
      };
    });

    if (Object.keys(newErrors).length > 0 && !isAutoSubmit) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitted(true);
    onSubmit(formattedResponses, isAutoSubmit);
  }, [categories, currentLetter, isSubmitted, localResponses, normalizedLetter, onSubmit]);

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(prev - 1000, 0);
        if (next === 0 && !isSubmitted) {
          handleSubmit(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmit, isSubmitted, timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="petit-bac p-4">
      <h2 className="text-xl font-bold mb-4">Petit Bac - Lettre : {currentLetter}</h2>
      <p className="text-red-600 font-semibold mb-4">Temps restant : {formatTime(timeLeft)}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category} className="category-input">
            <label className="block font-medium mb-2" htmlFor={`input-${category}`}>
              {category}
            </label>
            <input
              id={`input-${category}`}
              type="text"
              value={localResponses[category] || ""}
              onChange={(e) => handleChange(category, e.target.value)}
              className={`input w-full p-2 border ${errors[category] ? "border-red-500 bg-red-100" : "border-gray-300"} rounded-lg`}
              aria-label={`Réponse pour ${category}`}
              placeholder="Entrez une réponse"
              disabled={isSubmitted}
            />
            {errors[category] && <p className="text-red-500 text-sm mt-1">{errors[category]}</p>}
          </div>
        ))}
      </div>

      <button
        onClick={() => handleSubmit(false)}
        className={`submit-button text-white py-2 px-4 rounded-lg mt-4 w-full md:w-auto ${
          isSubmitted ? "bg-gray-500 hover:bg-gray-600" : "bg-green-500 hover:bg-green-600"
        }`}
        disabled={isSubmitted}
      >
        {isSubmitted ? "Reponses envoyees" : timeLeft <= 0 ? "Temps ecoule" : "Soumettre"}
      </button>
    </div>
  );
};

function normalize(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default PetitBac;
