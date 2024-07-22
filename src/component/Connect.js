import React, { useState } from 'react';

const Connect = ({ onConnect }) => {
  const [name, setName] = useState('');

  const handleConnect = () => {
    onConnect(name);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
};

export default Connect;
