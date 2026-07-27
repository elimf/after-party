import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from "react-router-dom"; 

const Connect = ({ onConnect }) => {
  const [loading, setLoading] = useState(false); // Ajout de l'état de chargement
  const token = localStorage.getItem('authToken');  
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleConnect = () => {
    setLoading(true); // Début du chargement

    if (!token) {
      logout();
      toast.error('Vous devez vous connecter pour accéder à cette page, vous allez être redirigé vers la page de connexion');
      
      setTimeout(() => {
        navigate('/login');
        setLoading(false); // Fin du chargement après la redirection
      }, 3000); // Attend 3 secondes avant de rediriger
    } else {
      onConnect(token);
      setLoading(false); // Fin du chargement après l'appel de onConnect
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 flex flex-col items-center justify-center p-6">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 bg-white p-12 rounded-lg shadow-lg mx-auto text-center max-w-md">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8">
          🎮 After Party
        </h1>
        <button
          onClick={handleConnect}
          className={`w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg rounded-lg hover:shadow-lg transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Connexion à After Party"}
        </button>
      </div>
    </div>
  );
};

export default Connect;
