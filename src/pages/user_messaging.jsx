import React, { useState, useEffect, useRef } from 'react';
import UserSidebar from './usersidebar';
import UserNavbar from './Usernavbar';
import '../cssonly/user-messaging.css';

const UserMessagingPage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pollingRef = useRef();
  const messagesEndRef = useRef(null);

  // Fetch user info from localStorage
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;
    fetch('http://localhost:5000/users')
      .then(res => res.json())
      .then(users => {
        const u = users.find(u => u.email === email);
        setUser(u);
      });
  }, []);

  // Fetch doctors for this user
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`http://localhost:5000/user/doctors/${user.patient_id}`)
      .then(res => res.json())
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load doctors');
        setLoading(false);
      });
  }, [user]);

  // Poll for new messages every 2 seconds
  useEffect(() => {
    if (!user || !selectedDoctor) return;
    const fetchMessages = () => {
      fetch(`http://localhost:5000/get-messages/user/${user.patient_id}/doctor/${selectedDoctor.id}`)
        .then(res => res.json())
        .then(data => setMessages(Array.isArray(data) ? data : []));
    };
    fetchMessages();
    pollingRef.current = setInterval(fetchMessages, 2000);
    return () => clearInterval(pollingRef.current);
  }, [user, selectedDoctor]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedDoctor) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.patient_id,
          receiver_id: selectedDoctor.id,
          sender_type: 'user',
          receiver_type: 'doctor',
          content: newMessage.trim()
        })
      });
      if (res.ok) {
        setNewMessage('');
        // Refresh messages
        fetch(`http://localhost:5000/get-messages/user/${user.patient_id}/doctor/${selectedDoctor.id}`)
          .then(res => res.json())
          .then(data => setMessages(Array.isArray(data) ? data : []));
      }
    } catch {
      setError('Failed to send message');
    }
    setLoading(false);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="user-messaging-container">
      <div className="user-messaging-layout">
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="user-messaging-content">
          <UserNavbar user={user} />
          
          <div className="user-chat-container">
            {/* Doctor List Sidebar */}
            <div className="user-doctor-list">
              <div className="user-doctor-list-header">
                Doctors
              </div>
              
              {loading && (
                <div className="user-loading">
                  Loading doctors...
                </div>
              )}
              
              {error && (
                <div style={{ padding: '1rem', color: '#ef4444' }}>
                  {error}
                </div>
              )}
              
              {!loading && !error && doctors.length === 0 && (
                <div className="user-empty-state">
                  <div className="user-empty-icon">👨‍⚕️</div>
                  <p className="user-empty-title">No doctors found</p>
                  <p className="user-empty-description">Please book an appointment first</p>
                </div>
              )}
              
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`user-doctor-item ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="user-doctor-avatar">
                    {doctor.firstname?.[0]}{doctor.lastname?.[0]}
                  </div>
                  <div className="user-doctor-info">
                    <div className="user-doctor-name">
                      Dr. {doctor.firstname} {doctor.lastname}
                    </div>
                    <div className="user-doctor-specialty">
                      {doctor.specialty}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Area */}
            <div className="user-chat-area">
              {selectedDoctor ? (
                <>
                  {/* Chat Header */}
                  <div className="user-chat-header">
                    <div className="user-doctor-avatar">
                      {selectedDoctor.firstname?.[0]}{selectedDoctor.lastname?.[0]}
                    </div>
                    <div>
                      <div className="user-doctor-name">
                        Dr. {selectedDoctor.firstname} {selectedDoctor.lastname}
                      </div>
                      <div className="user-doctor-specialty">
                        {selectedDoctor.specialty}
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="user-chat-messages">
                    {messages.length === 0 ? (
                      <div className="user-empty-state">
                        <div className="user-empty-icon">💬</div>
                        <p className="user-empty-title">No messages yet</p>
                        <p className="user-empty-description">Start the conversation!</p>
                      </div>
                    ) : (
                      <div>
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`user-message ${message.sender_type === 'user' ? 'sent' : 'received'}`}
                          >
                            <div className={`user-message-bubble ${message.sender_type === 'user' ? 'sent' : 'received'}`}>
                              <div>{message.content}</div>
                              <div className="user-message-time">
                                {formatTime(message.timestamp)}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="user-chat-input">
                    <form onSubmit={handleSend} className="user-message-form">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="user-message-input"
                        disabled={loading}
                        rows={1}
                      />
                      <button
                        type="submit"
                        disabled={loading || !newMessage.trim()}
                        className="user-send-button"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="user-empty-state">
                  <div className="user-empty-icon">💬</div>
                  <h3 className="user-empty-title">Select a Doctor</h3>
                  <p className="user-empty-description">Choose a doctor from the list to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessagingPage; 