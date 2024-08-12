import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const Chat = ({ room, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-container flex h-full bg-gray-800 text-white shadow-lg">
      {/* Liste des utilisateurs */}
      <div className="users-list bg-gray-900 w-1/3 p-4 border-r border-gray-700 overflow-y-auto">
        <h4 className="text-lg font-semibold mb-4">Utilisateurs Connectés</h4>
        <ul>
          {room.users.map((user) => (
            <li key={user.id} className="user-item mb-2 p-2 bg-gray-700 rounded-lg">
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Contenu du chat */}
      <div className="chat-content flex-1 flex flex-col">
        <div className="chat-header bg-gray-900 p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">{room.name}</h2>
        </div>
        <ul className="chat-message-list flex-1 overflow-y-auto p-4">
          {room.messages.map((msg, index) => {
            // Formatage de la date relative
            const date = new Date(msg.createdAt);
            const relativeTime = formatDistanceToNow(date, { addSuffix: true, locale: fr });

            return (
              <li key={index} className="chat-message-item mb-2 p-2 bg-gray-700 rounded-lg">
                <span className="chat-message-time text-sm text-gray-400"> ({relativeTime})</span>
                <strong className="font-medium">{msg.name}:</strong> <span>{msg.text}</span>
              </li>
            );
          })}
        </ul>
        <div className="chat-input-container p-4 border-t border-gray-700 bg-gray-900 flex items-center">
          <input
            type="text"
            placeholder="Entre ton message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="chat-input flex-1 p-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="chat-send-button ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
