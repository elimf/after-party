import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale'; 
import '../style/Chat.css'; // Assurez-vous que le chemin est correct

const Chat = ({ room, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
    <div className='w-100'>
    <h2 className="chat-room-name">{room.name}</h2>
      <ul className="chat-message-list">
      
        {room.messages.map((msg, index) => {
          // Formatage de la date relative
          const date = new Date(msg.createdAt);
          const relativeTime = formatDistanceToNow(date, { addSuffix: true,locale: fr });

          return (
            <li key={index} className="chat-message-item">
              <span className="chat-message-time"> ({relativeTime})</span>
              <strong>{msg.name}:</strong> <span>{msg.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Entre ton message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chat-input"
        />
        <button onClick={handleSendMessage} className="chat-send-button">
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default Chat;
