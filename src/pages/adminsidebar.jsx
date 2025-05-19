import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssonly/adminsidebar.css';

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <nav>
        <ul className="sidebar-nav">
          <li onClick={() => navigate('/dashboard')} className="sidebar-link">Dashboard</li>
          <li onClick={() => navigate('/AddDoctorForm')} className="sidebar-link">Add Doctors</li>
          <li onClick={() => navigate('/RemoveDoctor')} className="sidebar-link">Remove Doctors</li>

          <li onClick={() => navigate('/dashboard#reports')} className="sidebar-link">Generate Report</li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
