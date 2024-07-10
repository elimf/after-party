"use client";

import { useState } from 'react';
import Modal from '../../components/Modal';
import { useRouter } from 'next/navigation';

const Home = () => {
    const router = useRouter();
    const [rooms, setRooms] = useState<string[]>([]); // Liste des groupes existants
    const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateRoom = (roomName: string) => {
    const newRooms = [...rooms, roomName];
    setRooms(newRooms);
    router.push(`/room/${encodeURIComponent(roomName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Existing Rooms</h1>
      <div className="flex flex-wrap justify-center">
        {rooms.map((room, index) => (
          <div key={index} className="m-2 p-4 bg-white shadow-md rounded-md">
            <p className="text-lg font-semibold text-gray-800">{room}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-8 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Create New Room
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(roomName) => handleCreateRoom(roomName)}
      />
    </div>
  );
};

export default Home;
