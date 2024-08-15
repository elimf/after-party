import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const { login } = useAuth();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true); // Début du chargement

    try {
      const response = await axios.post(
        `${apiUrl}/auth/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        login();
        navigate("/");
      } else {
        setError("Vérifiez vos informations de connexion");
      }
    } catch (err) {
      if (err.response) {
        console.error('Error Response:', err.response);
        setError(`Une erreur est survenue : ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        console.error('Error Request:', err.request);
        setError('Aucune réponse reçue du serveur.');
      } else {
        console.error('Error Message:', err.message);
        setError(`Une erreur est survenue : ${err.message}`);
      }
    } finally {
      setLoading(false); // Fin du chargement
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
            className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading} // Désactive le bouton pendant le chargement
          >
            {loading ? "Connexion en cours..." : "Connexion"} {/* Affiche un texte différent pendant le chargement */}
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
