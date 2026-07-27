import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSpotifyAuth from '../hooks/useSpotifyAuth';
import '../styles/theme.css';

const BlindtestSetup = ({
  isOpen,
  onRequestClose,
  onStart,
  themes,
}) => {
  const [musicSource, setMusicSource] = useState('artists');
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [questionCount, setQuestionCount] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const { spotifyToken, spotifyUser, loginWithSpotify } = useSpotifyAuth();
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  // Fetch playlists when Spotify is authenticated
  useEffect(() => {
    if (spotifyToken && musicSource === 'playlists') {
      fetchPlaylists();
    }
  }, [spotifyToken, musicSource]);

  const fetchPlaylists = async () => {
    try {
      setLoadingPlaylists(true);
      const authToken = localStorage.getItem('authToken');

      const response = await axios.get(`${apiUrl}/auth/spotify/playlists`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      });

      setPlaylists(response.data.playlists || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setPlaylists([]);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  const handleStart = () => {
    if (!questionCount || !difficulty) {
      alert('Veuillez sélectionner le nombre de questions et la difficulté');
      return;
    }

    if (musicSource === 'playlists') {
      if (!selectedPlaylist) {
        alert('Veuillez sélectionner une playlist');
        return;
      }
      if (!spotifyToken) {
        alert('Connexion Spotify requise pour utiliser vos playlists');
        return;
      }
    }

    if (musicSource === 'themes') {
      if (!selectedTheme) {
        alert('Veuillez sélectionner un thème');
        return;
      }
      if (!spotifyToken) {
        alert('Connexion Spotify requise pour les thèmes');
        return;
      }
    }

    onStart({
      musicSource,
      sourceId: musicSource === 'playlists' ? selectedPlaylist : selectedTheme,
      questionCount,
      difficulty,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🎵 Blindtest</h2>

        {/* Music Source Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Choisissez votre source musicale
          </label>

          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="musicSource"
                value="artists"
                checked={musicSource === 'artists'}
                onChange={(e) => setMusicSource(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-900 font-medium">Artistes présélectionnés</span>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="musicSource"
                value="playlists"
                checked={musicSource === 'playlists'}
                onChange={(e) => setMusicSource(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-900 font-medium">Mes playlists Spotify</span>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="musicSource"
                value="themes"
                checked={musicSource === 'themes'}
                onChange={(e) => setMusicSource(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-gray-900 font-medium">Thèmes (Top 100, Rap, RnB...)</span>
            </label>
          </div>
        </div>

        {/* Spotify Login for Playlists/Themes */}
        {(musicSource === 'playlists' || musicSource === 'themes') && !spotifyToken && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 mb-3">
              Connectez-vous à Spotify pour accéder {musicSource === 'playlists' ? 'à vos playlists' : 'aux thèmes'}
            </p>
            <button
              onClick={loginWithSpotify}
              className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              🎵 Se connecter à Spotify
            </button>
          </div>
        )}

        {/* Spotify User Info */}
        {spotifyToken && spotifyUser && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              ✓ Connecté en tant que {spotifyUser}
            </p>
          </div>
        )}

        {/* Playlist Selection */}
        {musicSource === 'playlists' && spotifyToken && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Sélectionnez une playlist
            </label>
            <select
              value={selectedPlaylist}
              onChange={(e) => setSelectedPlaylist(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition"
              disabled={loadingPlaylists || !playlists?.length}
            >
              <option value="">-- Sélectionner une playlist --</option>
              {playlists?.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Theme Selection */}
        {musicSource === 'themes' && spotifyToken && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Sélectionnez un thème
            </label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition"
            >
              <option value="">-- Sélectionner un thème --</option>
              {themes?.map((theme) => (
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
            disabled={loadingPlaylists}
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
