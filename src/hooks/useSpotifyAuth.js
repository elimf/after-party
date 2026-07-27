import { useState, useEffect } from 'react';

const useSpotifyAuth = () => {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [spotifyUser, setSpotifyUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Spotify is authenticated
    const spotifyAuth = localStorage.getItem('spotifyAuthenticated');
    const spotifyId = localStorage.getItem('spotifyId');

    if (spotifyAuth === 'true' && spotifyId) {
      setSpotifyToken(spotifyId);
      setSpotifyUser(spotifyId);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const loginWithSpotify = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    window.location.href = `${apiUrl}/auth/spotify/authorize`;
  };

  const logout = () => {
    setSpotifyToken(null);
    setSpotifyUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('spotifyAuthenticated');
    localStorage.removeItem('spotifyId');
  };

  return {
    spotifyToken,
    spotifyUser,
    isAuthenticated,
    loading,
    loginWithSpotify,
    logout,
  };
};

export default useSpotifyAuth;
