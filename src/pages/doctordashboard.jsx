import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import "../cssonly/doctordashboard.css";

// Enhanced PatientSidebar using doc1 classes
const PatientSidebar = ({ onSelect, activeSection }) => {
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

// Enhanced AppointmentList using doc2 classes
const AppointmentList = () => {
  const [appointments, setAppointments] = useState([
    { date: "May 6, 2025", time: "10:30 AM", doctor: "Dr. Scarrlet", patient: "Ayush", purpose: "General Checkup", status: "Confirmed" },
    { date: "May 12, 2025", time: "2:15 PM", doctor: "Dr. Johnson", patient: "Abhinab ", purpose: "Follow-up", status: "Confirmed" },
    { date: "May 12, 2025", time: "4:00 PM", doctor: "Dr. Gwen", patient: "Ashreeya", purpose: "Consultation", status: "Confirmed" },
  ]);

  const handleStatusChange = (index) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].status = updatedAppointments[index].status === "Confirmed" ? "Pending" : "Confirmed";
    setAppointments(updatedAppointments);
    
    const statusMessage = `Status changed for ${updatedAppointments[index].patient} to ${updatedAppointments[index].status}`;
    toast.info(statusMessage);
    
    // Display custom toast
    const toastElement = document.createElement('div');
    toastElement.className = `doc9-toast doc9-toast-info`;
    toastElement.innerHTML = `
      <div class="doc9-toast-icon"><i class="fa fa-info-circle"></i></div>
      <div class="doc9-toast-content">
        <div class="doc9-toast-title">Status Updated</div>
        <div class="doc9-toast-message">${statusMessage}</div>
      </div>
      <button class="doc9-toast-close">&times;</button>
    `;
    
    const toastContainer = document.querySelector('.doc9-toast-container') || createToastContainer();
    toastContainer.appendChild(toastElement);
    
    setTimeout(() => {
      toastElement.style.opacity = '0';
      setTimeout(() => toastElement.remove(), 300);
    }, 3000);
  };
  
  const createToastContainer = () => {
    const container = document.createElement('div');
    container.className = 'doc9-toast-container';
    document.body.appendChild(container);
    return container;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="doc2-appointment-section">
      <div className="doc2-section-header">
        <h3 className="doc2-section-title">Upcoming Appointments</h3>
        <button className="doc10-btn doc10-btn-primary">
          <i className="fa fa-plus"></i> New Appointment
        </button>
      </div>
      <ul className="doc2-appointment-list">
        {appointments.map((appointment, index) => (
          <li key={index} className="doc2-appointment-item">
            <div className="doc2-appointment-info">
              <div className="doc2-patient-avatar">
                {getInitials(appointment.patient)}
              </div>
              <div className="doc2-patient-details">
                <div className="doc2-patient-name">{appointment.patient}</div>
                <div className="doc2-appointment-purpose">{appointment.purpose}</div>
              </div>
            </div>
            <div className="doc2-appointment-time">
              <i className="fa fa-clock"></i>
              {appointment.date}, {appointment.time}
            </div>
            <div 
              className={`doc2-status-badge ${appointment.status === 'Confirmed' ? 'doc2-status-confirmed' : 'doc2-status-pending'}`}
              onClick={() => handleStatusChange(index)}
            >
              <i className={`fa ${appointment.status === 'Confirmed' ? 'fa-check' : 'fa-clock'}`}></i>
              {appointment.status}
            </div>
            <div className="doc2-actions">
              <button className="doc2-action-btn doc2-edit-btn">
                <i className="fa fa-edit"></i>
              </button>
              <button className="doc2-action-btn doc2-cancel-btn">
                <i className="fa fa-times"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Stats Cards Component
const StatsCards = () => {
  const stats = [
    { title: "Appointments", value: 28, icon: "fa-calendar", trend: "+12% from last week", trendUp: true, type: "appointments" },
    { title: "Patients", value: 158, icon: "fa-user-md", trend: "+5% from last month", trendUp: true, type: "patients" },
    { title: "Revenue", value: "$13,450", icon: "fa-dollar-sign", trend: "+8% from last month", trendUp: true, type: "revenue" }
  ];

  return (
    <div className="doc1-dashboard-grid">
      {stats.map((stat, index) => (
        <div key={index} className="doc1-card">
          <div className="doc1-card-header">
            <h3 className="doc1-card-title">{stat.title}</h3>
            <div className={`doc1-card-icon ${stat.type}`}>
              <i className={`fa ${stat.icon}`}></i>
            </div>
          </div>
          <div className="doc1-card-value">{stat.value}</div>
          <div className="doc1-card-label">This month</div>
          <div className={`doc1-card-trend ${stat.trendUp ? 'doc1-trend-up' : 'doc1-trend-down'}`}>
            <i className={`fa fa-arrow-${stat.trendUp ? 'up' : 'down'}`}></i>
            {stat.trend}
          </div>
        </div>
      ))}
    </div>
  );
};

// Top Patients Component
const TopPatients = () => {
  const patients = [
    { name: "Ayush ", age: 19, condition: "Bodypain", progress: 85 },
    { name: "Abhinab ", age: 19, condition: "Backpain", progress: 70 },
    { name: "Ashreeya ", age: 19, condition: "Headache", progress: 95 }
  ];

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="doc7-responsive-item">
      <h3 className="doc7-responsive-title">
        <i className="fa fa-user-md"></i>
        Top Patients
      </h3>
      <ul className="doc8-patients-list">
        {patients.map((patient, index) => (
          <li key={index} className="doc8-patient-item">
            <div className="doc8-patient-avatar">
              {getInitials(patient.name)}
            </div>
            <div className="doc8-patient-info">
              <div className="doc8-patient-name">{patient.name}</div>
              <div className="doc8-patient-details">
                <span className="doc8-patient-age">{patient.age} yrs</span>
                <span className="doc8-patient-condition">{patient.condition}</span>
              </div>
            </div>
            <div className="doc8-progress-container">
              <div className="doc8-progress-bar">
                <div 
                  className="doc8-progress-fill" 
                  style={{ width: `${patient.progress}%` }}
                ></div>
              </div>
              <span className="doc8-progress-text">{patient.progress}%</span>
            </div>
          </li>
        ))}
      </ul>
      <button className="doc10-btn doc10-btn-outline">View All Patients</button>
    </div>
  );
};

// Calendar Widget Component
const CalendarWidget = () => {
  const [value, onChange] = useState(new Date());
  const [events, setEvents] = useState({
    '2025-05-06': ['10:30 AM - Ayush ', '3:15 PM - Staff Meeting'],
    '2025-05-12': ['2:15 PM - Abhinab ', '4:00 PM - Ashreeya '],
    '2025-05-15': ['11:00 AM - Department Meeting']
  });

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const renderSelectedDayEvents = () => {
    const dateKey = formatDate(value);
    const dayEvents = events[dateKey] || [];
    
    return (
      <div className="doc6-events-list">
        <h4 className="doc6-events-title">{value.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
        {dayEvents.length > 0 ? (
          <ul className="doc6-event-items">
            {dayEvents.map((event, idx) => (
              <li key={idx} className="doc6-event-item">
                <i className="fa fa-calendar-check"></i>
                <span>{event}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="doc6-no-events">No appointments scheduled for this day.</p>
        )}
      </div>
    );
  };

  return (
    <div className="doc6-calendar-widget">
      <h3 className="doc6-widget-title">
        <i className="fa fa-calendar"></i>
        Appointment Calendar
      </h3>
      <div className="doc6-calendar-container">
        <Calendar
          onChange={onChange}
          value={value}
          className="doc6-calendar"
          tileClassName={({ date }) => {
            const dateKey = formatDate(date);
            return events[dateKey] ? 'doc6-event-day' : null;
          }}
        />
        {renderSelectedDayEvents()}
      </div>
    </div>
  );
};

// Recent Messages Component
const RecentMessages = () => {
  const [messages, setMessages] = useState([
    { sender: "Ayush ", time: "10:30 AM", message: "Thank you for the appointment, Doctor. My symptoms have improved.", unread: true },
    { sender: "Dr. Johnson", time: "Yesterday", message: "Please review the patient history for tomorrow's consultation.", unread: false },
    { sender: "Ashreeya ", time: "2 days ago", message: "When should I visit again Thanks!", unread: true }
  ]);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="doc7-responsive-item">
      <h3 className="doc7-responsive-title">
        <i className="fa fa-comments"></i>
        Recent Messages
      </h3>
      <ul className="doc5-messages-list">
        {messages.map((msg, index) => (
          <li key={index} className={`doc5-message-item ${msg.unread ? 'doc5-unread' : ''}`}>
            <div className="doc5-message-avatar">
              {getInitials(msg.sender)}
              {msg.unread && <span className="doc5-unread-indicator"></span>}
            </div>
            <div className="doc5-message-content">
              <div className="doc5-message-header">
                <span className="doc5-sender-name">{msg.sender}</span>
                <span className="doc5-message-time">{msg.time}</span>
              </div>
              <p className="doc5-message-text">{msg.message}</p>
            </div>
          </li>
        ))}
      </ul>
      <button className="doc10-btn doc10-btn-outline">View All Messages</button>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = () => {
  return (
    <div className="doc1-main-content">
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
      
      <div className="doc1-dashboard-welcome">
        <h3>Welcome back, Dr. Roberts!</h3>
        <p>Here's what's happening with your patients today.</p>
      </div>
      
      <StatsCards />
      
      <div className="doc7-responsive-grid">
        <TopPatients />
        <RecentMessages />
      </div>
      
      <div className="doc1-dashboard-row">
        <div className="doc1-dashboard-col">
          <AppointmentList />
        </div>
        <div className="doc1-dashboard-col">
          <CalendarWidget />
        </div>
      </div>
    </div>
  );
};

// Main DoctorDashboardApp Component
const DoctorDashboardApp = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  const handleSectionSelect = (section) => {
    if (section === 'userhome') {
      navigate('/');
      return;
    }
    setActiveSection(section);
  };

  return (
    <div className="doc1-app-container">
      <PatientSidebar onSelect={handleSectionSelect} activeSection={activeSection} />
      <div className="doc1-content-wrapper">
        {activeSection === 'dashboard' && <DashboardContent />}
        {activeSection === 'appointments' && <div className="doc1-section-content"><h2>My Appointments</h2><AppointmentList /></div>}
        {activeSection === 'records' && <div className="doc1-section-content"><h2>Medical Records</h2><p>Your medical records section is here.</p></div>}
        {activeSection === 'messages' && <div className="doc1-section-content"><h2>Messages</h2><RecentMessages /></div>}
        {activeSection === 'profile' && <div className="doc1-section-content"><h2>Profile Settings</h2><p>Your profile settings are here.</p></div>}
      </div>
    </div>
  );
};

export default DoctorDashboardApp;