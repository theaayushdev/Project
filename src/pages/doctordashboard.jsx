import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Activity, Stethoscope, Award, Clock, Phone, Mail, MessageCircle, User, Calendar as CalendarIcon, MessageSquare, Heart, Plus, MapPin, Baby } from 'lucide-react';
import ChatModal from '../components/Chat/ChatModal';
import '../cssonly/doctordashboard-single.css';
import '../cssonly/doctor-welcome-modern.css';
import '../cssonly/pregnancy-modal.css';

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
  
  // Chat states - removed, now using ChatModal
  
  // Profile states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({});
  
  // Modal states
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
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
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const navigate = useNavigate();
  // Refs - removed chat refs, now using ChatModal

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
  const [showPregnancyModal, setShowPregnancyModal] = useState(false);
const [selectedPatientPregnancy, setSelectedPatientPregnancy] = useState(null);
const [pregnancyInfo, setPregnancyInfo] = useState(null);
const [loadingPregnancy, setLoadingPregnancy] = useState(false);

// Add this function to fetch pregnancy info
const fetchPregnancyInfo = async (patientId) => {
  setLoadingPregnancy(true);
  try {
    const response = await fetch(`http://127.0.0.1:5000/pregnancy-info/${patientId}`);
    const data = await response.json();
    
    if (data.success) {
      setPregnancyInfo(data.data);
    } else {
      setPregnancyInfo(null);
    }
  } catch (error) {
    console.error('Error fetching pregnancy info:', error);
    setPregnancyInfo(null);
  } finally {
    setLoadingPregnancy(false);
  }
};
// Add this function to handle patient card click
const handlePatientClick = async (patient) => {
  setSelectedPatientPregnancy(patient);
  setShowPregnancyModal(true);
  await fetchPregnancyInfo(patient.id);
};

  // Fetch doctor data and verify
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const doctorData = localStorage.getItem('doctorData');
        if (doctorData) {
          const parsedDoctor = JSON.parse(doctorData);
          
          // Verify doctor data with backend and get the complete data
          const response = await fetch(`http://127.0.0.1:5000/doctors`);
          if (!response.ok) {
            throw new Error('Doctor data verification failed');
          }
          
          // Get the full doctor data from the backend including profile_photo
          const allDoctors = await response.json();
          const fullDoctorData = allDoctors.find(d => d.id === parsedDoctor.id);
          if (fullDoctorData) {
            console.log("Full doctor data from backend:", fullDoctorData);
            setDoctor(fullDoctorData); // Use the complete backend data with all fields
          } else {
            setDoctor(parsedDoctor); // Fallback to localStorage data
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
          console.log('Appointments data received:', appointmentsData);
          setAppointments(appointmentsData);
        } else {
          console.error('Failed to fetch appointments:', appointmentsResponse.status);
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

  // Chat functionality removed - now using ChatModal

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

  // formatTime removed - was only used for chat

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
                onClick={() => setIsChatOpen(true)}
                className="doctordas-sidebar-link"
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
              {/* Modern Doctor Profile Header */}
              <div className="doctor-profile-header">
                <div className="doctor-profile-card">
                  <div className="doctor-profile-main">
                    <div className="doctor-avatar-section">
                      <img
                        src={doctor?.profile_photo ? (doctor.profile_photo.startsWith('http') ? doctor.profile_photo : `http://127.0.0.1:5000/uploads/doctor_photos/${doctor.profile_photo}`) : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'}
                        alt={`Dr. ${doctor?.firstname} ${doctor?.lastname}`}
                        className="doctor-avatar-image"
                        onError={e => { 
                          console.log("Image failed to load:", doctor?.profile_photo);
                          e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'; 
                        }}
                      />
                      <div className="doctor-status-indicator">
                        <span className="status-dot-active"></span>
                      </div>
                    </div>
                    
                    <div className="doctor-info-section">
                      <div className="doctor-name-title">
                        <h1>Dr. {doctor?.firstname} {doctor?.lastname}</h1>
                        <div className="doctor-credentials">
                          <span className="specialty-badge">{doctor?.specialty || 'Medical Specialist'}</span>
                          {doctor?.years_of_experience && (
                            <span className="experience-text">{doctor.years_of_experience} years experience</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="doctor-details-professional">
                        <div className="detail-row">
                          <Mail size={16} />
                          <span className="detail-label">Email:</span>
                          <span className="detail-text">{doctor?.email || 'Not available'}</span>
                        </div>
                        <div className="detail-row">
                          <Phone size={16} />
                          <span className="detail-label">Phone:</span>
                          <span className="detail-text">{doctor?.phone_number || 'Not available'}</span>
                        </div>
                        <div className="detail-row">
                          <Stethoscope size={16} />
                          <span className="detail-label">Department:</span>
                          <span className="detail-text">{doctor?.department || 'General'}</span>
                        </div>
                        <div className="detail-row">
                          <Award size={16} />
                          <span className="detail-label">License:</span>
                          <span className="detail-text">{doctor?.medical_license_number?.substring(0, 12) || 'Not available'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="doctor-stats-professional">
                    <div className="stat-card-pro">
                      <div className="stat-icon-pro patients-stat">
                        <Users size={20} />
                      </div>
                      <div className="stat-info">
                        <div className="stat-number-pro">{stats?.total_patients || 0}</div>
                        <div className="stat-label-pro">Total Patients</div>
                      </div>
                    </div>
                    <div className="stat-card-pro">
                      <div className="stat-icon-pro calendar-stat">
                        <Calendar size={20} />
                      </div>
                      <div className="stat-info">
                        <div className="stat-number-pro">{stats?.today_appointments || 0}</div>
                        <div className="stat-label-pro">Today's Appointments</div>
                      </div>
                    </div>
                    <div className="stat-card-pro">
                      <div className="stat-icon-pro activity-stat">
                        <Activity size={20} />
                      </div>
                      <div className="stat-info">
                        <div className="stat-number-pro">{stats?.unread_messages || 0}</div>
                        <div className="stat-label-pro">New Messages</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modern Dashboard Content */}
              <div className="modern-dashboard-grid">
                {/* Top Patients Section */}
                <div className="modern-card">
                  <div className="modern-card-header">
                    <div className="card-header-content">
                      <h3>Top Patients</h3>
                      <span className="patient-count">{patients.length} total patients</span>
                    </div>
                  </div>
                  <div className="modern-card-content">
                    {patients.length === 0 ? (
                      <div className="empty-state">
                        <Users size={48} className="empty-icon" />
                        <h4>No patients found</h4>
                        <p>Start by booking appointments with patients</p>
                      </div>
                    ) : (
                      <div className="patients-list">
                        {patients.slice(0, 5).map((patient) => (
                          <div 
                            key={patient.id} 
                            className="patient-card-modern"
                            onClick={() => setActiveSection('patients')}
                          >
                            <div className="patient-avatar-modern">
                              {patient.firstname?.[0]}{patient.lastname?.[0]}
                            </div>
                            <div className="patient-info-modern">
                              <div className="patient-header-modern">
                                <h4>{patient.firstname} {patient.lastname}</h4>
                                <span className="patient-age">{patient.age || 'N/A'} yrs</span>
                              </div>
                              <div className="patient-details-modern">
                                <div className="patient-detail-item">
                                  <Mail size={14} />
                                  <span>{patient.email}</span>
                                </div>
                                <div className="patient-detail-item">
                                  <Phone size={14} />
                                  <span>{patient.contact || 'Not provided'}</span>
                                </div>
                                {patient.due_date && (
                                  <div className="patient-detail-item due-date">
                                    <Calendar size={14} />
                                    <span>Due: {new Date(patient.due_date).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {patient.pregnancy_week && (
                                  <div className="patient-detail-item pregnancy-week">
                                    <Heart size={14} />
                                    <span>Week {patient.pregnancy_week}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="patient-actions-modern">
                              <button 
                                className="action-btn primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsChatOpen(true);
                                }}
                              >
                                <MessageCircle size={16} />
                                Chat
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Messages Section */}
                <div className="modern-card">
                  <div className="modern-card-header">
                    <div className="card-header-content">
                      <h3>Recent Messages</h3>
                      <span className="message-count">{messages.length} conversations</span>
                    </div>
                  </div>
                  <div className="modern-card-content">
                    {messages.length === 0 ? (
                      <div className="empty-state">
                        <MessageCircle size={48} className="empty-icon" />
                        <h4>No messages yet</h4>
                        <p>Start a conversation with your patients</p>
                      </div>
                    ) : (
                      <div className="messages-list">
                        {messages.slice(0, 5).map((message, index) => (
                          <div 
                            key={message.id || index} 
                            className="message-card-modern"
                            onClick={() => setIsChatOpen(true)}
                          >
                            <div className="message-avatar-modern" style={{
                              background: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
                            }}>
                              {message.sender?.firstname?.[0] || message.user?.firstname?.[0] || '?'}
                            </div>
                            <div className="message-info-modern">
                              <div className="message-header-modern">
                                <h4>{message.sender?.firstname || message.user?.firstname || 'Patient'} {message.sender?.lastname || message.user?.lastname || ''}</h4>
                                <span className="message-time-modern">
                                  {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Now'}
                                </span>
                              </div>
                              <p className="message-preview">
                                {message.content?.substring(0, 80) || message.message?.substring(0, 80) || 'New message'}...
                              </p>
                              {!message.is_read && (
                                <div className="unread-indicator">
                                  <span className="unread-dot"></span>
                                  <span className="unread-text">New</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Upcoming Appointments Section */}
              <div className="modern-card appointments-card">
                <div className="modern-card-header">
                  <div className="card-header-content">
                    <h3>Upcoming Appointments</h3>
                    <span className="appointment-count">{appointments.length} scheduled</span>
                  </div>
                  <button 
                    className="add-appointment-btn"
                    onClick={handleNewAppointment}
                  >
                    <Plus size={16} />
                    New Appointment
                  </button>
                </div>
                <div className="modern-card-content">
                  {appointments.length === 0 ? (
                    <div className="empty-state">
                      <Calendar size={48} className="empty-icon" />
                      <h4>No appointments scheduled</h4>
                      <p>Your schedule is clear for now</p>
                    </div>
                  ) : (
                    <div className="appointments-list">
                      {appointments.slice(0, 6).map((appointment) => (
                        <div 
                          key={appointment.id} 
                          className="appointment-card-modern"
                          onClick={() => handleViewAppointment(appointment)}
                        >
                          <div className="appointment-date-section">
                            <div className="appointment-day">
                              {new Date(appointment.appointment_date).getDate()}
                            </div>
                            <div className="appointment-month">
                              {new Date(appointment.appointment_date).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                          </div>
                          <div className="appointment-info-section">
                            <div className="appointment-patient">
                              <h4>{appointment.user?.firstname} {appointment.user?.lastname}</h4>
                              <div className="appointment-time">
                                <Clock size={14} />
                                <span>{new Date(appointment.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                            </div>
                            <div className="appointment-details">
                              <span className="appointment-purpose">{appointment.purpose || 'General Consultation'}</span>
                              {appointment.notes && (
                                <p className="appointment-notes">{appointment.notes.substring(0, 50)}...</p>
                              )}
                            </div>
                          </div>
                          <div className="appointment-status-section">
                            <span className={`status-badge ${appointment.status?.toLowerCase() || 'pending'}`}>
                              {appointment.status || 'Pending'}
                            </span>
                            <div className="appointment-contact">
                              <Phone size={14} />
                              <span>{appointment.user?.contact || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
                          {appointment.patient?.firstname?.[0] || 'P'}{appointment.patient?.lastname?.[0] || 'T'}
                        </div>
                        <div className="doctordas-appointment-info">
                          <p className="doctordas-patient-name">
                            {appointment.patient?.firstname || 'Unknown'} {appointment.patient?.lastname || 'Patient'}
                          </p>
                          <div className="doctordas-appointment-details">
                            <span className="doctordas-appointment-date">
                              {formatDate(appointment.appointment_date)}
                            </span>
                            <span className="doctordas-appointment-contact">
                              📞 {appointment.patient?.contact || 'No contact'}
                            </span>
                            {appointment.patient?.age && (
                              <span className="doctordas-appointment-age">
                                Age: {appointment.patient.age}
                              </span>
                            )}
                            {appointment.patient?.bloodtype && (
                              <span className="doctordas-appointment-blood">
                                Blood Type: {appointment.patient.bloodtype}
                              </span>
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

          // Replace your existing Patients Section with this:
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
          return (
            <div 
              key={patient.id} 
              className="doctordas-patient-card"
              onClick={() => handlePatientClick(patient)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div className="doctordas-patient-photo">
                {patient.firstname?.[0]}{patient.lastname?.[0]}
              </div>
              <div className="doctordas-patient-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4>{patient.firstname} {patient.lastname}</h4>
                  {patient.has_pregnancy_info && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      background: '#fdf2f8',
                      color: '#be185d',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      <Baby size={14} />
                      <span>Pregnancy Info</span>
                    </div>
                  )}
                </div>
                <div className="doctordas-patient-details">
                  <div className="doctordas-patient-detail">
                    <Mail size={16} />
                    <span>{patient.email}</span>
                  </div>
                  <div className="doctordas-patient-detail">
                    <Phone size={16} />
                    <span>{patient.contact || 'N/A'}</span>
                  </div>
                  <div className="doctordas-patient-detail">
                    <User size={16} />
                    <span>{patient.age || 'N/A'} years old</span>
                  </div>
                  <div className="doctordas-patient-detail">
                    <MapPin size={16} />
                    <span>{patient.location || 'N/A'}</span>
                  </div>
                  {patient.pregnancy_info && (
                    <>
                      <div className="doctordas-patient-detail" style={{ color: '#ec4899', fontWeight: '500' }}>
                        <Heart size={16} />
                        <span>Week {patient.pregnancy_info.weeks_pregnant || 'N/A'}</span>
                      </div>
                      <div className="doctordas-patient-detail" style={{ color: '#ec4899', fontWeight: '500' }}>
                        <Calendar size={16} />
                        <span>Due: {patient.pregnancy_info.due_date ? new Date(patient.pregnancy_info.due_date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="doctordas-patient-actions" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="doctordas-btn-patient doctordas-btn-patient-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPatient(patient);
                      setIsChatOpen(true);
                    }}
                  >
                    <span>💬</span>
                    <span>Message</span>
                  </button>
                  <button 
                    className="doctordas-btn-patient doctordas-btn-patient-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
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
                <span>{selectedAppointment.patient?.firstname || 'Unknown'} {selectedAppointment.patient?.lastname || 'Patient'}</span>
              </div>
              <div className="doctordas-appointment-detail-row">
                <strong>Date & Time:</strong>
                <span>{formatDate(selectedAppointment.appointment_date)}</span>
              </div>
              <div className="doctordas-appointment-detail-row">
                <strong>Status:</strong>
                <span className={`doctordas-status ${getStatusColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status}
                </span>
              </div>
              <div className="doctordas-appointment-detail-row">
                <strong>Contact:</strong>
                <span>{selectedAppointment.patient?.contact || 'N/A'}</span>
              </div>
              <div className="doctordas-appointment-detail-row">
                <strong>Email:</strong>
                <span>{selectedAppointment.patient?.email || 'N/A'}</span>
              </div>
              {selectedAppointment.patient?.age && (
                <div className="doctordas-appointment-detail-row">
                  <strong>Age:</strong>
                  <span>{selectedAppointment.patient.age} years</span>
                </div>
              )}
              {selectedAppointment.patient?.bloodtype && (
                <div className="doctordas-appointment-detail-row">
                  <strong>Blood Type:</strong>
                  <span>{selectedAppointment.patient.bloodtype}</span>
                </div>
              )}
              {selectedAppointment.patient?.location && (
                <div className="doctordas-appointment-detail-row">
                  <strong>Location:</strong>
                  <span>{selectedAppointment.patient.location}</span>
                </div>
              )}
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
      
      {/* Pregnancy Info Modal */}
      {showPregnancyModal && selectedPatientPregnancy && (
        <div className="doctordas-modal-overlay" onClick={() => setShowPregnancyModal(false)}>
          <div className="doctordas-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="doctordas-modal-header">
              <h3 className="doctordas-modal-title">
                <Baby size={20} style={{ marginRight: '8px', color: '#ec4899' }} />
                Pregnancy Information - {selectedPatientPregnancy.firstname} {selectedPatientPregnancy.lastname}
              </h3>
              <button 
                className="doctordas-modal-close"
                onClick={() => setShowPregnancyModal(false)}
              >
                ×
              </button>
            </div>
            <div className="doctordas-pregnancy-info-modal">
              {loadingPregnancy ? (
                <div className="doctordas-loading" style={{ padding: '40px', textAlign: 'center' }}>
                  <div className="doctordas-loading-spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px' }}></div>
                  <p>Loading pregnancy information...</p>
                </div>
              ) : pregnancyInfo ? (
                <div className="pregnancy-details-grid">
                  <div className="pregnancy-detail-card">
                    <div className="pregnancy-detail-header">
                      <Heart size={18} style={{ color: '#ec4899' }} />
                      <h4>Basic Information</h4>
                    </div>
                    <div className="pregnancy-detail-content">
                      <div className="pregnancy-detail-row">
                        <strong>Weeks Pregnant:</strong>
                        <span className="pregnancy-weeks">{pregnancyInfo.weeks_pregnant || 'Not specified'}</span>
                      </div>
                      <div className="pregnancy-detail-row">
                        <strong>Due Date:</strong>
                        <span>{pregnancyInfo.due_date ? new Date(pregnancyInfo.due_date).toLocaleDateString() : 'Not specified'}</span>
                      </div>
                      <div className="pregnancy-detail-row">
                        <strong>Height:</strong>
                        <span>{pregnancyInfo.height ? `${pregnancyInfo.height} cm` : 'Not specified'}</span>
                      </div>
                      <div className="pregnancy-detail-row">
                        <strong>Weight:</strong>
                        <span>{pregnancyInfo.weight ? `${pregnancyInfo.weight} kg` : 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pregnancy-detail-card">
                    <div className="pregnancy-detail-header">
                      <User size={18} style={{ color: '#3b82f6' }} />
                      <h4>Personal Information</h4>
                    </div>
                    <div className="pregnancy-detail-content">
                      <div className="pregnancy-detail-row">
                        <strong>Profession:</strong>
                        <span>{pregnancyInfo.profession || 'Not specified'}</span>
                      </div>
                      <div className="pregnancy-detail-row">
                        <strong>Gravida:</strong>
                        <span>{pregnancyInfo.gravida || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {(pregnancyInfo.allergies || pregnancyInfo.conditions) && (
                    <div className="pregnancy-detail-card">
                      <div className="pregnancy-detail-header">
                        <Activity size={18} style={{ color: '#f59e0b' }} />
                        <h4>Medical Information</h4>
                      </div>
                      <div className="pregnancy-detail-content">
                        {pregnancyInfo.allergies && (
                          <div className="pregnancy-detail-row">
                            <strong>Allergies:</strong>
                            <span>{pregnancyInfo.allergies}</span>
                          </div>
                        )}
                        {pregnancyInfo.conditions && (
                          <div className="pregnancy-detail-row">
                            <strong>Conditions:</strong>
                            <span>{pregnancyInfo.conditions}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {pregnancyInfo.notes && (
                    <div className="pregnancy-detail-card" style={{ gridColumn: '1 / -1' }}>
                      <div className="pregnancy-detail-header">
                        <MessageSquare size={18} style={{ color: '#10b981' }} />
                        <h4>Additional Notes</h4>
                      </div>
                      <div className="pregnancy-detail-content">
                        <p style={{ 
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          lineHeight: '1.5',
                          color: '#475569',
                          margin: 0
                        }}>
                          {pregnancyInfo.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="doctordas-empty-state" style={{ padding: '40px', textAlign: 'center' }}>
                  <Baby size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                  <h4>No Pregnancy Information</h4>
                  <p>No pregnancy information has been recorded for this patient yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Modal */}
      <ChatModal 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userType="doctor"
        userId={doctor?.id}
      />
    </div>
  );
};

export default DoctorDashboardApp;
