import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from './adminsidebar'; 
import '../cssonly/removedoctor.css';

const Removedoctor = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error("Error fetching doctors:", err));
  }, []);

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
              {/* <th style={thStyle}>Actions</th> */}
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
                {/* <td style={tdStyle}><button onClick={() => handleRemove(doctor.id)}>Remove</button></td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Simple styles (you can also move to CSS)
const thStyle = { borderBottom: '2px solid #ccc', padding: '10px', textAlign: 'left' };
const tdStyle = { borderBottom: '1px solid #eee', padding: '10px' };
const trStyle = { backgroundColor: '#fff' };

export default Removedoctor;
