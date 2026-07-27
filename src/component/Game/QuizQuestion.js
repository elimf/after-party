import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { difficultyTranslation } from "../../utils/quizUtils";
import "../../styles/theme.css";

const QuizQuestion = ({ room, answerQuiz, quizStarted }) => {
  const { quiz, currentQuestionIndex } = room;
  const { questions, totalQuestions, difficulty, type, timeLimit } = quiz;

  const [selectedChoice, setSelectedChoice] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit / 1000);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const quizQuestion = questions[currentQuestionIndex]?.text || "";
  const quizChoices = questions[currentQuestionIndex]?.choices || [];
  const mediaUrl = questions[currentQuestionIndex]?.mediaUrl || "";
  const difficultyQuiz = difficultyTranslation[difficulty] || "Inconnu";
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    if (quizStarted) {
      setSelectedChoice(null);
      setTimeLeft(timeLimit / 1000);
      setIsTimeUp(false);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimeUp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const audioElement = audioRef.current;
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }

      if (type === "Blindtest" && mediaUrl && audioElement) {
        audioElement.src = mediaUrl;
        audioElement.play();
      }
    }

    return () => {
      clearInterval(timerRef.current);
      const audioElement = audioRef.current;
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [quizStarted, currentQuestionIndex, timeLimit, type, mediaUrl]);

  const handleChoiceSelect = (choiceIndex) => {
    if (!isTimeUp) {
      setSelectedChoice(choiceIndex);
    }
  };

  const handleSubmit = () => {
    if (selectedChoice !== null) {
      answerQuiz(selectedChoice);
      setIsTimeUp(true);
    } else {
      toast.warn("Veuillez sélectionner une réponse");
    }
  };

  // Blindtest audio handlers
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!quizQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-top-2 duration-300">
        {/* Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 border-t-4 border-t-purple-600">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">
                Question {currentQuestionIndex + 1} / {totalQuestions}
              </span>
              <span
                className={`text-sm font-bold ${
                  timeLeft <= 5 ? "text-red-600" : "text-gray-600"
                }`}
              >
                ⏱️ {timeLeft}s
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Quiz Info */}
          <div className="flex gap-2 mb-6 text-sm">
            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">
              {type}
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
              {difficultyQuiz}
            </span>
          </div>

          {/* Audio Player (Blindtest) */}
          {type === "Blindtest" && mediaUrl && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <audio
                ref={audioRef}
                src={mediaUrl}
                onTimeUpdate={handleAudioTimeUpdate}
                onLoadedMetadata={handleAudioLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Player Header */}
              <p className="text-sm font-semibold text-gray-900 mb-3">
                🎵 Écoutez et deviez
              </p>

              {/* Controls */}
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={togglePlayPause}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center hover:shadow-md transition"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? "⏸️" : "▶️"}
                </button>

                {/* Volume Control */}
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs text-gray-600">🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    title="Volume"
                  />
                  <span className="text-xs text-gray-600 w-8 text-right">
                    {volume}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <input
                  type="range"
                  min="0"
                  max={audioDuration || 0}
                  value={audioCurrentTime}
                  onChange={(e) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = parseFloat(e.target.value);
                    }
                  }}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  title="Progress"
                />
              </div>

              {/* Time Display */}
              <div className="flex justify-between text-xs text-gray-600">
                <span>{formatTime(audioCurrentTime)}</span>
                <span>{formatTime(audioDuration)}</span>
              </div>
            </div>
          )}

          {/* Question */}
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center leading-tight">
            {quizQuestion}
          </h2>

          {/* Choices */}
          <div className="space-y-3 mb-6">
            {quizChoices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoiceSelect(index)}
                disabled={isTimeUp}
                className={`bg-white p-4 rounded-lg text-left transition w-full ${
                  selectedChoice === index
                    ? "border-2 border-purple-600 bg-purple-50"
                    : "border border-gray-200 hover:border-purple-600"
                } ${isTimeUp ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} hover:shadow-md`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition ${
                      selectedChoice === index
                        ? "bg-gradient-to-r from-purple-600 to-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium text-gray-900">{choice}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isTimeUp || selectedChoice === null}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTimeUp ? "Réponse envoyée ✓" : "Soumettre"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
