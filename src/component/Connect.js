import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/Connect.css';

const Connect = ({ onConnect }) => {
  const [name, setName] = useState('');

  const handleConnect = () => {
    if (name.trim() === '') {
      toast.error('Votre nom ne peut pas être vide');
    } else {
      onConnect(name);
    }
  };

  return (
    <div className="connect-container">
      <h1 className="title">After Party</h1>
      <input
        type="text"
        placeholder="Entrer votre nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="connect-input"
      />
      <button onClick={handleConnect} className="connect-button">
        Connect
      </button>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Connect;
