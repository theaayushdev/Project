import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorSidebar = ({ onSelect, activeSection, doctor }) => {
  const navigate = useNavigate();

  // Navigation menu items
  const menuItems = [
    { 
      id: 'dashboard', 
      icon: '🏥', 
      label: 'Dashboard',
      description: 'Overview & Analytics'
    },
    { 
      id: 'appointments', 
      icon: '📅', 
      label: 'Appointments',
      description: 'Manage Schedule'
    },
    { 
      id: 'patients', 
      icon: '👥', 
      label: 'Patients',
      description: 'Patient List'
    },
    { 
      id: 'messages', 
      icon: '💬', 
      label: 'Messages',
      description: 'Patient Communication'
    },
    { 
      id: 'messaging', 
      icon: '💬', 
      label: 'Chat',
      description: 'Real-time Chat'
    },
    { 
      id: 'records', 
      icon: '📋', 
      label: 'Records',
      description: 'Medical Records'
    },
    { 
      id: 'profile', 
      icon: '👨‍⚕️', 
      label: 'Profile',
      description: 'Account Settings'
    }
  ];

  const handleSectionSelect = (section) => {
    onSelect(section);
  };

  const handleLogout = () => {
    localStorage.removeItem('doctorData');
    navigate('/doctorlogin');
  };

  return (
    <div className="doctor-sidebar">
      {/* Logo and Brand */}
      <div className="doctor-sidebar-logo">
        <div className="doctor-sidebar-logo-icon">
          <span>🏥</span>
        </div>
        <div>
          <h1>Pregnify</h1>
          <p>Doctor Portal</p>
        </div>
      </div>

      {/* Doctor Info */}
      {doctor && (
        <div className="doctor-sidebar-profile">
          <div className="doctor-avatar">
            {doctor.firstname?.[0]}{doctor.lastname?.[0]}
          </div>
          <div className="doctor-profile-info">
            <p className="doctor-profile-name">
              Dr. {doctor.firstname} {doctor.lastname}
            </p>
            <p className="doctor-profile-specialty">
              {doctor.specialty}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="doctor-sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleSectionSelect(item.id)}
                className={`doctor-sidebar-link ${activeSection === item.id ? 'active' : ''}`}
              >
                <span className="doctor-sidebar-icon">{item.icon}</span>
                <div className="doctor-sidebar-text">
                  <span className="doctor-sidebar-label">{item.label}</span>
                  <span className="doctor-sidebar-description">{item.description}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="doctor-sidebar-footer">
        <button
          onClick={handleLogout}
          className="doctor-sidebar-link doctor-sidebar-logout"
        >
          <span className="doctor-sidebar-icon">🚪</span>
          <div className="doctor-sidebar-text">
            <span className="doctor-sidebar-label">Logout</span>
            <span className="doctor-sidebar-description">Sign out</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default DoctorSidebar; 