import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./hooks/ProtectedRoute";
import { AuthProvider } from "./hooks/AuthContext";
import MainPage from "./screen/MainPage";
import Login from "./screen/Login";
import Register from "./screen/Register";
import NotFound from "./screen/NotFound";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute element={<MainPage />} />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
