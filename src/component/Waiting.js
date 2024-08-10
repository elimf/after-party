import React, { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Ensure the root element is specified

const Waiting = ({ rooms, users, onCreateRoom, onJoinRoom, currentUser }) => {
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  useEffect(() => {
    // Vérifie si `rooms` est vide ou si l'utilisateur actuel est propriétaire d'une salle
    const isUserOwner = rooms.length > 0 && rooms.some(room => room.ownerId === currentUser.id);
    // Désactiver le bouton si `rooms` n'est pas vide et l'utilisateur n'est pas propriétaire
    setIsButtonDisabled(!isUserOwner);
  }, [rooms, currentUser.id]);

  const handleCreateRoom = () => {
    if (room.trim() === "") {
      setError("Le nom de la salle ne peut pas être vide");
    } else {
      setError("");
      onCreateRoom(room);
      setRoom("");
      closeModal();
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-4 space-y-4 sm:p-6 lg:p-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold sm:text-2xl lg:text-3xl text-white">
          Salles Disponibles
        </h2>
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="flex flex-col sm:flex-row justify-between items-center p-2 bg-gray-100 rounded-lg shadow-md"
            >
              <span className="font-medium text-lg">{room.name}</span>
              <button
                className="mt-2 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                onClick={() => onJoinRoom(room.id)}
              >
                Rejoindre la salle
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={openModal}
          disabled={!isButtonDisabled}
          className={`w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg 
        hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 
        transition duration-300 ease-in-out ${
          !isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        >
          Créer une salle
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold sm:text-2xl lg:text-3xl text-white">
          Utilisateurs Connectés
        </h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center p-2 bg-gray-100 rounded-lg shadow-md"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  user.id === currentUser.id ? "bg-green-500" : "bg-gray-400"
                } mr-2`}
              ></span>
              <span className="text-base sm:text-lg">{user.name}</span>{" "}
              <i className="text-gray-500">
                {user.id === currentUser.id ? `(Me)` : ""}
              </i>
            </li>
          ))}
        </ul>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Créer une nouvelle salle"
        className="fixed inset-0 m-auto max-w-sm sm:max-w-md lg:max-w-lg w-full p-6 bg-white rounded-lg shadow-lg z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">
            Création de Salle
          </h2>
          <input
            type="text"
            placeholder="Entrer le nom de la salle"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <div className="text-red-500">{error}</div>}
          <button
            onClick={handleCreateRoom}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            disabled={room.trim() === ""}
          >
            Créer une salle de jeu
          </button>
          <button
            onClick={closeModal}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 ease-in-out"
          >
            Fermer
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Waiting;
