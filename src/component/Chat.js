import React, { useState } from 'react';
import '../style/Chat.css'; // Assurez-vous que le chemin est correct

const Chat = ({ messages, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <ul className="chat-message-list">
        {messages.map((msg, index) => (
          <li key={index} className="chat-message-item">
            <strong>{msg.from}:</strong> <span>{msg.message}</span>
          </li>
        ))}
      </ul>
      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chat-input"
        />
        <button onClick={handleSendMessage} className="chat-send-button">
          Send Message
        </button>
      </div>
    </div>
  );
};

export default Chat;
