import React from 'react';
import '../cssonly/doctordashboard.css';

const DoctorSidebar = ({ onSelect, activeSection }) => {
  return (
    <div className="doc1-sidebar">
      <div className="doc1-sidebar-logo">
        <i className="fa fa-user-md"></i>
        <h1>Pregnify</h1>
      </div>
      <h2 className="doc1-sidebar-title">Hi, Doctor</h2>
      <nav>
        <ul className="doc1-sidebar-nav">
          <li 
            className={`doc1-sidebar-link ${activeSection === 'dashboard' ? 'active' : ''}`} 
            onClick={() => onSelect('dashboard')}
          >
            <i className="fa fa-dashboard"></i>
            <span>Dashboard</span>
          </li>
          <li 
            className={`doc1-sidebar-link ${activeSection === 'appointments' ? 'active' : ''}`} 
            onClick={() => onSelect('appointments')}
          >
            <i className="fa fa-calendar"></i>
            <span>My Appointments</span>
          </li>
          <li 
            className={`doc1-sidebar-link ${activeSection === 'records' ? 'active' : ''}`} 
            onClick={() => onSelect('records')}
          >
            <i className="fa fa-file-medical"></i>
            <span>Medical Records</span>
          </li>
          <li 
            className={`doc1-sidebar-link ${activeSection === 'messages' ? 'active' : ''}`} 
            onClick={() => onSelect('messages')}
          >
            <i className="fa fa-comments"></i>
            <span>Messages</span>
          </li>
          <li 
            className={`doc1-sidebar-link ${activeSection === 'messaging' ? 'active' : ''}`} 
            onClick={() => onSelect('messaging')}
          >
            <i className="fa fa-envelope"></i>
            <span>Messaging</span>
          </li>
          <li 
            className={`doc1-sidebar-link ${activeSection === 'profile' ? 'active' : ''}`} 
            onClick={() => onSelect('profile')}
          >
            <i className="fa fa-cog"></i>
            <span>Profile</span>
          </li>
          <li 
            className="doc1-sidebar-link" 
            onClick={() => onSelect('userhome')}
          >
            <i className="fa fa-sign-out"></i>
            <span>Logout</span>
          </li>
        </ul>
      </nav>
      <div className="doc1-sidebar-footer">
       Pregnify v2.5
      </div>
    </div>
  );
};

export default DoctorSidebar; 