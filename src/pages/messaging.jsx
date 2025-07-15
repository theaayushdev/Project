import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';
import '../cssonly/messaging.css';

const MessagingInterface = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState('user'); // 'user' or 'doctor'
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [showDoctorsList, setShowDoctorsList] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeMessaging();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeMessaging = async () => {
    // Get current user data
    const userData = localStorage.getItem('userEmail');
    const doctorData = localStorage.getItem('doctorData');
    
    if (userData) {
      // User is logged in
      setUserType('user');
      try {
        const response = await fetch('http://localhost:5000/users');
        const users = await response.json();
        const user = users.find(u => u.email === userData);
        setCurrentUser(user);
        if (user) {
          loadConversations('user', user.patient_id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else if (doctorData) {
      // Doctor is logged in
      setUserType('doctor');
      const doctor = JSON.parse(doctorData);
      setCurrentUser(doctor);
      loadConversations('doctor', doctor.id);
    }

    // Load available doctors for users
    if (userData) {
      loadDoctors();
    }
  };

  const loadConversations = async (type, id) => {
    try {
      const response = await fetch(`http://localhost:5000/get-conversations/${type}/${id}`);
      const convos = await response.json();
      setConversations(convos);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/doctors');
      const doctorsData = await response.json();
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const loadMessages = async (partnerType, partnerId) => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/get-messages/${userType}/${currentUser.patient_id || currentUser.id}/${partnerType}/${partnerId}`
      );
      const messagesData = await response.json();
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    const messageData = {
      sender_id: currentUser.patient_id || currentUser.id,
      receiver_id: selectedConversation.id,
      sender_type: userType,
      receiver_type: selectedConversation.type,
      content: newMessage.trim()
    };

    try {
      const response = await fetch('http://localhost:5000/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        setNewMessage('');
        // Reload messages to show the new message
        loadMessages(selectedConversation.type, selectedConversation.id);
        // Update conversations list
        loadConversations(userType, currentUser.patient_id || currentUser.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowDoctorsList(false);
    loadMessages(conversation.type, conversation.id);
  };

  const startNewConversation = (doctor) => {
    const newConversation = {
      id: doctor.id,
      name: `Dr. ${doctor.firstname} ${doctor.lastname}`,
      type: 'doctor',
      specialty: doctor.specialty,
      avatar: doctor.firstname[0] + doctor.lastname[0]
    };
    setSelectedConversation(newConversation);
    setShowDoctorsList(false);
    setMessages([]);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!currentUser) {
    return (
      <div className="messaging-container">
        <div className="messaging-error">
          <h2>Please log in to access messaging</h2>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="messaging-container">
      {/* Sidebar */}
      <div className="messaging-sidebar">
        <div className="messaging-header">
          <div className="messaging-user-info">
            <div className="messaging-avatar">
              {currentUser.firstname?.[0] || 'U'}
            </div>
            <div className="messaging-user-details">
              <h3>{currentUser.firstname || 'User'}</h3>
              <span className="messaging-user-type">{userType === 'user' ? 'Patient' : 'Doctor'}</span>
            </div>
          </div>
          <button 
            className="messaging-back-btn"
            onClick={() => navigate(userType === 'user' ? '/pregnancydashboard' : '/doctordashboard')}
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="messaging-actions">
          {userType === 'user' && (
            <button 
              className="messaging-new-chat-btn"
              onClick={() => setShowDoctorsList(!showDoctorsList)}
            >
              + New Chat with Doctor
            </button>
          )}
        </div>

        {showDoctorsList && userType === 'user' && (
          <div className="messaging-doctors-list">
            <h4>Available Doctors</h4>
            {doctors.map(doctor => (
              <div 
                key={doctor.id} 
                className="messaging-doctor-item"
                onClick={() => startNewConversation(doctor)}
              >
                <div className="messaging-avatar">
                  {doctor.firstname[0]}{doctor.lastname[0]}
                </div>
                <div className="messaging-doctor-info">
                  <span className="messaging-doctor-name">
                    Dr. {doctor.firstname} {doctor.lastname}
                  </span>
                  <span className="messaging-doctor-specialty">
                    {doctor.specialty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="messaging-conversations">
          <h4>Conversations</h4>
          {conversations.map(conversation => (
            <div 
              key={`${conversation.type}-${conversation.id}`}
              className={`messaging-conversation-item ${
                selectedConversation?.id === conversation.id ? 'active' : ''
              }`}
              onClick={() => selectConversation(conversation)}
            >
              <div className="messaging-avatar">
                {conversation.avatar}
              </div>
              <div className="messaging-conversation-info">
                <span className="messaging-conversation-name">
                  {conversation.name}
                </span>
                {conversation.specialty && (
                  <span className="messaging-conversation-specialty">
                    {conversation.specialty}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="messaging-chat-area">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="messaging-chat-header">
              <div className="messaging-chat-user-info">
                <div className="messaging-avatar">
                  {selectedConversation.avatar}
                </div>
                <div className="messaging-chat-user-details">
                  <h3>{selectedConversation.name}</h3>
                  {selectedConversation.specialty && (
                    <span className="messaging-chat-specialty">
                      {selectedConversation.specialty}
                    </span>
                  )}
                </div>
              </div>
              <div className="messaging-chat-actions">
                <button className="messaging-action-btn">
                  <Phone size={20} />
                </button>
                <button className="messaging-action-btn">
                  <Video size={20} />
                </button>
                <button className="messaging-action-btn">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="messaging-messages-container">
              {loading ? (
                <div className="messaging-loading">Loading messages...</div>
              ) : (
                <>
                  {messages.map((message, index) => {
                    const isCurrentUser = 
                      (message.sender_type === userType && 
                       message.sender_id === (currentUser.patient_id || currentUser.id));
                    
                    const showDate = index === 0 || 
                      formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="messaging-date-separator">
                            {formatDate(message.timestamp)}
                          </div>
                        )}
                        <div className={`messaging-message ${isCurrentUser ? 'sent' : 'received'}`}>
                          <div className="messaging-message-content">
                            {message.content}
                          </div>
                          <div className="messaging-message-time">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="messaging-input-container">
              <button className="messaging-input-action">
                <Paperclip size={20} />
              </button>
              <div className="messaging-input-wrapper">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="messaging-input"
                  rows="1"
                />
                <button className="messaging-input-action">
                  <Smile size={20} />
                </button>
              </div>
              <button 
                className="messaging-send-btn"
                onClick={sendMessage}
                disabled={!newMessage.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="messaging-welcome">
            <div className="messaging-welcome-content">
              <h2>Welcome to Pregnify Messaging</h2>
              <p>
                {userType === 'user' 
                  ? 'Select a conversation or start a new chat with a doctor'
                  : 'Select a conversation to start messaging'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
