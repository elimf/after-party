import { useEffect } from 'react';
import axios from 'axios';

const useSpotifyAssociate = () => {
  useEffect(() => {
    const handleSpotifyCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const spotifyDataParam = params.get('spotify_data');
      const spotifyError = params.get('spotify_error');

      if (spotifyError) {
        console.error('Spotify authorization error:', spotifyError);
        return;
      }

      if (spotifyDataParam) {
        try {
          const spotifyData = JSON.parse(decodeURIComponent(spotifyDataParam));
          const authToken = localStorage.getItem('authToken');

          if (!authToken) {
            console.error('No auth token found - user not logged in');
            return;
          }

          const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

          // Send Spotify data to backend to associate with current user
          const response = await axios.post(
            `${apiUrl}/auth/spotify/associate`,
            spotifyData,
            {
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
              }
            }
          );

          // Store Spotify info in localStorage
          localStorage.setItem('spotifyAuthenticated', 'true');
          localStorage.setItem('spotifyId', spotifyData.spotify_id);

          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);

          console.log('Spotify account associated successfully');
        } catch (error) {
          console.error('Error associating Spotify account:', error);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleSpotifyCallback();
  }, []);
};

export default useSpotifyAssociate;
