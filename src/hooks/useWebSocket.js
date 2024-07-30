import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const useWebSocket = (url) => {
  const [connected, setConnected] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [quizChoices, setQuizChoices] = useState([]);
  const [quizScores, setQuizScores] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const socketRef = useRef(null);

  const connectWebSocket = (name) => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      socketRef.current.send(JSON.stringify({ type: "setName", name }));
    };

    socketRef.current.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      const { type, message, info, rooms, users, question, choices, scores, room } = parsedMessage;
    
      switch (type) {
        case "system":
          if (message.includes("Bienvenue") && info) {
            setCurrentUser(info);
            setConnected(true);
            toast.success(message);
          } else {
            toast.info(message);
          }
          break;
        case "room":
          console.log(room);
          setCurrentRoom({room});
          break;
        case "rooms":
          setRooms(rooms);
          break;
    
        case "users":
          setUsers(users);
          break;
    
        case "quizQuestion":
          setQuizQuestion(question);
          setQuizChoices(choices);
          break;
    
        case "quizEnd":
          setQuizScores(scores);
          toast.success("Quiz ended. Scores updated.");
          break;
    
        default:
          break;
      }
    };
    

    socketRef.current.onclose = () => {
      setCurrentRoom(null);
      setCurrentUser(null);
      setConnected(false);
      toast.error("Déconnexion");
    };
  };

  const sendMessage = (message) => {
    if (socketRef.current && message) {
      socketRef.current.send(JSON.stringify({ type: "message", message , user: currentUser.id , roomId: currentRoom.room.id}));
    }
  };

  const createRoom = (roomName) => {
    if (socketRef.current && roomName) {
      socketRef.current.send(
        JSON.stringify({ type: "createRoom", room: roomName, owner: currentUser.id })
      );
      toast.success(`Room "${roomName}" créee!`);
    }
  };

  const joinRoom = (roomId) => {
    if (socketRef.current && roomId) {
      socketRef.current.send(
        JSON.stringify({ type: "joinRoom", roomId: roomId , user: currentUser.id})
      );
      console.log(currentUser.id);
      console.log(roomId);
      toast.info("Joining room...");
    }
  };

  const startQuiz = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: "startQuiz" }));
      toast.info("Quiz started!");
    }
  };

  const answerQuiz = (answer) => {
    if (socketRef.current && answer) {
      socketRef.current.send(JSON.stringify({ type: "answerQuiz", answer }));
    }
  };

  const disconnectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  useEffect(() => {
    if (connected) {
      socketRef.current.send(JSON.stringify({ type: "getRooms" }));
      socketRef.current.send(JSON.stringify({ type: "getUsers" }));
    }
  }, [connected]);

  return {
    connected,
    currentUser,
    currentRoom,
    rooms,
    users,
    quizQuestion,
    quizChoices,
    quizScores,
    connectWebSocket,
    sendMessage,
    createRoom,
    joinRoom,
    startQuiz,
    answerQuiz,
    disconnectWebSocket,
  };
};

export default useWebSocket;
