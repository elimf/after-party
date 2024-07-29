import React, { useState } from 'react';
import Modal from 'react-modal';
import '../style/RoomManager.css'; // Assurez-vous d'importer le fichier CSS

Modal.setAppElement('#root'); // Assurez-vous d'indiquer l'élément racine de votre application

const RoomManager = ({ rooms, onCreateRoom, onJoinRoom }) => {
  const [room, setRoom] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateRoom = () => {
    if (room.trim() === '') {
      setError('Le nom de la salle ne peut pas être vide');
    } else {
      setError('');
      onCreateRoom(room);
      setRoom('');
      closeModal();
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="room-manager-container">
      <div className="room-list-section">
        <h2>Rooms Disponibles</h2>
        <ul className="room-list">
          {rooms.map((room) => (
            <li key={room.id} className="room-list-item">
              {room.name} <button onClick={() => onJoinRoom(room.id)}>Rejoindre la room</button>
            </li>
          ))}
        </ul>
        <button onClick={openModal} className="create-room-button">
          Créer une room
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Créer une nouvelle salle"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2 className="create-room-title">Création de Room</h2>
          <input
            type="text"
            placeholder="Entrer le nom de la salle"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="create-room-input"
          />
          {error && <div className="create-room-error">{error}</div>}
          <button
            onClick={handleCreateRoom}
            className="create-room-button"
            disabled={room.trim() === ''}
          >
            Créer une room
          </button>
          <button onClick={closeModal} className="modal-close-button">
            Fermer
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default RoomManager;
