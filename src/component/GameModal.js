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
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div className="card">
        {/* Header */}
        <h2 className="text-2xl font-bold  mb-6">
          {title}
        </h2>

        {/* Options */}
        <div className="space-y-4 mb-6">
          {options.map((option, index) => (
            <div key={index}>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {option.label}
              </label>
              <select
                value={values[index]}
                onChange={(e) => setValues(index, e.target.value)}
                className="input w-full"
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
            className="btn btn-primary flex-1 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {startButtonText}
          </button>
          <button
            onClick={onRequestClose}
            className="btn btn-danger flex-1 font-semibold"
          >
            Annuler
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GameModal;
