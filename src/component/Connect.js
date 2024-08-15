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
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-neutral-600 p-12 rounded-lg shadow-lg  mx-auto text-center">
        <h1 className="text-9xl font-cursive text-customYellow mb-8 text-shadow-custom">
          After Party
        </h1>
        <button
          onClick={handleConnect}
          className={`bg-blue-500 text-white text-xl py-4 px-8 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading} // Désactive le bouton pendant le chargement
        >
          {loading ? "Chargement..." : "Connexion à After Party"} {/* Affiche "Chargement..." pendant l'exécution */}
        </button>
      </div>
    </div>
  );
};

export default Connect;
