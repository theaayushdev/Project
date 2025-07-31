import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssonly/doctordashboard-single.css';

const DoctorDashboardApp = () => {
  const [doctor, setDoctor] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  
  // Stats and data states
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  
  // Chat states
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Profile states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({});
  
  // Modal states
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newAppointmentData, setNewAppointmentData] = useState({
    patient_id: '',
    appointment_date: '',
    purpose: '',
    notes: ''
  });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const chatPollingRef = useRef(null);

  // Test backend connectivity
  useEffect(() => {
    const testBackend = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/');
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch (err) {
        console.error('Backend connection error:', err);
        setBackendStatus('error');
      }
    };
    testBackend();
  }, []);

  // Fetch doctor data and verify
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const doctorData = localStorage.getItem('doctorData');
        if (doctorData) {
          const parsedDoctor = JSON.parse(doctorData);
          setDoctor(parsedDoctor);
          
          // Verify doctor data with backend
          const response = await fetch(`http://127.0.0.1:5000/doctor/${parsedDoctor.id}`);
          if (!response.ok) {
            throw new Error('Doctor data verification failed');
          }
          
          // Initialize profile data
          setProfileData({
            firstname: parsedDoctor.firstname || '',
            lastname: parsedDoctor.lastname || '',
            email: parsedDoctor.email || '',
            phone_number: parsedDoctor.phone_number || '',
            specialty: parsedDoctor.specialty || '',
            department: parsedDoctor.department || ''
          });
        } else {
          navigate('/doctorlogin');
          return;
        }
      } catch (err) {
        console.error('Error fetching doctor data:', err);
        setError('Failed to load doctor data. Please log in again.');
        setTimeout(() => navigate('/doctorlogin'), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [navigate]);

  // Fetch dashboard data
  useEffect(() => {
    if (!doctor) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsResponse = await fetch(`http://127.0.0.1:5000/doctor/stats/${doctor.id}`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Fetch appointments
        const appointmentsResponse = await fetch(`http://127.0.0.1:5000/doctor-appointments/${doctor.id}`);
        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();
          setAppointments(appointmentsData);
        }

        // Fetch patients
        const patientsResponse = await fetch(`http://127.0.0.1:5000/doctor/patients/${doctor.id}`);
        if (patientsResponse.ok) {
          const patientsData = await patientsResponse.json();
          setPatients(patientsData);
          setFilteredPatients(patientsData);
        }

        // Fetch recent messages
        const messagesResponse = await fetch(`http://127.0.0.1:5000/doctor/recent-messages/${doctor.id}`);
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData);
        }

        // Fetch calendar events
        const calendarResponse = await fetch(`http://127.0.0.1:5000/doctor/calendar-events/${doctor.id}`);
        if (calendarResponse.ok) {
          const calendarData = await calendarResponse.json();
          setCalendarEvents(calendarData);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, [doctor]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient => 
        patient.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

  // Chat functionality
  useEffect(() => {
    if (!doctor || !selectedPatient) return;
    const fetchChatMessages = async () => {
      try {
        // Use the same endpoint and order as the user side, but always use user/doctor as sender/receiver
        const response = await fetch(
          `http://127.0.0.1:5000/get-messages/doctor/${doctor.id}/user/${selectedPatient.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setChatMessages(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching chat messages:', err);
      }
    };

    fetchChatMessages();
    chatPollingRef.current = setInterval(fetchChatMessages, 2000);

    return () => {
      if (chatPollingRef.current) {
        clearInterval(chatPollingRef.current);
      }
    };
  }, [doctor, selectedPatient]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !doctor || !selectedPatient) return;

    setSendingMessage(true);
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
        // Immediately fetch messages after sending
        const messagesResponse = await fetch(
          `http://127.0.0.1:5000/get-messages/doctor/${doctor.id}/user/${selectedPatient.id}`
        );
        if (messagesResponse.ok) {
          const data = await messagesResponse.json();
          setChatMessages(Array.isArray(data) ? data : []);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doctorData');
    navigate('/doctorlogin');
  };

  const handleProfileSave = async () => {
    try {
      // Here you would typically make an API call to update the doctor's profile
      console.log('Saving profile:', profileData);
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleProfileCancel = () => {
    setProfileData({
      firstname: doctor?.firstname || '',
      lastname: doctor?.lastname || '',
      email: doctor?.email || '',
      phone_number: doctor?.phone_number || '',
      specialty: doctor?.specialty || '',
      department: doctor?.department || ''
    });
    setIsEditingProfile(false);
  };

  // Modal handlers
  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const handleNewAppointment = () => {
    setShowNewAppointmentModal(true);
  };

  const handleCreateAppointment = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/create-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: doctor.id,
          user_id: newAppointmentData.patient_id,
          appointment_date: newAppointmentData.appointment_date,
          purpose: newAppointmentData.purpose,
          notes: newAppointmentData.notes
        })
      });
      
      if (response.ok) {
        setShowNewAppointmentModal(false);
        setNewAppointmentData({
          patient_id: '',
          appointment_date: '',
          purpose: '',
          notes: ''
        });
        // Refresh appointments
        const appointmentsResponse = await fetch(`http://127.0.0.1:5000/doctor-appointments/${doctor.id}`);
        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();
          setAppointments(appointmentsData);
        }
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const handleDashboardClick = (section) => {
    setActiveSection(section);
  };

  // Helper functions
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'doctordas-status-success';
      case 'pending': return 'doctordas-status-warning';
      case 'cancelled': return 'doctordas-status-error';
      default: return 'doctordas-status-default';
    }
  };

  const getRandomProgress = () => Math.floor(Math.random() * 40) + 60;

  // Loading state
  if (loading) {
    return (
      <div className="doctordas-app">
        <div className="doctordas-loading">
          <div className="doctordas-loading-spinner"></div>
          <p>Loading your dashboard...</p>
          {backendStatus === 'checking' && (
            <p className="doctordas-loading-text">Checking backend connection...</p>
          )}
          {backendStatus === 'error' && (
            <p className="doctordas-loading-error">⚠️ Backend connection failed</p>
          )}
          {backendStatus === 'connected' && (
            <p className="doctordas-loading-success">✅ Backend connected</p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="doctordas-app">
        <div className="doctordas-empty-state">
          <div className="doctordas-empty-state-icon">⚠️</div>
          <h2 className="doctordas-empty-state-title">Error Loading Dashboard</h2>
          <p className="doctordas-empty-state-description">{error}</p>
          <button 
            onClick={() => navigate('/doctorlogin')}
            className="doctordas-btn doctordas-btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doctordas-app">
      {/* Sidebar */}
      <div className="doctordas-sidebar">
        {/* Logo */}
        <div className="doctordas-sidebar-logo">
          <div className="doctordas-sidebar-logo-icon">🏥</div>
          <div>
            <h1>Pregnify</h1>
            <p>Doctor Portal</p>
          </div>
        </div>

        {/* Doctor Info */}
        {doctor && (
          <div className="doctordas-sidebar-profile">
            <div className="doctordas-avatar">
              {doctor.firstname?.[0]}{doctor.lastname?.[0]}
            </div>
            <div className="doctordas-profile-info">
              <p className="doctordas-profile-name">
                Dr. {doctor.firstname} {doctor.lastname}
              </p>
              <p className="doctordas-profile-specialty">
                {doctor.specialty}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="doctordas-sidebar-nav">
          <ul>
            <li>
              <button
                onClick={() => setActiveSection('dashboard')}
                className={`doctordas-sidebar-link ${activeSection === 'dashboard' ? 'active' : ''}`}
              >
                <span>🏥</span>
                <div>
                  <span>Dashboard</span>
                  <span>Overview & Analytics</span>
                </div>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('appointments')}
                className={`doctordas-sidebar-link ${activeSection === 'appointments' ? 'active' : ''}`}
              >
                <span>📅</span>
                <div>
                  <span>Appointments</span>
                  <span>Manage Schedule</span>
                </div>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('patients')}
                className={`doctordas-sidebar-link ${activeSection === 'patients' ? 'active' : ''}`}
              >
                <span>👥</span>
                <div>
                  <span>Patients</span>
                  <span>Patient List</span>
                </div>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('chat')}
                className={`doctordas-sidebar-link ${activeSection === 'chat' ? 'active' : ''}`}
              >
                <span>💬</span>
                <div>
                  <span>Chat</span>
                  <span>Real-time Chat</span>
                </div>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('profile')}
                className={`doctordas-sidebar-link ${activeSection === 'profile' ? 'active' : ''}`}
              >
                <span>👨‍⚕️</span>
                <div>
                  <span>Profile</span>
                  <span>Account Settings</span>
                </div>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="doctordas-sidebar-footer">
          <button onClick={handleLogout} className="doctordas-sidebar-link doctordas-sidebar-logout">
            <span>🚪</span>
            <div>
              <span>Logout</span>
              <span>Sign out</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="doctordas-content">
        {/* Navbar */}
        <div className="doctordas-navbar">
          <div className="doctordas-navbar-search">
            <span>🔍</span>
            <input 
              placeholder="Search patients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  setActiveSection('patients');
                }
              }}
            />
          </div>
          <div className="doctordas-navbar-profile">
            <div className="doctordas-navbar-time">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="doctordas-avatar">
              {doctor?.firstname?.[0]}{doctor?.lastname?.[0]}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <main className="doctordas-main">
          {/* Backend Status */}
          {backendStatus === 'error' && (
            <div className="doctordas-alert doctordas-alert-error">
              <span>⚠️</span>
              <span>Backend connection failed. Some features may not work properly.</span>
            </div>
          )}

          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="doctordas-dashboard">
              {/* Welcome */}
              <div className="doctordas-welcome">
                <h1>Welcome back, Dr. {doctor?.firstname} {doctor?.lastname}</h1>
                <p>Here's what's happening with your patients today.</p>
                <div className="doctordas-welcome-stats">
                  <span className="doctordas-status-online">🟢 Online</span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="doctordas-stats-grid">
                <div className="doctordas-stat-card">
                  <div className="doctordas-stat-icon">👥</div>
                  <div className="doctordas-stat-content">
                    <h3>{stats?.total_patients || 0}</h3>
                    <p>Total Patients</p>
                    <span>+12%</span>
                  </div>
                </div>
                <div className="doctordas-stat-card">
                  <div className="doctordas-stat-icon">📅</div>
                  <div className="doctordas-stat-content">
                    <h3>{stats?.today_appointments || 0}</h3>
                    <p>Today's Appointments</p>
                    <span>{stats?.pending_appointments || 0} pending</span>
                  </div>
                </div>
                <div className="doctordas-stat-card">
                  <div className="doctordas-stat-icon">💬</div>
                  <div className="doctordas-stat-content">
                    <h3>{stats?.unread_messages || 0}</h3>
                    <p>New Messages</p>
                    <span>5 unread</span>
                  </div>
                </div>
                <div className="doctordas-stat-card">
                  <div className="doctordas-stat-icon">📊</div>
                  <div className="doctordas-stat-content">
                    <h3>{stats?.total_patients || 0}</h3>
                    <p>Active Cases</p>
                    <span>+3 this week</span>
                  </div>
                </div>
              </div>

              {/* Main Grid */}
              <div className="doctordas-grid">
                {/* Top Patients */}
                <div className="doctordas-card">
                  <div className="doctordas-card-header">
                    <h3>👥 Top Patients</h3>
                    <span>{patients.length} patients</span>
                  </div>
                  <div className="doctordas-card-content">
                    {patients.length === 0 ? (
                      <div className="doctordas-empty-state">
                        <span>👥</span>
                        <h4>No patients found</h4>
                        <p>Start by booking appointments</p>
                      </div>
                    ) : (
                      patients.slice(0, 4).map((patient) => {
                        const progress = getRandomProgress();
                        return (
                          <div 
                            key={patient.id} 
                            className="doctordas-patient-item"
                            onClick={() => handleDashboardClick('patients')}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="doctordas-avatar">
                              {patient.firstname?.[0]}{patient.lastname?.[0]}
                            </div>
                            <div className="doctordas-patient-info">
                              <div className="doctordas-patient-header">
                                <p>{patient.firstname} {patient.lastname}</p>
                                <span>{progress}%</span>
                              </div>
                              <div className="doctordas-patient-details">
                                <span>{patient.age || 'N/A'} yrs</span>
                                <span>•</span>
                                <span>Pregnancy</span>
                              </div>
                              <div className="doctordas-progress">
                                <div 
                                  className="doctordas-progress-bar"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Recent Messages */}
                <div className="doctordas-card">
                  <div className="doctordas-card-header">
                    <h3>💬 Recent Messages</h3>
                    <span>{messages.length} messages</span>
                  </div>
                  <div className="doctordas-card-content">
                    {messages.length === 0 ? (
                      <div className="doctordas-empty-state">
                        <span>💬</span>
                        <h4>No messages yet</h4>
                        <p>Start a conversation with your patients</p>
                      </div>
                    ) : (
                      messages.slice(0, 4).map((message) => (
                        <div 
                          key={message.id} 
                          className="doctordas-message-item"
                          onClick={() => handleDashboardClick('chat')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="doctordas-avatar">
                            {message.sender?.firstname?.[0]}{message.sender?.lastname?.[0]}
                          </div>
                          <div className="doctordas-message-info">
                            <div className="doctordas-message-header">
                              <p>{message.sender?.firstname} {message.sender?.lastname}</p>
                              <span>{formatTime(message.timestamp)}</span>
                            </div>
                            <p className="doctordas-message-content">
                              {message.content?.substring(0, 50)}...
                            </p>
                            {!message.is_read && (
                              <div className="doctordas-message-unread">
                                <span></span>
                                <span>New</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Grid */}
              <div className="doctordas-grid">
                {/* Appointments */}
                <div className="doctordas-card">
                  <div className="doctordas-card-header">
                    <h3>📅 Upcoming Appointments</h3>
                    <button 
                      className="doctordas-btn doctordas-btn-primary"
                      onClick={handleNewAppointment}
                    >
                      <span>+</span>
                      <span>New</span>
                    </button>
                  </div>
                  <div className="doctordas-card-content">
                    {appointments.length === 0 ? (
                      <div className="doctordas-empty-state">
                        <span>📅</span>
                        <h4>No appointments scheduled</h4>
                        <p>All clear for now!</p>
                      </div>
                    ) : (
                      appointments.slice(0, 5).map((appointment) => (
                        <div key={appointment.id} className="doctordas-appointment-item">
                          <div className="doctordas-avatar">
                            {appointment.user?.firstname?.[0]}{appointment.user?.lastname?.[0]}
                          </div>
                          <div className="doctordas-appointment-info">
                            <p>{appointment.user?.firstname} {appointment.user?.lastname}</p>
                            <div className="doctordas-appointment-details">
                              <span>{formatDate(appointment.appointment_date)}</span>
                              {appointment.purpose && (
                                <span className="doctordas-appointment-purpose">{appointment.purpose}</span>
                              )}
                            </div>
                          </div>
                          <div className="doctordas-appointment-actions">
                            <span className={`doctordas-status ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                            <button 
                              className="doctordas-btn-link"
                              onClick={() => handleViewAppointment(appointment)}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Calendar */}
                <div className="doctordas-card">
                  <div className="doctordas-card-header">
                    <h3>📅 Appointment Calendar</h3>
                    <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="doctordas-card-content">
                    <div className="doctordas-calendar">
                      <div className="doctordas-calendar-header">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="doctordas-calendar-day-header">{day}</div>
                        ))}
                      </div>
                      <div className="doctordas-calendar-grid">
                        {Array.from({ length: 42 }, (_, i) => {
                          const day = i + 1;
                          const hasEvents = calendarEvents.some(event => {
                            const eventDate = new Date(event.appointment_date);
                            return eventDate.getDate() === day && 
                                   eventDate.getMonth() === new Date().getMonth() &&
                                   eventDate.getFullYear() === new Date().getFullYear();
                          });
                          
                          return (
                            <div
                              key={i}
                              className={`doctordas-calendar-day ${day === new Date().getDate() ? 'doctordas-calendar-today' : ''} ${hasEvents ? 'doctordas-calendar-has-events' : ''}`}
                            >
                              {day <= 31 ? day : ''}
                              {hasEvents && <span className="doctordas-calendar-event-dot"></span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Section */}
          {activeSection === 'appointments' && (
            <div className="doctordas-section">
              <div className="doctordas-section-header">
                <div>
                  <h2>My Appointments</h2>
                  <p>Manage your patient appointments</p>
                </div>
                <button 
                  className="doctordas-btn doctordas-btn-primary"
                  onClick={handleNewAppointment}
                >
                  <span>+</span>
                  <span>New Appointment</span>
                </button>
              </div>
              <div className="doctordas-card">
                <div className="doctordas-card-content">
                  {appointments.length === 0 ? (
                    <div className="doctordas-empty-state">
                      <span>📅</span>
                      <h4>No appointments scheduled</h4>
                      <p>All clear for now!</p>
                    </div>
                  ) : (
                    appointments.map((appointment) => (
                      <div key={appointment.id} className="doctordas-appointment-item">
                        <div className="doctordas-avatar">
                          {appointment.user?.firstname?.[0]}{appointment.user?.lastname?.[0]}
                        </div>
                        <div className="doctordas-appointment-info">
                          <p>{appointment.user?.firstname} {appointment.user?.lastname}</p>
                          <div className="doctordas-appointment-details">
                            <span>{formatDate(appointment.appointment_date)}</span>
                            {appointment.purpose && (
                              <span className="doctordas-appointment-purpose">{appointment.purpose}</span>
                            )}
                          </div>
                        </div>
                        <div className="doctordas-appointment-actions">
                          <span className={`doctordas-status ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          <button
                            className="doctordas-btn-link"
                            onClick={() => handleViewAppointment(appointment)}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Patients Section */}
          {activeSection === 'patients' && (
            <div className="doctordas-section">
              <div className="doctordas-section-header">
                <div>
                  <h2>My Patients</h2>
                  <p>View and manage your patient list</p>
                </div>
                <div className="doctordas-search-results">
                  {searchQuery && (
                    <p>Showing {filteredPatients.length} results for "{searchQuery}"</p>
                  )}
                </div>
              </div>
              <div className="doctordas-patients-grid">
                {filteredPatients.length === 0 ? (
                  <div className="doctordas-empty-state">
                    <span>👥</span>
                    <h4>No patients found</h4>
                    <p>{searchQuery ? 'Try a different search term' : 'Start by booking appointments'}</p>
                  </div>
                ) : (
                  filteredPatients.map((patient) => {
                    const progress = getRandomProgress();
                    return (
                      <div key={patient.id} className="doctordas-patient-card">
                        <div className="doctordas-patient-photo">
                          {patient.firstname?.[0]}{patient.lastname?.[0]}
                        </div>
                        <div className="doctordas-patient-info">
                          <h4>{patient.firstname} {patient.lastname}</h4>
                          <div className="doctordas-patient-details">
                            <div className="doctordas-patient-detail">
                              <span>📧</span>
                              <span>{patient.email}</span>
                            </div>
                            <div className="doctordas-patient-detail">
                              <span>📱</span>
                              <span>{patient.contact || 'N/A'}</span>
                            </div>
                            <div className="doctordas-patient-detail">
                              <span>🎂</span>
                              <span>{patient.age || 'N/A'} years old</span>
                            </div>
                            <div className="doctordas-patient-detail">
                              <span>📍</span>
                              <span>{patient.location || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="doctordas-patient-actions">
                            <button 
                              className="doctordas-btn-patient doctordas-btn-patient-primary"
                              onClick={() => {
                                setSelectedPatient(patient);
                                setActiveSection('chat');
                              }}
                            >
                              <span>💬</span>
                              <span>Message</span>
                            </button>
                            <button 
                              className="doctordas-btn-patient doctordas-btn-patient-secondary"
                              onClick={() => {
                                setNewAppointmentData({
                                  ...newAppointmentData,
                                  patient_id: patient.id
                                });
                                setShowNewAppointmentModal(true);
                              }}
                            >
                              <span>📅</span>
                              <span>Book Appointment</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Chat Section */}
          {activeSection === 'chat' && (
            <div className="doctordas-chat">
              <div className="doctordas-chat-sidebar">
                <div className="doctordas-chat-sidebar-header">
                  <h3>Patients</h3>
                  <p>Select a patient to start chatting</p>
                </div>
                <div className="doctordas-chat-patients">
                  {patients.length === 0 ? (
                    <div className="doctordas-empty-state">
                      <span>👥</span>
                      <p>No patients found</p>
                    </div>
                  ) : (
                    patients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient)}
                        className={`doctordas-chat-patient ${selectedPatient?.id === patient.id ? 'active' : ''}`}
                      >
                        <div className="doctordas-avatar">
                          {patient.firstname?.[0]}{patient.lastname?.[0]}
                        </div>
                        <div className="doctordas-chat-patient-info">
                          <p>{patient.firstname} {patient.lastname}</p>
                          <span>{patient.email}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="doctordas-chat-main">
                {selectedPatient ? (
                  <>
                    <div className="doctordas-chat-header">
                      <div className="doctordas-avatar">
                        {selectedPatient.firstname?.[0]}{selectedPatient.lastname?.[0]}
                      </div>
                      <div>
                        <h3>{selectedPatient.firstname} {selectedPatient.lastname}</h3>
                        <p>Patient</p>
                      </div>
                    </div>

                    <div className="doctordas-chat-messages">
                      {chatMessages.length === 0 ? (
                        <div className="doctordas-empty-state">
                          <span>💬</span>
                          <h4>No messages yet</h4>
                          <p>Start the conversation!</p>
                        </div>
                      ) : (
                        chatMessages.map((message, index) => (
                          <div
                            key={index}
                            className={`doctordas-chat-message ${message.sender_type === 'doctor' ? 'doctordas-chat-message-sent' : 'doctordas-chat-message-received'}`}
                          >
                            <div className="doctordas-chat-message-content">
                              <p>{message.content}</p>
                              <span>{formatTime(message.timestamp)}</span>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="doctordas-chat-input">
                      <div className="doctordas-chat-input-container">
                        <div className="doctordas-chat-input-actions">
                          <button type="button" className="doctordas-chat-input-action">
                            😊
                          </button>
                          <button type="button" className="doctordas-chat-input-action">
                            📎
                          </button>
                        </div>
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          disabled={sendingMessage}
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="doctordas-chat-send-btn"
                        disabled={sendingMessage || !newMessage.trim()}
                      >
                        {sendingMessage ? 'Sending...' : 'Send'}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="doctordas-chat-placeholder">
                    <span>💬</span>
                    <h3>Select a Patient</h3>
                    <p>Choose a patient from the list to start messaging</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="doctordas-section">
              <div className="doctordas-section-header">
                <div>
                  <h2>Profile Settings</h2>
                  <p>Manage your account information</p>
                </div>
                <div className="doctordas-profile-actions">
                  {isEditingProfile ? (
                    <>
                      <button onClick={handleProfileSave} className="doctordas-btn doctordas-btn-primary">
                        Save Changes
                      </button>
                      <button onClick={handleProfileCancel} className="doctordas-btn doctordas-btn-secondary">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditingProfile(true)} className="doctordas-btn doctordas-btn-primary">
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
              <div className="doctordas-card">
                <div className="doctordas-profile-content">
                  <div className="doctordas-profile-header">
                    <div className="doctordas-avatar doctordas-avatar-large">
                      {doctor?.firstname?.[0]}{doctor?.lastname?.[0]}
                    </div>
                    <div>
                      <h3>Dr. {doctor?.firstname} {doctor?.lastname}</h3>
                      <p>{doctor?.specialty}</p>
                      <p>{doctor?.department}</p>
                    </div>
                  </div>

                  <div className="doctordas-profile-form">
                    <div className="doctordas-form-group">
                      <label>First Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileData.firstname}
                          onChange={(e) => setProfileData({...profileData, firstname: e.target.value})}
                        />
                      ) : (
                        <p>{doctor?.firstname}</p>
                      )}
                    </div>

                    <div className="doctordas-form-group">
                      <label>Last Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileData.lastname}
                          onChange={(e) => setProfileData({...profileData, lastname: e.target.value})}
                        />
                      ) : (
                        <p>{doctor?.lastname}</p>
                      )}
                    </div>

                    <div className="doctordas-form-group">
                      <label>Email</label>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        />
                      ) : (
                        <p>{doctor?.email}</p>
                      )}
                    </div>

                    <div className="doctordas-form-group">
                      <label>Phone Number</label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={profileData.phone_number}
                          onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                        />
                      ) : (
                        <p>{doctor?.phone_number}</p>
                      )}
                    </div>

                    <div className="doctordas-form-group">
                      <label>Specialty</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileData.specialty}
                          onChange={(e) => setProfileData({...profileData, specialty: e.target.value})}
                        />
                      ) : (
                        <p>{doctor?.specialty}</p>
                      )}
                    </div>

                    <div className="doctordas-form-group">
                      <label>Department</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileData.department}
                          onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                        />
                      ) : (
                        <p>{doctor?.department}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Appointment View Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className="doctordas-modal-overlay" onClick={() => setShowAppointmentModal(false)}>
          <div className="doctordas-modal" onClick={(e) => e.stopPropagation()}>
            <div className="doctordas-modal-header">
              <h3 className="doctordas-modal-title">Appointment Details</h3>
              <button 
                className="doctordas-modal-close"
                onClick={() => setShowAppointmentModal(false)}
              >
                ×
              </button>
            </div>
            <div className="doctordas-appointment-details-modal">
              <div className="doctordas-appointment-detail-row">
                <strong>Patient:</strong>
                <span>{selectedAppointment.user?.firstname} {selectedAppointment.user?.lastname}</span>
              </div>
              <div className="doctordas-appointment-detail-row">
                <strong>Date & Time:</strong>
                <span>{formatDate(selectedAppointment.appointment_date)}</span>
              </div>
              <div className="doctordas-appointment-detail-row">
                <strong>Purpose:</strong>
                <span>{selectedAppointment.purpose || 'General Checkup'}</span>
              </div>
              <div className="doctordas-appointment-detail-row">
                <strong>Status:</strong>
                <span className={`doctordas-status ${getStatusColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status}
                </span>
              </div>
              {selectedAppointment.notes && (
                <div className="doctordas-appointment-detail-row">
                  <strong>Notes:</strong>
                  <span>{selectedAppointment.notes}</span>
                </div>
              )}
              <div className="doctordas-appointment-detail-row">
                <strong>Contact:</strong>
                <span>{selectedAppointment.user?.contact || 'N/A'}</span>
              </div>
              <div className="doctordas-appointment-detail-row">
                <strong>Email:</strong>
                <span>{selectedAppointment.user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      {showNewAppointmentModal && (
        <div className="doctordas-modal-overlay" onClick={() => setShowNewAppointmentModal(false)}>
          <div className="doctordas-modal" onClick={(e) => e.stopPropagation()}>
            <div className="doctordas-modal-header">
              <h3 className="doctordas-modal-title">Create New Appointment</h3>
              <button 
                className="doctordas-modal-close"
                onClick={() => setShowNewAppointmentModal(false)}
              >
                ×
              </button>
            </div>
            <div className="doctordas-new-appointment-form">
              <div className="doctordas-form-group">
                <label>Select Patient</label>
                <select
                  value={newAppointmentData.patient_id}
                  onChange={(e) => setNewAppointmentData({
                    ...newAppointmentData,
                    patient_id: e.target.value
                  })}
                >
                  <option value="">Choose a patient...</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstname} {patient.lastname} - {patient.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="doctordas-form-group">
                <label>Appointment Date & Time</label>
                <input
                  type="datetime-local"
                  value={newAppointmentData.appointment_date}
                  onChange={(e) => setNewAppointmentData({
                    ...newAppointmentData,
                    appointment_date: e.target.value
                  })}
                />
              </div>
              <div className="doctordas-form-group">
                <label>Purpose</label>
                <input
                  type="text"
                  placeholder="e.g., Prenatal Checkup, Ultrasound, Consultation"
                  value={newAppointmentData.purpose}
                  onChange={(e) => setNewAppointmentData({
                    ...newAppointmentData,
                    purpose: e.target.value
                  })}
                />
              </div>
              <div className="doctordas-form-group">
                <label>Notes (Optional)</label>
                <textarea
                  placeholder="Additional notes about the appointment..."
                  value={newAppointmentData.notes}
                  onChange={(e) => setNewAppointmentData({
                    ...newAppointmentData,
                    notes: e.target.value
                  })}
                  rows="3"
                />
              </div>
              <div className="doctordas-modal-actions">
                <button 
                  className="doctordas-btn doctordas-btn-secondary"
                  onClick={() => setShowNewAppointmentModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="doctordas-btn doctordas-btn-primary"
                  onClick={handleCreateAppointment}
                  disabled={!newAppointmentData.patient_id || !newAppointmentData.appointment_date}
                >
                  Create Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboardApp;