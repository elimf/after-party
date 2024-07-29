import React, { useState, useRef, useEffect } from 'react';
import Connect from './component/Connect';
import CreateRoom from './component/CreateRoom';
import RoomList from './component/RoomList';
import Chat from './component/Chat';

const App = () => {
  const [connected, setConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const socketRef = useRef(null);

  const connectWebSocket = (name) => {
    socketRef.current = new WebSocket('ws://localhost:3000');

    socketRef.current.onopen = () => {
      console.log('Connected to the server');
      setConnected(true);
      socketRef.current.send(JSON.stringify({ type: 'setName', name }));
    };

    socketRef.current.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      if (parsedMessage.type === 'system') {
        console.log(parsedMessage.message);
      } else if (parsedMessage.type === 'message') {
        setMessages((prevMessages) => [...prevMessages, { from: parsedMessage.from, message: parsedMessage.message }]);
      } else if (parsedMessage.type === 'rooms') {
        setRooms(parsedMessage.rooms);
      }
    };

    socketRef.current.onclose = () => {
      console.log('Disconnected from the server');
      setConnected(false);
    };
  };

  const createRoom = (roomName) => {
    if (socketRef.current && roomName) {
      socketRef.current.send(JSON.stringify({ type: 'createRoom', room: roomName }));
      setCurrentRoom(roomName);
    }
  };

  const joinRoom = (roomId) => {
    if (socketRef.current && roomId) {
      socketRef.current.send(JSON.stringify({ type: 'joinRoom', roomId }));
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        setCurrentRoom(room.name);
      }
    }
  };

  const sendMessage = (message) => {
    if (socketRef.current && message) {
      socketRef.current.send(JSON.stringify({ type: 'message', message }));
    }
  };

  const disconnectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  useEffect(() => {
    if (connected) {
      socketRef.current.send(JSON.stringify({ type: 'getRooms' }));
    }
  }, [connected]);

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
        <div className="left-panel">
          <CreateRoom onCreateRoom={createRoom} />
          <RoomList rooms={rooms} onJoinRoom={joinRoom} />
        </div>
      )}
      {connected && currentRoom && (
        <div className="chat-container">
          <Chat messages={messages} onSendMessage={sendMessage} />
          <h2>Room: {currentRoom}</h2>
        </div>
      )}
    </div>
  </div>
  );
};

export default App;
