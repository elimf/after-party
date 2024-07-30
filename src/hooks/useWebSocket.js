import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const useWebSocket = (url) => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [quizChoices, setQuizChoices] = useState([]);
  const [quizScores, setQuizScores] = useState([]);
  const socketRef = useRef(null);

  const connectWebSocket = (name) => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      socketRef.current.send(JSON.stringify({ type: "setName", name }));
    };

    socketRef.current.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      if (parsedMessage.type === "system") {
        if (parsedMessage.message.includes("Welcome")) {
          setConnected(true);
          toast.success(parsedMessage.message);
        } else {
          toast.info(parsedMessage.message);
        }
      } else if (parsedMessage.type === "message") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { from: parsedMessage.from, message: parsedMessage.message },
        ]);
      } else if (parsedMessage.type === "rooms") {
        setRooms(parsedMessage.rooms);
        toast.success("Room list updated");
      } else if (parsedMessage.type === "users") {
        setUsers(parsedMessage.users);
        toast.success("User list updated");
      } else if (parsedMessage.type === "quizQuestion") {
        setQuizQuestion(parsedMessage.question);
        setQuizChoices(parsedMessage.choices);
      } else if (parsedMessage.type === "quizEnd") {
        setQuizScores(parsedMessage.scores);
        toast.success("Quiz ended. Scores updated.");
      }
    };

    socketRef.current.onclose = () => {
      setConnected(false);
      toast.error("Disconnected from server");
    };
  };

  const sendMessage = (message) => {
    if (socketRef.current && message) {
      socketRef.current.send(JSON.stringify({ type: "message", message }));
    }
  };

  const createRoom = (roomName) => {
    if (socketRef.current && roomName) {
      socketRef.current.send(
        JSON.stringify({ type: "createRoom", room: roomName })
      );
      toast.success(`Room "${roomName}" created`);
    }
  };

  const joinRoom = (roomName) => {
    if (socketRef.current && roomName) {
      socketRef.current.send(JSON.stringify({ type: "joinRoom", room: roomName }));
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
    messages,
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
