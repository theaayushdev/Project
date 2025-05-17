import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar'; // Make sure this is imported correctly

const Removedoctor = () => {
  const [activeTab, setActiveTab] = useState('doctors'); // Use lowercase to match logic
  const [doctors, setDoctors] = useState([]);

  // Fetch doctors
  useEffect(() => {
    axios.get('http://localhost:5000/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error("Error fetching doctors:", err));
  }, []);

  return (
    <div className="remove-dashboard">
      <AdminSidebar setActiveTab={setActiveTab} />
      <div className="main-content">
        <div className="content-header">
          <h1>{activeTab === 'doctors' ? 'Doctors' : 'Users'}</h1>
          <p className="entries-info">
            Showing 1–{doctors.length} of {doctors.length} entries
          </p>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Specialty</th>
                <th>Department</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.firstname} {doctor.lastname}</td>
                  <td>{doctor.phone_number}</td>
                  <td>{doctor.specialty}</td>
                  <td>{doctor.department}</td>
                  <td>{doctor.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Removedoctor;
