// Modal.js
import React from 'react';

function Modal({ isOpen, children, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '600px', width: '90%', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>X</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
