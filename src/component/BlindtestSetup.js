import React, { useState } from 'react';
import '../styles/theme.css';

const MUSIC_GENRES = [
  { id: 'rap', name: 'Rap/Hip-Hop' },
  { id: 'rnb', name: 'R&B/Soul' },
  { id: 'pop', name: 'Pop' },
  { id: 'rock', name: 'Rock' },
  { id: 'electronic', name: 'Électronique/EDM' },
  { id: 'indie', name: 'Indie/Alternative' },
  { id: 'reggae', name: 'Reggae' },
  { id: 'gospel', name: 'Gospel' },
  { id: 'jazz', name: 'Jazz' },
  { id: 'classical', name: 'Classique' },
  { id: 'country', name: 'Country' },
  { id: 'disco', name: 'Disco/Funk' },
  { id: 'kpop', name: 'K-Pop' },
  { id: 'latino', name: 'Latino' },
  { id: 'metal', name: 'Metal' },
  { id: 'blues', name: 'Blues' },
  { id: 'reggaeton', name: 'Reggaeton' },
  { id: 'afrobeats', name: 'Afrobeats' },
];

const COUNTRIES = [
  { id: 'FR', name: '🇫🇷 France' },
  { id: 'US', name: '🇺🇸 USA' },
  { id: 'UK', name: '🇬🇧 Royaume-Uni' },
  { id: 'CA', name: '🇨🇦 Canada' },
  { id: 'DE', name: '🇩🇪 Allemagne' },
  { id: 'IT', name: '🇮🇹 Italie' },
  { id: 'ES', name: '🇪🇸 Espagne' },
  { id: 'JP', name: '🇯🇵 Japon' },
  { id: 'BR', name: '🇧🇷 Brésil' },
  { id: 'KR', name: '🇰🇷 Corée du Sud' },
];

const THEME_PLAYLISTS = [
  { id: 'top100', name: '🔥 Top 100' },
  { id: 'party', name: '🎉 Party Hits' },
  { id: 'summer', name: '☀️ Summer Hits' },
  { id: 'workout', name: '💪 Workout' },
  { id: 'chill', name: '😌 Chill Vibes' },
  { id: 'love', name: '💕 Love Songs' },
  { id: 'indie', name: '🎸 Indie Hits' },
  { id: 'classics', name: '🎵 All-Time Classics' },
];

const BlindtestSetup = ({
  isOpen,
  onRequestClose,
  onStart,
}) => {
  const [sourceMode, setSourceMode] = useState('predefined'); // 'predefined', 'genre', 'country', 'theme'
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('FR');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [questionCount, setQuestionCount] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const handleStart = () => {
    if (!questionCount || !difficulty) {
      alert('Veuillez sélectionner le nombre de questions et la difficulté');
      return;
    }

    if (sourceMode === 'genre' && !selectedGenre) {
      alert('Veuillez sélectionner un genre');
      return;
    }

    if (sourceMode === 'theme' && !selectedTheme) {
      alert('Veuillez sélectionner un thème');
      return;
    }

    let sourceId = 'random';
    if (sourceMode === 'genre') sourceId = selectedGenre;
    else if (sourceMode === 'country') sourceId = selectedCountry;
    else if (sourceMode === 'theme') sourceId = selectedTheme;

    onStart({
      musicSource: sourceMode === 'predefined' ? 'artists' : sourceMode,
      sourceId,
      questionCount,
      difficulty,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🎵 Blindtest iTunes</h2>

        {/* Source Mode Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Choisissez votre source musicale
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="sourceMode"
                value="predefined"
                checked={sourceMode === 'predefined'}
                onChange={(e) => setSourceMode(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-900 font-medium">Artistes prédéfinis</span>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="sourceMode"
                value="genre"
                checked={sourceMode === 'genre'}
                onChange={(e) => setSourceMode(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-900 font-medium">Par genre</span>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="sourceMode"
                value="country"
                checked={sourceMode === 'country'}
                onChange={(e) => setSourceMode(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-900 font-medium">Par pays</span>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="sourceMode"
                value="theme"
                checked={sourceMode === 'theme'}
                onChange={(e) => setSourceMode(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-900 font-medium">Par thème/Playlist</span>
            </label>
          </div>
        </div>

        {/* Genre Selection */}
        {sourceMode === 'genre' && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Sélectionnez un genre
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition"
            >
              <option value="">-- Choisir un genre --</option>
              {MUSIC_GENRES.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Country Selection */}
        {sourceMode === 'country' && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Sélectionnez un pays
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition"
            >
              {COUNTRIES.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Theme Selection */}
        {sourceMode === 'theme' && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Sélectionnez un thème
            </label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition"
            >
              <option value="">-- Choisir un thème --</option>
              {THEME_PLAYLISTS.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Question Count */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Nombre de chansons
          </label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition"
          >
            <option value="">-- Sélectionner --</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>

        {/* Difficulty */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Difficulté
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition"
          >
            <option value="">-- Sélectionner --</option>
            <option value="easy">Facile</option>
            <option value="medium">Moyenne</option>
            <option value="hard">Difficile</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleStart}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Commencer le Blindtest
          </button>
          <button
            onClick={onRequestClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 border border-gray-300 font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlindtestSetup;
