import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';
import DoctorNavbar from './DoctorNavbar';

const MessagingPage = () => {
  const [activeSection, setActiveSection] = useState('messaging');
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patientsLoading, setPatientsLoading] = useState(true);
  const pollingRef = useRef();
  const messagesEndRef = useRef(null);

  // Get doctor data from localStorage
  useEffect(() => {
    const doctorData = localStorage.getItem('doctorData');
    if (doctorData) {
      setDoctor(JSON.parse(doctorData));
    }
  }, []);

  // Fetch patients for this doctor
  useEffect(() => {
    if (!doctor) return;
    
    const fetchPatients = async () => {
      try {
        setPatientsLoading(true);
        const response = await fetch(`http://127.0.0.1:5000/doctor/patients/${doctor.id}`);
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          throw new Error('Failed to fetch patients');
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients');
      } finally {
        setPatientsLoading(false);
      }
    };

    fetchPatients();
  }, [doctor]);

  // Poll for new messages
  useEffect(() => {
    if (!doctor || !selectedPatient) return;
    
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/get-messages/doctor/${doctor.id}/user/${selectedPatient.id}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
    pollingRef.current = setInterval(fetchMessages, 2000);
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [doctor, selectedPatient]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !doctor || !selectedPatient) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/send-message', {
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
      
      if (response.ok) {
        setNewMessage('');
        // Refresh messages
        const messagesResponse = await fetch(`http://127.0.0.1:5000/get-messages/doctor/${doctor.id}/user/${selectedPatient.id}`);
        if (messagesResponse.ok) {
          const data = await messagesResponse.json();
          setMessages(Array.isArray(data) ? data : []);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSectionSelect = (section) => {
    if (section === 'dashboard') {
      navigate('/doctordashboard');
    } else if (section === 'logout') {
      localStorage.removeItem('doctorData');
      navigate('/doctorlogin');
    } else {
      setActiveSection(section);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DoctorSidebar 
        onSelect={handleSectionSelect} 
        activeSection={activeSection}
        doctor={doctor}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <DoctorNavbar doctor={doctor} />
        
        {/* Chat Interface */}
        <div className="flex-1 flex overflow-hidden">
          {/* Patient List Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Patients</h2>
              <p className="text-sm text-gray-500 mt-1">Select a patient to start chatting</p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {patientsLoading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading patients...</p>
                </div>
              ) : error ? (
                <div className="p-4 text-center">
                  <div className="text-red-500 text-4xl mb-2">⚠️</div>
                  <p className="text-red-600">{error}</p>
                </div>
              ) : patients.length === 0 ? (
                <div className="p-4 text-center">
                  <div className="text-gray-400 text-4xl mb-2">👥</div>
                  <p className="text-gray-500">No patients found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {patients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        selectedPatient?.id === patient.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                          {patient.firstname?.[0]}{patient.lastname?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {patient.firstname} {patient.lastname}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {patient.email}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedPatient ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {selectedPatient.firstname?.[0]}{selectedPatient.lastname?.[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedPatient.firstname} {selectedPatient.lastname}
                      </h3>
                      <p className="text-sm text-gray-500">Patient</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-4">💬</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                      <p className="text-gray-600">Start the conversation!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.sender_type === 'doctor' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender_type === 'doctor'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-900 border border-gray-200'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender_type === 'doctor' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <form onSubmit={handleSend} className="flex space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !newMessage.trim()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Patient</h3>
                  <p className="text-gray-600">Choose a patient from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
