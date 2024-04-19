// Modal.js
import React from 'react';

function Modal({ isOpen, children, onClose }) {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
        <button onClick={onClose} className="close-button">X</button>
          {children}
        </div>
      </div>
    );
  }
  

export default Modal;
