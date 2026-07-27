import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../styles/theme.css";

Modal.setAppElement("#root");

const Waiting = ({ rooms, users, onCreateRoom, onJoinRoom, currentUser }) => {
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const isUserOwner =
      rooms.length > 0 && rooms.some((r) => r.ownerId === currentUser.id);
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

  const isRoomInGame = (r) =>
    r.quiz?.isRunning || r.bacGame?.isRunning || r.bacGame?.isVoting;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container py-8 space-y-8">
        {/* Rooms Section */}
        <div className="fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">
                🎮 Salles Disponibles
              </h2>
              <p className="text-neutral-500 mt-1">
                {rooms.length} salle{rooms.length !== 1 ? "s" : ""} ouverte
                {rooms.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={openModal}
              disabled={!isButtonDisabled}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ➕ Nouvelle Salle
            </button>
          </div>

          {rooms.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-2xl mb-2">📭</p>
              <p className="text-neutral-600">Aucune salle disponible</p>
              <p className="text-sm text-neutral-500 mt-1">
                Créez la première salle pour commencer!
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {rooms.map((r) => {
                const inGame = isRoomInGame(r);
                return (
                  <div
                    key={r.id}
                    className={`card border-l-4 ${inGame ? "border-l-yellow-500 opacity-75" : "border-l-primary"} transition`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-neutral-900 text-lg">
                          {r.name}
                        </h3>
                        <div className="flex gap-4 mt-2 text-sm text-neutral-500">
                          <span>
                            👤 {r.users?.length || 0} joueur
                            {(r.users?.length || 0) > 1 ? "s" : ""}
                          </span>
                          {inGame && (
                            <span className="text-yellow-600 font-medium">
                              ⚡ Partie en cours
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onJoinRoom(r.id)}
                        disabled={inGame}
                        className={`${
                          inGame
                            ? "btn btn-secondary text-gray-400 cursor-not-allowed"
                            : "btn btn-primary"
                        } whitespace-nowrap ml-4`}
                      >
                        {inGame ? "Occupée" : "Rejoindre"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Users Section */}
        {users.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              👥 Joueurs Connectés ({users.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div key={user.id} className="card">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        user.id === currentUser.id
                          ? "bg-gradient-to-r from-primary to-secondary"
                          : "bg-neutral-400"
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">
                        {user.name}
                      </p>
                      {user.id === currentUser.id && (
                        <span className="text-xs font-medium text-primary">
                          ✓ Vous
                        </span>
                      )}
                    </div>

                    {/* Status Indicator */}
                    <div
                      className={`w-3 h-3 rounded-full ${
                        user.id === currentUser.id
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Créer une nouvelle salle"
        className="fixed inset-0 m-auto w-full max-w-md p-4 z-50"
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
      >
        <div className="card">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            ➕ Créer une Salle
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Nom de la salle
              </label>
              <input
                autoFocus
                type="text"
                className="input"
                placeholder="ex: Soirée jeux"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCreateRoom}
                disabled={room.trim() === ""}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer
              </button>
              <button onClick={closeModal} className="btn btn-danger  flex-1">
                Annuler
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Waiting;
