// Modal.js
import React from 'react';

function Modal({ isOpen, children, onClose }) {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button onClick={onClose}>Close</button>
          {children}
        </div>
      </div>
    );
  }
  

export default Modal;
