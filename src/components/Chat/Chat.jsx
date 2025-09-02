import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, Phone, Video, MoreVertical, ArrowLeft, Smile } from 'lucide-react';
import './Chat.css';

const Chat = ({ userType, userId, onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchConversations();
    if (userType === 'user') {
      fetchAvailableDoctors();
    }
  }, [userType, userId]);

  // Polling for new messages every 2 seconds when a conversation is selected
  useEffect(() => {
    if (!selectedConversation || !userId) return;
    
    const pollMessages = () => {
      fetchMessages(selectedConversation);
    };
    
    // Initial fetch
    pollMessages();
    
    // Set up polling interval - more frequent for better real-time feel
    const interval = setInterval(pollMessages, 2000);
    
    // Cleanup on unmount or when conversation changes
    return () => clearInterval(interval);
  }, [selectedConversation, userId]);

  // Also poll conversations list to update last messages
  useEffect(() => {
    if (!userId) return;
    
    const pollConversations = () => {
      fetchConversations();
    };
    
    // Poll conversations every 5 seconds to update last messages
    const interval = setInterval(pollConversations, 5000);
    
    return () => clearInterval(interval);
  }, [userId]);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/chat/conversations/${userType}/${userId}`);
      const data = await response.json();
      setConversations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchAvailableDoctors = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/chat/doctors');
      const data = await response.json();
      setAvailableDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchMessages = async (conversation) => {
    try {
      const receiverType = userType === 'user' ? 'doctor' : 'user';
      const response = await fetch(
        `http://127.0.0.1:5000/chat/messages?sender_id=${userId}&receiver_id=${conversation.id}&sender_type=${userType}&receiver_type=${receiverType}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedImage) return;
    if (!selectedConversation) return;

    const formData = new FormData();
    formData.append('content', newMessage);
    formData.append('sender_id', userId);
    formData.append('receiver_id', selectedConversation.id);
    formData.append('sender_type', userType);
    formData.append('receiver_type', userType === 'user' ? 'doctor' : 'user');
    
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/chat/send', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const newMsg = await response.json();
        setMessages(prev => [...prev, { ...newMsg, is_own: true }]);
        setNewMessage('');
        setSelectedImage(null);
        // Update conversation list with new message
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const startNewConversation = (doctor) => {
    const newConversation = {
      id: doctor.id,
      name: doctor.name,
      avatar: doctor.avatar,
      specialty: doctor.specialty,
      type: 'doctor'
    };
    setSelectedConversation(newConversation);
    setMessages([]);
    setShowDoctorList(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="chat-container">
        <div className="chat-loading">
          <div className="loading-spinner"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-header">
          <div className="chat-header-content">
            <h2>Messages</h2>
            <button className="chat-close-btn" onClick={onClose}>
              <ArrowLeft size={20} />
            </button>
          </div>
          {userType === 'user' && (
            <button 
              className="new-chat-btn"
              onClick={() => setShowDoctorList(!showDoctorList)}
            >
              + New Chat
            </button>
          )}
        </div>

        {showDoctorList && userType === 'user' && (
          <div className="doctor-list">
            <h3>Available Doctors</h3>
            {availableDoctors.map(doctor => (
              <div 
                key={doctor.id} 
                className="doctor-item"
                onClick={() => startNewConversation(doctor)}
              >
                <img 
                  src={doctor.avatar} 
                  alt={doctor.name} 
                  className="doctor-avatar"
                  onError={(e) => {
                    e.target.src = 'http://127.0.0.1:5000/assets/default-avatar.svg';
                  }}
                />
                <div className="doctor-info">
                  <div className="doctor-name">{doctor.name}</div>
                  <div className="doctor-specialty">{doctor.specialty}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="conversations-list">
          {conversations.map(conversation => (
            <div 
              key={conversation.id}
              className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedConversation(conversation);
                fetchMessages(conversation);
                setShowDoctorList(false);
              }}
            >
              <div className="avatar-container">
                <img 
                  src={conversation.avatar} 
                  alt={conversation.name} 
                  className="conversation-avatar"
                  onError={(e) => {
                    e.target.src = 'http://127.0.0.1:5000/assets/default-avatar.svg';
                  }}
                />
                {conversation.type === 'user' && !conversation.avatar.includes('default-avatar') && !conversation.avatar.includes('avatar-') && (
                  <div className="photo-indicator" title="User uploaded photo"></div>
                )}
              </div>
              <div className="conversation-info">
                <div className="conversation-name">{conversation.name}</div>
                <div className="conversation-last-message">
                  {conversation.lastMessage || 'Start a conversation'}
                </div>
              </div>
              <div className="conversation-meta">
                <div className="conversation-time">{conversation.lastMessageTime || ''}</div>
                {conversation.unreadCount > 0 && (
                  <div className="unread-badge">{conversation.unreadCount}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        {selectedConversation ? (
          <>
            <div className="chat-conversation-header">
              <div className="conversation-header-info">
                <div className="avatar-container">
                  <img 
                    src={selectedConversation.avatar} 
                    alt={selectedConversation.name} 
                    className="conversation-header-avatar"
                    onError={(e) => {
                      e.target.src = 'http://127.0.0.1:5000/assets/default-avatar.svg';
                    }}
                  />
                  {selectedConversation.type === 'user' && !selectedConversation.avatar.includes('default-avatar') && !selectedConversation.avatar.includes('avatar-') && (
                    <div className="photo-indicator-header" title="User uploaded photo"></div>
                  )}
                </div>
                <div>
                  <div className="conversation-header-name">{selectedConversation.name}</div>
                  <div className="conversation-header-status">
                    {selectedConversation.specialty && (
                      <span className="status-text">{selectedConversation.specialty}</span>
                    )}
                    {selectedConversation.email && (
                      <span className="status-text">{selectedConversation.email}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="conversation-header-actions">
                <button className="header-action-btn">
                  <Phone size={18} />
                </button>
                <button className="header-action-btn">
                  <Video size={18} />
                </button>
                <button className="header-action-btn">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`message ${message.is_own ? 'message-own' : 'message-other'}`}
                >
                  <div className="message-content">
                    {message.image_url && (
                      <div className="message-image">
                        <img src={message.image_url} alt="Shared image" />
                      </div>
                    )}
                    {message.content && (
                      <div className="message-text">{message.content}</div>
                    )}
                    <div className="message-time">{formatTime(message.timestamp)}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              {selectedImage && (
                <div className="selected-image-preview">
                  <img src={URL.createObjectURL(selectedImage)} alt="Preview" />
                  <button 
                    className="remove-image-btn"
                    onClick={() => setSelectedImage(null)}
                  >
                    ×
                  </button>
                </div>
              )}
              
              <div className="chat-input">
                <button 
                  className="input-action-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image size={20} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="message-input"
                />
                <button 
                  className="input-action-btn"
                  onClick={sendMessage}
                  disabled={!newMessage.trim() && !selectedImage}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="chat-welcome">
            <div className="welcome-content">
              <div className="welcome-icon">💬</div>
              <h3>Welcome to Chat</h3>
              <p>Select a conversation to start messaging</p>
              {userType === 'user' && (
                <p>Click "New Chat" to start a conversation with a doctor</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
