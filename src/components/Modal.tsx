import React from 'react'
import "../styles/Modal.css"

interface Props {
  showModal: boolean;
  closeModal: () => void;
};

const Modal: React.FC<Props> = ({ showModal, closeModal }) => { 

  if (!showModal) {
    return null;
  }

  return (
    <div id="modal">
      <h2>Modal Window</h2>
      <div id="content">
        Place holder place holder Place holder place holder Place holder place holder Place holder place holder Place holder place holder Place holder place holder
      </div>
      <div id="actions">
        <button id="toggle-button" onClick={closeModal}>
          close
        </button>
      </div>
    </div>
  );
}

export default Modal