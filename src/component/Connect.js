import React from 'react';
import { toast } from 'react-toastify';
import '../style/Connect.css';
import { useAuth } from '../hooks/AuthContext';

const Connect = ({ onConnect }) => {
  const token = localStorage.getItem('authToken')  
  const { logout } = useAuth();

  const handleConnect = () => {
    if (!token) {
      logout();
      toast.error('Vous devez vous connecter pour accéder à cette page, vous allez être redirigé vers la page de connexion').then(() => {
        window.location.href = '/login';
      });
    } else {
      onConnect(token);
    }
  };

  return (
    <div className="connect-container">
    <h1 className="title">After Party</h1>
      <button onClick={handleConnect} className="connect-button">
        Commencer
      </button>
    </div>
  );
};

export default Connect;
