import React from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/AuthContext';

const Connect = ({ onConnect }) => {
  const token = localStorage.getItem('authToken');  
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-neutral-600 p-12 rounded-lg shadow-lg  mx-auto text-center">
        <h1 className="text-9xl font-cursive text-customYellow mb-8 text-shadow-custom">
          After Party
        </h1>
        <button
          onClick={handleConnect}
          className="bg-blue-500 text-white text-xl py-4 px-8 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          Commencer
        </button>
      </div>
    </div>
  );
};

export default Connect;
