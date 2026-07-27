import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../../styles/theme.css";

const PetitBac = ({ room, onSubmit }) => {
  const currentLetter = room.bacGame.currentLetter || "";
  const [timeLeft, setTimeLeft] = useState(room.bacGame.timeLimit);
  const [localResponses, setLocalResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const roundStartedAtRef = useRef(Date.now());

  const categories = useMemo(
    () => room.bacGame.categories || [],
    [room.bacGame.categories]
  );

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
        newErrors[category] = `Champ requis`;
      }

      if (
        !isAutoSubmit &&
        response &&
        normalizedLetter &&
        !normalizedResponse.startsWith(normalizedLetter)
      ) {
        newErrors[category] = `Doit commencer par "${currentLetter}"`;
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

  const timeColor =
    timeLeft <= 5000
      ? "text-red-600"
      : timeLeft <= 15000
      ? "text-yellow-600"
      : "text-green-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="container max-w-4xl animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 border-t-4 border-t-blue-600">
          {/* Title & Timer */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-600 mb-2">Petit Bac</h1>
            <div className="text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {currentLetter}
            </div>
            <div className={`text-4xl font-bold ${timeColor} transition`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {categories.map((category) => (
              <div key={category}>
                <label
                  className="block text-sm font-semibold text-gray-900 mb-2 capitalize"
                  htmlFor={`input-${category}`}
                >
                  {category}
                </label>
                <input
                  id={`input-${category}`}
                  type="text"
                  value={localResponses[category] || ""}
                  onChange={(e) => handleChange(category, e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition ${
                    errors[category]
                      ? "border-red-500 bg-red-50"
                      : isSubmitted
                      ? "bg-gray-100 border-gray-300"
                      : "border-gray-300"
                  } ${isSubmitted ? "cursor-not-allowed opacity-50" : ""}`}
                  placeholder={`Commençant par ${currentLetter}`}
                  disabled={isSubmitted}
                  autoComplete="off"
                />
                {errors[category] && (
                  <p className="text-red-600 text-xs mt-1 font-medium">
                    ⚠️ {errors[category]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitted || timeLeft === 0}
            className={`w-full px-4 py-3 font-semibold text-lg rounded-lg transition ${
              isSubmitted || timeLeft <= 0
                ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-300 opacity-50"
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg"
            }`}
          >
            {isSubmitted ? (
              <>✓ Réponses envoyées</>
            ) : timeLeft <= 0 ? (
              <>Temps écoulé</>
            ) : (
              <>Soumettre</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

function normalize(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default PetitBac;
