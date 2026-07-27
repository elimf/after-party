import { useState, useEffect } from 'react';

const useSpotifyAuth = () => {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [spotifyUser, setSpotifyUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a Spotify token stored
    const storedToken = localStorage.getItem('spotifyToken');
    const storedUser = localStorage.getItem('spotifyUser');

    if (storedToken) {
      setSpotifyToken(storedToken);
      setSpotifyUser(storedUser);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const loginWithSpotify = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    window.location.href = `${apiUrl}/auth/spotify/authorize`;
  };

  const handleOAuthCallback = (token, user) => {
    setSpotifyToken(token);
    setSpotifyUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('spotifyToken', token);
    localStorage.setItem('spotifyUser', user);
  };

  const logout = () => {
    setSpotifyToken(null);
    setSpotifyUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('spotifyToken');
    localStorage.removeItem('spotifyUser');
  };

  return {
    spotifyToken,
    spotifyUser,
    isAuthenticated,
    loading,
    loginWithSpotify,
    handleOAuthCallback,
    logout,
  };
};

export default useSpotifyAuth;
