"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // URL de votre serveur WebSocket

interface Message {
  id: string;
  text: string;
}

const Room = (): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomName = searchParams.get('roomName') ?? '';
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (roomName) {
      socket.emit('joinRoom', { roomName, role: 'player' });

      socket.on('joinedRoom', (data: { roomName: string; role: string }) => {
        console.log(`Joined room ${data.roomName} with role ${data.role}`);
      });

      socket.on('playerJoined', (data: { id: string; role: string }) => {
        console.log(`Player ${data.id} joined with role ${data.role}`);
      });

      socket.on('playerLeft', (data: { id: string }) => {
        console.log(`Player ${data.id} left`);
      });

      socket.on('newMessage', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.emit('leaveRoom', roomName);
        socket.off('joinedRoom');
        socket.off('playerJoined');
        socket.off('playerLeft');
        socket.off('newMessage');
      };
    }
  }, [roomName]);

  const sendMessage = (message: string): void => {
    socket.emit('chatMessage', message);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Room: {roomName}</h1>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg.text}</li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    </div>
  );
}

export default Room;
