import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const useWebSocket = (url) => {
  const [connected, setConnected] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [answerTime, setAnswerTime] = useState(0); // Temps de réponse
  const [quizStarted, setQuizStarted] = useState(false); // Indicateur si le quiz a démarré
  const socketRef = useRef(null);

  const connectWebSocket = (name) => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      socketRef.current.send(JSON.stringify({ type: "setName", name }));
    };

    socketRef.current.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      const { type, message, info, rooms, users,room, correctAnswer } = parsedMessage;

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
          case "currentUser":
            setCurrentUser(info);
            break;
        case "room":
          setCurrentRoom(room);
          break;
        case "rooms":
          setRooms(rooms);
          break;
        case "users":
          setUsers(users);
          break;
        case "question":
          setQuizStarted(true);
          setAnswerTime(Date.now());
          break;
        case "answer":
          toast.info(`Réponse correcte : ${correctAnswer}`);
          break;
        case "endQuiz":
          toast.success("Le quiz est terminé. Scores mis à jour.");
          setQuizStarted(false);
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
      socketRef.current.send(JSON.stringify({ type: "message", message , user: currentUser.id , roomId: currentRoom.id}));
    }
  };

  const createRoom = (roomName) => {
    if (socketRef.current && roomName) {
      socketRef.current.send(
        JSON.stringify({ type: "createRoom", room: roomName, owner: currentUser.id })
      );
      toast.success(`Salle "${roomName}" créée!`);
    }
  };

  const joinRoom = (roomId) => {
    if (socketRef.current && roomId) {
      socketRef.current.send(
        JSON.stringify({ type: "joinRoom", roomId: roomId , user: currentUser.id})
      );
      toast.info("Rejoindre la salle...");
    }
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: "leaveRoom" , user: currentUser.id , roomId: currentRoom.id}));
      setCurrentRoom(null);
    }
  };

  const startQuiz = (typeQuestion, numberQuestion, difficulty) => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: "startQuiz", roomId: currentRoom.id, user: currentUser.id, typeQuestion: typeQuestion, numberQuestion: numberQuestion, difficulty: difficulty }));
      toast.info("Quiz démarré!");
    }
  };

  const answerQuiz = (answerIndex) => {
    if (socketRef.current && answerIndex !== undefined) {
      const responseTime = Date.now() - answerTime; // Calcul du temps écoulé depuis le début de la question
      socketRef.current.send(JSON.stringify({
        type: "submitAnswer",
        answer: answerIndex,
        responseTime,
        roomId: currentRoom.id,
        user: currentUser.id
      }));
      setAnswerTime(0); // Réinitialiser le temps de réponse
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
    quizStarted,
    connectWebSocket,
    sendMessage,
    createRoom,
    joinRoom,
    leaveRoom,
    startQuiz,
    answerQuiz,
    disconnectWebSocket,
  };
};

export default useWebSocket;
