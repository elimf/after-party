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
    <div className="flex flex-col h-screen bg-white border-l border-gray-200">
      {/* Liste des utilisateurs */}
      <div className="bg-gray-50 p-4 border-b border-gray-200 overflow-y-auto">
        <h4 className="text-lg font-bold text-gray-900 mb-4">👥 Connectés</h4>
        <ul className="space-y-2">
          {room.users.map((user) => (
            <li
              key={user.id}
              className={`p-3 rounded-lg border transition ${
                user.isOnline
                  ? 'bg-green-50 border-green-200 text-green-900'
                  : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}
            >
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}
              ></span>
              <span className="font-medium">{user.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contenu du chat */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 border-b border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">{room.name}</h2>
        </div>
        <ul className="flex-1 overflow-y-auto p-4 space-y-3">
          {room.messages.map((msg, index) => {
            const date = new Date(msg.createdAt);
            const relativeTime = formatDistanceToNow(date, { addSuffix: true, locale: fr });

            return (
              <li key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <strong className="text-gray-900 font-semibold">{msg.name}</strong>
                    <p className="text-gray-700 mt-1">{msg.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{relativeTime}</span>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <input
            type="text"
            placeholder="Écris ton message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
