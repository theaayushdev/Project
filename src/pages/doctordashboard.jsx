import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../cssonly/doctordashboard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 

const PatientSidebar = ({ onSelect }) => {
  return (
    <div className="patient-sidebar">
      <h2 className="sidebar-title">Hi, Doctor</h2>
      <nav>
        <ul className="sidebar-nav">
          <li className="sidebar-link" onClick={() => onSelect('dashboard')}>Dashboard</li>
          <li className="sidebar-link" onClick={() => onSelect('appointments')}>My Appointments</li>
          <li className="sidebar-link" onClick={() => onSelect('records')}>Medical Records</li>
          <li className="sidebar-link" onClick={() => onSelect('messages')}>Messages</li>
          <li className="sidebar-link" onClick={() => onSelect('profile')}>Profile</li>
          <li className="sidebar-link" onClick={() => onSelect('userhome')}>Logout</li>
        </ul>
      </nav>
    </div>
  );
};

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([
    { date: "May 6, 2025", doctor: "Dr. Scarrlet", patient: "Ayush", status: "Confirmed" },
    { date: "May 12, 2025", doctor: "Dr. johnson", patient: "Abhinab", status: "Confirmed" },
    { date: "May 12, 2025", doctor: "Dr. Gwen", patient: "Ashreeya", status: "Confirmed" },
  ]);

  const handleStatusChange = (index) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].status = updatedAppointments[index].status === "Confirmed" ? "Pending" : "Confirmed";
    setAppointments(updatedAppointments);
    toast.info(`Status changed for ${updatedAppointments[index].patient} to ${updatedAppointments[index].status}`);
  };

  return (
    <div className="dashboard-section list">
      <h3>Upcoming Appointments</h3>
      <ul>
        {appointments.map((appointment, index) => (
          <li key={index}>
            <strong>{appointment.date}</strong> - {appointment.patient} with {appointment.doctor} 
            <button 
              className={`status-btn status-${appointment.status.toLowerCase()}`} 
              onClick={() => handleStatusChange(index)}
            >
              {appointment.status}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PatientDashboardMain = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="dashboard-main">
      <h2 className="dashboard-header">Take a look at your Patient</h2>
      <div className="dashboard-content">
        <AppointmentList />
        <div className="dashboard-section calendar">
          <h3>Personal Health Calendar</h3>
          <Calendar onChange={setDate} value={date} />
        </div>
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  const navigate = useNavigate(); // 

  const handleSelect = (section) => {
    if (section === 'userhome') {
      navigate('/userhome'); 
    }
    // You can handle other sections here later if needed
  };

  return (
    <div className="dashboard-container">
      <PatientSidebar onSelect={handleSelect} />
      <PatientDashboardMain />
    </div>
  );
};

export default PatientDashboard;
