import React from "react";
import Modal from "react-modal";
import "../styles/theme.css";

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
      className="fixed inset-0 m-auto w-full max-w-md p-4 z-50"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {title}
        </h2>

        {/* Options */}
        <div className="space-y-4 mb-6">
          {options.map((option, index) => (
            <div key={index}>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {option.label}
              </label>
              <select
                value={values[index]}
                onChange={(e) => setValues(index, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition"
              >
                <option value="">-- Sélectionner --</option>
                {option.choices.map((choice, i) => (
                  <option key={i} value={choice.value}>
                    {choice.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onStart}
            disabled={disableStartButton}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {startButtonText}
          </button>
          <button
            onClick={onRequestClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 border border-gray-300 font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Annuler
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GameModal;
