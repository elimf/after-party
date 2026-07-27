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
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 space-y-8">
        {/* Rooms Section */}
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                🎮 Salles Disponibles
              </h2>
              <p className="text-gray-600 mt-1">
                {rooms.length} salle{rooms.length !== 1 ? "s" : ""} ouverte
                {rooms.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={openModal}
              disabled={!isButtonDisabled}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ➕ Nouvelle Salle
            </button>
          </div>

          {rooms.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center py-12">
              <p className="text-2xl mb-2">📭</p>
              <p className="text-gray-700">Aucune salle disponible</p>
              <p className="text-sm text-gray-600 mt-1">
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
                    className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 border-l-4 ${inGame ? "border-l-yellow-500 opacity-75" : "border-l-purple-600"} transition hover:shadow-lg`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h2 className="font-bold text-gray-900 text-lg">
                          {r.name}
                        </h2>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
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
                        className={`whitespace-nowrap ml-4 px-4 py-2 rounded-lg font-semibold transition ${
                          inGame
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-300"
                            : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg"
                        }`}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              👥 Joueurs Connectés ({users.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        user.id === currentUser.id
                          ? "bg-gradient-to-r from-purple-600 to-blue-600"
                          : "bg-gray-400"
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      {user.id === currentUser.id && (
                        <span className="text-xs font-medium text-purple-600">
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
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ➕ Créer une Salle
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nom de la salle
              </label>
              <input
                autoFocus
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition"
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
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer
              </button>
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 border border-gray-300 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
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
