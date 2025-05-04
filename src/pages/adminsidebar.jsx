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
          <li onClick={() => navigate('/dashboard#users')} className="sidebar-link">Users</li>
          <li onClick={() => navigate('/AddDoctorForm')} className="sidebar-link">Add Doctors</li>
          <li onClick={() => navigate('/dashboard#reports')} className="sidebar-link">Reports</li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
