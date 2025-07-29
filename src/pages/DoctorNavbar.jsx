import React from 'react';
import '../cssonly/doctordashboard.css';

const DoctorNavbar = () => (
  <div className="doc1-page-header">
    <h2 className="doc1-page-title">Dashboard</h2>
    <div className="doc1-page-actions">
      <div className="doc1-search-bar">
        <i className="fa fa-search"></i>
        <input type="text" placeholder="Search patients, appointments..." />
      </div>
      <div className="doc1-user-profile">
        <div className="doc1-notification-icon">
          <i className="fa fa-bell"></i>
          <span className="doc1-badge">3</span>
        </div>
        <div className="doc1-avatar">DR</div>
      </div>
    </div>
  </div>
);

export default DoctorNavbar; 