import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./hooks/ProtectedRoute";
import { AuthProvider } from "./hooks/AuthContext";
import useSpotifyAssociate from "./hooks/useSpotifyAssociate";
import MainPage from "./screen/MainPage";
import Login from "./screen/Login";
import Register from "./screen/Register";
import NotFound from "./screen/NotFound";

function AppContent() {
  // Handle Spotify OAuth callback
  useSpotifyAssociate();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute element={<MainPage />} />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
