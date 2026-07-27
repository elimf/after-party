import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/theme.css';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 text-center">
        <div className="card border-0 bg-white/95 backdrop-blur-sm max-w-md">
          {/* 404 Number */}
          <div className="text-8xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            404
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Page non trouvée
          </h2>
          <p className="text-gray-600 mb-8">
            Oups ! La page que vous cherchez n'existe pas ou a été supprimée.
          </p>

          {/* Icon */}
          <div className="text-6xl mb-8">
            🔍
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              to="/"
              className="btn btn-primary flex-1"
            >
              Retour à l'accueil
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary flex-1"
            >
              Retour en arrière
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
