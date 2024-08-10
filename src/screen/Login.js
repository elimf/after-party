import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Importer Link pour la navigation

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json', // Specify the content type of the request
          'Accept': 'application/json',       // Specify the expected response type
        }
      });

      if (response.data.token) {
        // Stockez le token dans le stockage local ou un autre mécanisme de stockage
        localStorage.setItem("authToken", response.data.token);
        login();
        navigate("/");
      } else {
        setError("Vérifiez vos informations de connexion");
      }
    } catch (err) {
      // Check if err.response exists to get more specific error information
      if (err.response) {
        // Server responded with a status other than 2xx
        console.error('Error Response:', err.response);
        setError(`Une erreur est survenue : ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        // Request was made but no response received
        console.error('Error Request:', err.request);
        setError('Aucune réponse reçue du serveur.'+ apiUrl);
      } else {
        // Something else caused the error
        console.error('Error Message:', err.message);
        setError(`Une erreur est survenue : ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded mt-1 text-sm"
              placeholder="Entrer votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium">
              Mot de passe
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded mt-1 text-sm"
              placeholder="Entrer votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Connexion
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
