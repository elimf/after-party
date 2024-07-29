import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

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
        toast.info(parsedMessage.message); // Affiche les messages système en tant que toast
      } else if (parsedMessage.type === 'message') {
        setMessages((prevMessages) => [...prevMessages, { from: parsedMessage.from, message: parsedMessage.message }]);
      } else if (parsedMessage.type === 'rooms') {
        setRooms(parsedMessage.rooms);
        toast.success('Rooms list updated'); // Affiche une notification lorsque les rooms sont mises à jour
      }
    };

    socketRef.current.onclose = () => {
      console.log('Disconnected from the server');
      setConnected(false);
      toast.error('Disconnected from the server'); // Affiche une notification lorsque la connexion est fermée
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
      toast.success(`Room "${roomName}" created`); // Affiche une notification lorsque la room est créée
    }
  };

  const joinRoom = (roomId) => {
    if (socketRef.current && roomId) {
      socketRef.current.send(JSON.stringify({ type: 'joinRoom', roomId }));
      toast.info('Joining room...'); // Affiche une notification lorsque vous rejoignez une room
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
