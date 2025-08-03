import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from './adminsidebar'; 
import '../cssonly/removedoctor.css';

const Removedoctor = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = () => {
    axios.get('http://localhost:5000/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error("Error fetching doctors:", err));
  };

  const handleRemoveDoctor = (doctorId) => {
    axios.put(`http://localhost:5000/doctors/${doctorId}/remove`)
      .then(res => {
        console.log(res.data.message);
        fetchDoctors(); // Refresh list after removal
      })
      .catch(err => console.error("Error removing doctor:", err));
  };

  return (
    <div className="remove-dashboard" style={{ display: 'flex' }}>
      <AdminSidebar />
      <div className="main-content" style={{ flex: 1, padding: '20px' }}>
        <h1>Doctors List</h1>
        <p>Showing {doctors.length} doctors</p>

        <table className="doctor-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th style={thStyle}>Name</th>
      <th style={thStyle}>Phone</th>
      <th style={thStyle}>Specialty</th>
      <th style={thStyle}>Department</th>
      <th style={thStyle}>Email</th>
      <th style={thStyle}>Status</th> {/* New Status Column */}
      <th style={thStyle}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {doctors.map((doctor) => (
      <tr key={doctor.id} style={trStyle}>
        <td style={tdStyle}>{doctor.firstname} {doctor.lastname}</td>
        <td style={tdStyle}>{doctor.phone_number}</td>
        <td style={tdStyle}>{doctor.specialty}</td>
        <td style={tdStyle}>{doctor.department}</td>
        <td style={tdStyle}>{doctor.email}</td>
        <td style={tdStyle}>
          <span style={{
            color: doctor.status === 'on' ? 'green' : 'red',
            fontWeight: 'bold'
          }}>
            {doctor.status.toUpperCase()}
          </span>
        </td>
        <td style={tdStyle}>
          {doctor.status === 'on' ? (
            <button
              onClick={() => handleRemoveDoctor(doctor.id)}
              style={{
                backgroundColor: '#d32f2f',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                float: 'right'
              }}
            >
              Remove
            </button>
          ) : (
            <span style={{ fontStyle: 'italic', color: '#aaa' }}>Already Removed</span>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
    </div>
  );
};

// Simple styles
const thStyle = { borderBottom: '2px solid #ccc', padding: '10px', textAlign: 'left' };
const tdStyle = { borderBottom: '1px solid #eee', padding: '10px' };
const trStyle = { backgroundColor: '#fff' };

export default Removedoctor;
