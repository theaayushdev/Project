import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import "../cssonly/admindashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users:", err));

    axios.get('http://localhost:5000/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error("Error fetching doctors:", err));
  }, []);

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="main-content">
        <div className="content-header">
          <h1>{activeTab === 'users' ? 'Users' : 'Doctors'}</h1>
          <p className="entries-info">
            Showing 1–{activeTab === 'users' ? users.length : doctors.length} of {activeTab === 'users' ? users.length : doctors.length} entries
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`tab ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            Doctors
          </button>
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              {activeTab === 'users' ? (
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Age</th>
                  <th>Blood Type</th>
                  <th>Email</th>
                </tr>
              ) : (
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Specialty</th>
                  <th>Department</th>
                  <th>Email</th>
                </tr>
              )}
            </thead>
            <tbody>
              {activeTab === 'users'
                ? users.map(user => (
                  <tr key={user.patient_id}>
                    <td>{user.firstname} {user.lastname}</td>
                    <td>{user.contact}</td>
                    <td>{user.location}</td>
                    <td>{user.age}</td>
                    <td>{user.bloodtype}</td>
                    <td>{user.email}</td>
                  </tr>
                ))
                : doctors.map(doc => (
                  <tr key={doc.id}>
                    <td>{doc.firstname} {doc.lastname}</td>
                    <td>{doc.phone_number}</td>
                    <td>{doc.specialty}</td>
                    <td>{doc.department}</td>
                    <td>{doc.email}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button disabled>Previous</button>
          <button className="active">1</button>
          <button disabled>Next</button>
        </div>

        {/* Footer */}
        <div className="footer">
          &copy; 2025 Admin Panel. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
