import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";
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
  const { logout } = useAuth();
  const connectWebSocket = (token) => {
    try {
      socketRef.current = new WebSocket(url);

      socketRef.current.onopen = () => {
        socketRef.current.send(JSON.stringify({ type: "start", token }));
      };

      socketRef.current.onmessage = (event) => {
        const parsedMessage = JSON.parse(event.data);
        console.log("Message reçu :", parsedMessage);
        const {
          type,
          message,
          info,
          rooms,
          users,
          room,
          correctAnswer,
          disconnect,
        } = parsedMessage;

        switch (type) {
          case "system":
            if (message.includes("Bienvenue") && info) {
              setCurrentUser(info);
              setConnected(true);
              toast.success(message);
            } else if (disconnect) {
              toast.error(message);
              localStorage.removeItem("authToken");
              setConnected(false);
            } else if (message.includes("Un utilisateur a terminé! Vos réponses vont être collectées.")) {
              console.log(room);
              setCurrentRoom(room);
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

      socketRef.current.onerror = (error) => {
        console.error("Erreur WebSocket:", error);
        toast.error("Une erreur est survenue lors de la connexion au serveur.");
      };

      socketRef.current.onclose = (event) => {
        console.warn(
          `WebSocket fermé avec le code : ${event.code}, raison : ${event.reason}`
        );
        setCurrentRoom(null);
        setCurrentUser(null);
        setConnected(false);
        toast.error("Déconnexion");
      };
    } catch (error) {
      console.error("Exception lors de l'initialisation du WebSocket :", error);
      toast.error("Impossible de se connecter au serveur WebSocket.");
    }
  };

  const sendMessage = (message) => {
    if (socketRef.current && message) {
      socketRef.current.send(
        JSON.stringify({
          type: "message",
          message,
          user: currentUser.id,
          roomId: currentRoom.id,
        })
      );
    }
  };

  const createRoom = (roomName) => {
    if (socketRef.current && roomName) {
      socketRef.current.send(
        JSON.stringify({
          type: "createRoom",
          room: roomName,
          owner: currentUser.id,
        })
      );
    }
  };

  const joinRoom = (roomId) => {
    if (socketRef.current && roomId) {
      socketRef.current.send(
        JSON.stringify({
          type: "joinRoom",
          roomId: roomId,
          user: currentUser.id,
        })
      );
    }
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: "leaveRoom",
          user: currentUser.id,
          roomId: currentRoom.id,
        })
      );
      setCurrentRoom(null);
    }
  };

  const startQuiz = (typeQuestion, numberQuestion, difficulty) => {
    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: "startQuiz",
          roomId: currentRoom.id,
          user: currentUser.id,
          typeQuestion: typeQuestion,
          numberQuestion: numberQuestion,
          difficulty: difficulty,
        })
      );
      toast.info("Quiz va démarrer!");
    }
  };

  const answerQuiz = (answerIndex) => {
    if (socketRef.current && answerIndex !== undefined) {
      const responseTime = Date.now() - answerTime; // Calcul du temps écoulé depuis le début de la question
      socketRef.current.send(
        JSON.stringify({
          type: "submitAnswer",
          answer: answerIndex,
          responseTime,
          roomId: currentRoom.id,
          user: currentUser.id,
        })
      );
      setAnswerTime(0); // Réinitialiser le temps de réponse
    }
  };
  const startBacGame = (timeLimit) => {
    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: "startBacGame",
          roomId: currentRoom.id,
          user: currentUser.id,
          timeLimit: timeLimit,
        })
      );
    }
  };
  const submitBacResponses = (responses, autoSubmit) => {
    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: "submitBacResponse",
          roomId: currentRoom.id,
          user: currentUser.id,
          responses,
          autoSubmit,
        })
      );
    }
  };

  const disconnectWebSocket = () => {
    if (socketRef.current) {
      logout();
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
    startBacGame,
    submitBacResponses,
    disconnectWebSocket,
  };
};

export default useWebSocket;
