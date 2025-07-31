import React from 'react';
import Chat from './Chat';
import './ChatModal.css';

const ChatModal = ({ isOpen, onClose, userType, userId }) => {
  if (!isOpen) return null;

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal-content">
        <Chat 
          userType={userType} 
          userId={userId} 
          onClose={onClose} 
        />
      </div>
    </div>
  );
};

export default ChatModal;
