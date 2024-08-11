import React from "react";
import Modal from "react-modal";

const GameModal = ({
  isOpen,
  onRequestClose,
  title,
  options,
  values,
  setValues,
  onStart,
  startButtonText,
  disableStartButton,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      className="modal max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg"
      overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50"
    >
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {options.map((option, index) => (
        <div key={index} className="mb-4">
          <h2 className="text-2xl font-semibold mb-4">{option.label}</h2>
          <select
            value={values[index]}
            onChange={(e) => setValues(index, e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full"
          >
            <option value="">Sélectionner</option>
            {option.choices.map((choice, i) => (
              <option key={i} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      <div className="flex gap-4">
        <button
          onClick={onStart}
          disabled={disableStartButton}
          className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          {startButtonText}
        </button>
        <button
          onClick={onRequestClose}
          className="btn btn-secondary bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
        >
          Annuler
        </button>
      </div>
    </Modal>
  );
};

export default GameModal;
