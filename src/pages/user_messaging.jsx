import React, { useState, useEffect, useRef } from 'react';
import UserSidebar from './usersidebar';
import UserNavbar from './Usernavbar';
import '../cssonly/pregnancydashboard.css';

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

  return (
    <div className="dashboard-container">
      <UserNavbar user={user} />
      <div className="dashboard-layout">
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} lmc={pregnancyInfo?.lmc} week={week} trimester={trimester} />
        <main className="dashboard-content" style={{ padding: 0, display: 'flex', minHeight: 600 }}>
          {/* Doctor List */}
          <div style={{ width: 260, background: '#fff', borderRight: '1px solid #e2e8f0', borderRadius: '12px 0 0 12px', padding: 0 }}>
            <div style={{ padding: 20, borderBottom: '1px solid #e2e8f0', color: '#2c5282', fontWeight: 600, fontSize: 18 }}>Doctors</div>
            {loading && <div style={{ padding: 20 }}>Loading...</div>}
            {error && <div style={{ color: 'red', padding: 20 }}>{error}</div>}
            {!loading && !error && doctors.length === 0 && (
              <div style={{ padding: 20, color: '#4a5568' }}>No doctors found. Please book an appointment first.</div>
            )}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {doctors.map((d) => (
                <li
                  key={d.id}
                  onClick={() => setSelectedDoctor(d)}
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    background: selectedDoctor && selectedDoctor.id === d.id ? '#e6f0fa' : 'transparent',
                    borderBottom: '1px solid #f1f5f9',
                    color: '#2c5282',
                    fontWeight: 500
                  }}
                >
                  <span style={{ background: '#bee3f8', color: '#2c5282', borderRadius: '50%', padding: '6px 12px', marginRight: 12, fontWeight: 700 }}>
                    {d.firstname[0]}{d.lastname[0]}
                  </span>
                  Dr. {d.firstname} {d.lastname}
                </li>
              ))}
            </ul>
          </div>
          {/* Chat Window */}
          <div style={{ flex: 1, background: '#f7fafc', borderRadius: '0 12px 12px 0', display: 'flex', flexDirection: 'column', minHeight: 500 }}>
            <div style={{ padding: 20, borderBottom: '1px solid #e2e8f0', color: '#2c5282', fontWeight: 600, fontSize: 18, minHeight: 60 }}>
              {selectedDoctor ? `Dr. ${selectedDoctor.firstname} ${selectedDoctor.lastname}` : 'Select a doctor to chat'}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {selectedDoctor && messages.length === 0 && <div style={{ color: '#4a5568' }}>[No messages yet]</div>}
              {selectedDoctor && messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender_type === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.sender_type === 'user' ? '#2c5282' : '#bee3f8',
                    color: msg.sender_type === 'user' ? '#fff' : '#2c5282',
                    borderRadius: 16,
                    padding: '10px 18px',
                    maxWidth: '70%',
                    fontSize: 15
                  }}
                >
                  {msg.content}
                </div>
              ))}
            </div>
            {selectedDoctor && (
              <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, padding: 20, borderTop: '1px solid #e2e8f0', background: '#fff', borderRadius: '0 0 12px 0' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  style={{ flex: 1, padding: 12, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 16 }}
                  disabled={loading}
                />
                <button type="submit" style={{ background: '#2c5282', color: '#fff', border: 'none', borderRadius: 6, padding: '0 20px', fontWeight: 600, fontSize: 16 }} disabled={loading || !newMessage.trim()}>
                  Send
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserMessagingPage; 