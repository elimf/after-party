import React, { useState } from 'react';
import Connect from './component/Connect';
import Chat from './component/Chat';
import RoomManager from './component/RoomManager';
import useWebSocket from './hooks/useWebSocket';
import './App.css'; // Importez votre CSS pour l'application
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [currentRoom, setCurrentRoom] = useState('');
  const {
    connected,
    messages,
    rooms,
    users,
    connectWebSocket,
    sendMessage,
    createRoom,
    joinRoom,
    disconnectWebSocket,
  } = useWebSocket('ws://localhost:3000');

  const handleJoinRoom = (roomId) => {
    joinRoom(roomId);
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setCurrentRoom(room.name);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        {!connected ? (
          <Connect onConnect={connectWebSocket} />
        ) : (
          <button onClick={disconnectWebSocket} className="disconnect-button">Disconnect</button>
        )}
      </div>
      <div className="main-content">
        {connected && !currentRoom && (
            <RoomManager rooms={rooms} users={users} onJoinRoom={handleJoinRoom} onCreateRoom={createRoom} />
        )}
        {connected && currentRoom && (
          <div className="chat-container">
            <h2>Room: {currentRoom}</h2>
            <Chat messages={messages} onSendMessage={sendMessage} />
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default App;
