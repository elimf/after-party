import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Importer Link pour la navigation

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !username) {
      setError("Tous les champs doivent être remplis.");
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Le mot de passe et la confirmation du mot de passe ne correspondent pas."
      );
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/register`, {
        email,
        password,
        username,
      });

      if (response.status === 201) {
        navigate("/login");
      } else if (response.status === 400) {
        setError("Email déjà utilisé");
      } else {
        setError("Inscription échouée");
      }
    } catch (err) {
        setError("Une erreur est survenue : "+err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium">
              Pseudo
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded mt-1 text-sm"
              placeholder="Entrer votre pseudo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <div className="mb-4">
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
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded mt-1 text-sm"
              placeholder="Confirmer votre mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Inscription
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Connectez-vous
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
