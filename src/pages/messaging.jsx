import React, { useState, useEffect } from 'react';
import DoctorSidebar from './DoctorSidebar';
import DoctorNavbar from './DoctorNavbar';
import '../cssonly/doctordashboard.css';

const MessagingPage = () => {
  const [activeSection, setActiveSection] = useState('messaging');
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch doctor info from localStorage
  useEffect(() => {
    const doctorData = localStorage.getItem('doctorData');
    if (doctorData) {
      setDoctor(JSON.parse(doctorData));
    }
  }, []);

  // Fetch patients for this doctor
  useEffect(() => {
    if (!doctor) return;
    setLoading(true);
    fetch(`http://localhost:5000/doctor/patients/${doctor.id}`)
      .then(res => res.json())
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load patients');
        setLoading(false);
      });
  }, [doctor]);

  // Fetch messages for selected patient
  useEffect(() => {
    if (!doctor || !selectedPatient) return;
    setLoading(true);
    fetch(`http://localhost:5000/get-messages/doctor/${doctor.id}/user/${selectedPatient.id}`)
      .then(res => res.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load messages');
        setLoading(false);
      });
  }, [doctor, selectedPatient]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !doctor || !selectedPatient) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: doctor.id,
          receiver_id: selectedPatient.id,
          sender_type: 'doctor',
          receiver_type: 'user',
          content: newMessage.trim()
        })
      });
      if (res.ok) {
        setNewMessage('');
        // Refresh messages
        fetch(`http://localhost:5000/get-messages/doctor/${doctor.id}/user/${selectedPatient.id}`)
          .then(res => res.json())
          .then(data => setMessages(Array.isArray(data) ? data : []));
      }
    } catch {
      setError('Failed to send message');
    }
    setLoading(false);
  };

  return (
    <div className="doc1-app-container">
      <DoctorSidebar onSelect={setActiveSection} activeSection={activeSection} />
      <div className="doc1-content-wrapper">
        <DoctorNavbar />
        <div className="doc1-section-content" style={{ background: '#f7fafc', minHeight: '80vh', borderRadius: 12, boxShadow: '0 2px 8px rgba(44,82,130,0.07)', margin: 24, padding: 0, display: 'flex' }}>
          {/* Patient List */}
          <div style={{ width: 260, background: '#fff', borderRight: '1px solid #e2e8f0', borderRadius: '12px 0 0 12px', padding: 0 }}>
            <div style={{ padding: 20, borderBottom: '1px solid #e2e8f0', color: '#2c5282', fontWeight: 600, fontSize: 18 }}>Patients</div>
            {loading && <div style={{ padding: 20 }}>Loading...</div>}
            {error && <div style={{ color: 'red', padding: 20 }}>{error}</div>}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {patients.map((p) => (
                <li
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    background: selectedPatient && selectedPatient.id === p.id ? '#e6f0fa' : 'transparent',
                    borderBottom: '1px solid #f1f5f9',
                    color: '#2c5282',
                    fontWeight: 500
                  }}
                >
                  <span style={{ background: '#bee3f8', color: '#2c5282', borderRadius: '50%', padding: '6px 12px', marginRight: 12, fontWeight: 700 }}>
                    {p.firstname[0]}{p.lastname[0]}
                  </span>
                  {p.firstname} {p.lastname}
                </li>
              ))}
            </ul>
          </div>
          {/* Chat Window */}
          <div style={{ flex: 1, background: '#f7fafc', borderRadius: '0 12px 12px 0', display: 'flex', flexDirection: 'column', minHeight: 500 }}>
            <div style={{ padding: 20, borderBottom: '1px solid #e2e8f0', color: '#2c5282', fontWeight: 600, fontSize: 18, minHeight: 60 }}>
              {selectedPatient ? `${selectedPatient.firstname} ${selectedPatient.lastname}` : 'Select a patient to chat'}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {selectedPatient && messages.length === 0 && <div style={{ color: '#4a5568' }}>[No messages yet]</div>}
              {selectedPatient && messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender_type === 'doctor' ? 'flex-end' : 'flex-start',
                    background: msg.sender_type === 'doctor' ? '#2c5282' : '#bee3f8',
                    color: msg.sender_type === 'doctor' ? '#fff' : '#2c5282',
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
            {selectedPatient && (
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
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
