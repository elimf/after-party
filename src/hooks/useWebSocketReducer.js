import { useState, useRef, useEffect, useReducer } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const initialState = {
  connected: false,
  rooms: [],
  currentRoom: null,
  users: [],
  currentUser: null,
  answerTime: 0,
  quizStarted: false,
  bacResults: null,
};

function wsReducer(state, action) {
  switch (action.type) {
    case "SET_CONNECTED":
      return { ...state, connected: action.payload };
    case "SET_ROOMS":
      return { ...state, rooms: action.payload || [] };
    case "SET_CURRENT_ROOM":
      return { ...state, currentRoom: action.payload };
    case "SET_USERS":
      return { ...state, users: action.payload || [] };
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };
    case "SET_ANSWER_TIME":
      return { ...state, answerTime: action.payload };
    case "SET_QUIZ_STARTED":
      return { ...state, quizStarted: action.payload };
    case "SET_BAC_RESULTS":
      return { ...state, bacResults: action.payload };
    case "RESET_GAME_STATE":
      return { ...state, bacResults: null, quizStarted: false, answerTime: 0 };
    case "DISCONNECT":
      return { ...initialState };
    default:
      return state;
  }
}

const useWebSocket = (url) => {
  const [state, dispatch] = useReducer(wsReducer, initialState);
  const socketRef = useRef(null);
  const { logout } = useAuth();

  const connectWebSocket = (token) => {
    try {
      socketRef.current = new WebSocket(url);

      socketRef.current.onopen = () => {
        socketRef.current.send(JSON.stringify({ type: "start", token }));
      };

      socketRef.current.onmessage = (event) => {
        let parsedMessage;
        try {
          parsedMessage = JSON.parse(event.data);
        } catch (e) {
          console.error("Invalid WS message", e);
          return;
        }

        const {
          type,
          message,
          info,
          rooms,
          users,
          room,
          correctAnswer,
          disconnect,
          summary,
          scores,
        } = parsedMessage;

        switch (type) {
          case "system":
            if (typeof message === "string" && message.includes("Bienvenue") && info) {
              dispatch({ type: "SET_CURRENT_USER", payload: info });
              dispatch({ type: "SET_CONNECTED", payload: true });
              toast.success(message);
            } else if (disconnect) {
              toast.error(message);
              localStorage.removeItem("authToken");
              dispatch({ type: "DISCONNECT" });
            } else if (
              typeof message === "string" &&
              message.includes("Un utilisateur a terminé! Vos réponses vont être collectées.")
            ) {
              dispatch({ type: "SET_CURRENT_ROOM", payload: room });
            } else {
              toast.info(message);
            }
            break;
          case "reconnect":
            dispatch({ type: "SET_CURRENT_USER", payload: info });
            dispatch({ type: "SET_CONNECTED", payload: true });
            dispatch({ type: "SET_CURRENT_ROOM", payload: room || null });
            break;
          case "currentUser":
            dispatch({ type: "SET_CURRENT_USER", payload: info });
            break;
          case "room":
            dispatch({ type: "SET_CURRENT_ROOM", payload: room });
            if (room?.bacGame?.phase === "playing") {
              dispatch({ type: "SET_BAC_RESULTS", payload: null });
            }
            break;
          case "rooms":
            dispatch({ type: "SET_ROOMS", payload: rooms });
            break;
          case "users":
            dispatch({ type: "SET_USERS", payload: users });
            break;
          case "question":
            dispatch({ type: "SET_QUIZ_STARTED", payload: true });
            dispatch({ type: "SET_ANSWER_TIME", payload: Date.now() });
            break;
          case "answer":
            toast.info(`Réponse correcte : ${correctAnswer}`);
            break;
          case "endQuiz":
            toast.success("Le quiz est terminé. Scores mis à jour.");
            dispatch({ type: "SET_QUIZ_STARTED", payload: false });
            break;
          case "bacResults":
            dispatch({
              type: "SET_BAC_RESULTS",
              payload: {
                summary,
                scores,
                letter: parsedMessage.letter,
                fromTimeout: parsedMessage.fromTimeout,
              },
            });
            toast.success("Manche Petit Bac terminée.");
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
        dispatch({ type: "DISCONNECT" });
        toast.error("Déconnexion");
      };
    } catch (error) {
      console.error("Exception lors de l'initialisation du WebSocket :", error);
      toast.error("Impossible de se connecter au serveur WebSocket.");
    }
  };

  const sendMessage = (message) => {
    if (socketRef.current && message && state.currentUser && state.currentRoom) {
      socketRef.current.send(
        JSON.stringify({
          type: "message",
          message,
          user: state.currentUser.id,
          roomId: state.currentRoom.id,
        })
      );
    }
  };

  const createRoom = (roomName) => {
    if (socketRef.current && roomName && state.currentUser) {
      socketRef.current.send(
        JSON.stringify({
          type: "createRoom",
          room: roomName,
          owner: state.currentUser.id,
        })
      );
    }
  };

  const joinRoom = (roomId) => {
    if (socketRef.current && roomId && state.currentUser) {
      socketRef.current.send(
        JSON.stringify({
          type: "joinRoom",
          roomId: roomId,
          user: state.currentUser.id,
        })
      );
    }
  };

  const leaveRoom = () => {
    if (socketRef.current && state.currentUser && state.currentRoom) {
      socketRef.current.send(
        JSON.stringify({
          type: "leaveRoom",
          user: state.currentUser.id,
          roomId: state.currentRoom.id,
        })
      );
      dispatch({ type: "SET_CURRENT_ROOM", payload: null });
      dispatch({ type: "SET_BAC_RESULTS", payload: null });
    }
  };

  const startQuiz = (typeQuestion, numberQuestion, difficulty, musicSource, sourceId) => {
    if (socketRef.current && state.currentRoom && state.currentUser) {
      const message = {
        type: "startQuiz",
        roomId: state.currentRoom.id,
        user: state.currentUser.id,
        typeQuestion: typeQuestion,
        numberQuestion: numberQuestion,
        difficulty: difficulty,
      };

      if (typeQuestion === "Blindtest" && musicSource) {
        message.musicSource = musicSource;
        message.sourceId = sourceId;
      }

      socketRef.current.send(JSON.stringify(message));
      toast.info("Quiz va démarrer!");
    }
  };

  const answerQuiz = (answerIndex) => {
    if (socketRef.current && answerIndex !== undefined && state.currentRoom && state.currentUser) {
      const responseTime = Date.now() - state.answerTime;
      socketRef.current.send(
        JSON.stringify({
          type: "submitAnswer",
          answer: answerIndex,
          responseTime,
          roomId: state.currentRoom.id,
          user: state.currentUser.id,
        })
      );
      dispatch({ type: "SET_ANSWER_TIME", payload: 0 });
    }
  };

  const startBacGame = (timeLimit) => {
    if (socketRef.current && state.currentRoom && state.currentUser) {
      socketRef.current.send(
        JSON.stringify({
          type: "startBacGame",
          roomId: state.currentRoom.id,
          user: state.currentUser.id,
          timeLimit: timeLimit,
        })
      );
      dispatch({ type: "SET_BAC_RESULTS", payload: null });
    }
  };

  const submitBacResponses = (responses, autoSubmit) => {
    if (socketRef.current && state.currentRoom && state.currentUser) {
      socketRef.current.send(
        JSON.stringify({
          type: "submitBacResponse",
          roomId: state.currentRoom.id,
          user: state.currentUser.id,
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
    if (state.connected && socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: "getRooms" }));
      socketRef.current.send(JSON.stringify({ type: "getUsers" }));
    }
  }, [state.connected]);

  return {
    connected: state.connected,
    currentUser: state.currentUser,
    currentRoom: state.currentRoom,
    rooms: state.rooms,
    users: state.users,
    quizStarted: state.quizStarted,
    bacResults: state.bacResults,
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
