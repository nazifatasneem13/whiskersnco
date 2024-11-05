import React from "react";
import "./MessageModal.scss";

const MessageModal = ({ isOpen, onClose, close, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-button-container">
          <button onClick={onClose} className="modal-button">
            Go to login
          </button>
          <button onClick={close} className="modal-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
