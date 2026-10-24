import React, { useState, useEffect, useRef } from 'react';
import '../styles/theme.css';
import axios from 'axios';

const BlindtestSetup = ({
  isOpen,
  onRequestClose,
  onStart,
}) => {
  const [sourceMode, setSourceMode] = useState('artist'); // 'artist' | 'predefined'
  const [artistName, setArtistName] = useState('');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [includeFeatures, setIncludeFeatures] = useState(true);
  const [questionCount, setQuestionCount] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const searchTimeoutRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (sourceMode !== 'artist') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const term = artistName.trim();
    if (term.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Don't show suggestions if term matches last added
    if (selectedArtists.length > 0) {
      const last = selectedArtists[selectedArtists.length - 1];
      if (last.name.toLowerCase() === term.toLowerCase()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        const response = await axios.get(`${apiUrl}/blindtest/artists`, {
          params: { term },
        });
        const results = response.data.artists || [];
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Erreur recherche artistes:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    }, 150);
  }, [artistName, sourceMode, selectedArtists]);

  const handleSelectArtist = (artist) => {
    const exists = selectedArtists.find((a) => a.name.toLowerCase() === artist.name.toLowerCase());
    if (exists) {
      setArtistName('');
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSelectedArtists((prev) => [...prev, artist]);
    setArtistName('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleRemoveArtist = (artistToRemove) => {
    setSelectedArtists((prev) => prev.filter((a) => a.name.toLowerCase() !== artistToRemove.name.toLowerCase()));
  };

  const handleStart = () => {
    if (!questionCount || !difficulty) {
      alert('Veuillez sélectionner le nombre de questions et la difficulté');
      return;
    }

    if (sourceMode === 'artist') {
      if (selectedArtists.length === 0) {
        const finalArtist = artistName.trim();
        if (!finalArtist) {
          alert("Veuillez indiquer au moins un artiste");
          return;
        }
        onStart({
          musicSource: 'artist',
          sourceId: finalArtist,
          questionCount,
          difficulty,
        });
        return;
      }
      const sourceId = selectedArtists.map((a) => a.name).join(' ');
      onStart({
        musicSource: 'artist',
        sourceId: sourceId,
        questionCount,
        difficulty,
      });
      return;
    }

    if (sourceMode === 'predefined') {
      onStart({
        musicSource: 'artists',
        sourceId: 'random',
        questionCount,
        difficulty,
      });
      return;
    }
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
                value="artist"
                checked={sourceMode === 'artist'}
                onChange={(e) => setSourceMode(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-900 font-medium">Par artiste</span>
            </label>

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
          </div>
        </div>

        {/* Artist Input */}
        {sourceMode === 'artist' && (
          <div className="mb-6" ref={wrapperRef}>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Artistes
            </label>
            {selectedArtists.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedArtists.map((artist) => (
                  <span
                    key={artist.name}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {artist.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveArtist(artist)}
                      className="ml-1 text-purple-600 hover:text-purple-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="relative">
              <input
                type="text"
                value={artistName}
                onChange={(e) => {
                  setArtistName(e.target.value);
                }}
                placeholder="Tape un nom d'artiste et sélectionne-le..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition"
                autoComplete="off"
              />
              {isSearching && (
                <div className="absolute right-3 top-2.5 text-xs text-gray-400">Recherche...</div>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((artist, index) => (
                    <button
                      key={`${artist.id}-${artist.name}-${index}`}
                      type="button"
                      onClick={() => handleSelectArtist(artist)}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 text-gray-900 text-sm border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{artist.name}</span>
                        {(artist.primaryGenreName || artist.genre) && (
                          <span className="text-xs text-gray-500 ml-2">{artist.primaryGenreName || artist.genre}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Tu peux ajouter plusieurs artistes</p>
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
