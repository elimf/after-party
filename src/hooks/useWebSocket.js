import { useState, useRef, useEffect } from 'react';

const useWebSocket = (url) => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const socketRef = useRef(null);

  const connectWebSocket = (name) => {
    socketRef.current = new WebSocket(url);

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

  const sendMessage = (message) => {
    if (socketRef.current && message) {
      socketRef.current.send(JSON.stringify({ type: 'message', message }));
    }
  };

  const createRoom = (roomName) => {
    if (socketRef.current && roomName) {
      socketRef.current.send(JSON.stringify({ type: 'createRoom', room: roomName }));
    }
  };

  const joinRoom = (roomId) => {
    if (socketRef.current && roomId) {
      socketRef.current.send(JSON.stringify({ type: 'joinRoom', roomId }));
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

  return {
    connected,
    messages,
    rooms,
    connectWebSocket,
    sendMessage,
    createRoom,
    joinRoom,
    disconnectWebSocket,
  };
};

export default useWebSocket;
