import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import UserNavbar from './Usernavbar';
import UserSidebar from './usersidebar';

function getPregnancyWeek(lmc) {
  if (!lmc) return null;
  const lmcDate = new Date(lmc);
  const now = new Date();
  const diff = now - lmcDate;
  const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  return week > 0 ? week : 0;
}

const AppointmentForm = () => {

  const validationSchema = Yup.object().shape({
    appointmentDate: Yup.date().required('Appointment Date is required'),
    appointmentTime: Yup.string().required('Appointment Time is required'),
    selectedDoctorId: Yup.string().required('Please select a doctor.')
  });
  const [user, setUser] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('appointments');
  const [pregnancyInfo, setPregnancyInfo] = useState(null);

  // New state for preselected doctor name from URL
  const [preselectedDoctorName, setPreselectedDoctorName] = useState('');

  // Inline styles object
  const styles = {
    form: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '25px',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
    },
    header: {
      color: '#2c5282', 
      textAlign: 'center',
      fontSize: '24px',
      marginBottom: '20px'
    },
    subtitle: {
      color: '#718096',
      textAlign: 'center',
      fontSize: '14px',
      marginBottom: '25px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
      color: '#4a5568',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #e2e8f0',
      borderRadius: '5px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #e2e8f0',
      borderRadius: '5px',
      fontSize: '16px',
      backgroundColor: 'white'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#3182ce', 
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    buttonHover: {
      backgroundColor: '#2b6cb0'
    },
    errorMessage: {
      backgroundColor: '#fed7d7',
      color: '#c53030',
      padding: '12px',
      marginBottom: '20px',
      borderRadius: '5px',
      fontSize: '14px'
    },
    successMessage: {
      backgroundColor: '#c6f6d5',
      color: '#2f855a',
      padding: '12px',
      marginBottom: '20px',
      borderRadius: '5px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center'
    },
    icon: {
      width: '20px',
      height: '20px',
      marginRight: '10px'
    }
  };

useEffect(() => {
    const fetchPregnancy = async (userObj) => {
      if (!userObj) return;
      try {
        const res = await axios.get(`http://localhost:5000/user/dashboard?email=${encodeURIComponent(userObj.email)}`);
        if (res.data && res.data.pregnancy) {
          setPregnancyInfo(res.data.pregnancy);
        }
      } catch {}
    };
    const fetchUser = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) throw new Error('User not logged in');
        const usersRes = await axios.get('http://localhost:5000/users');
        const users = usersRes.data;
        const matchedUser = users.find(u => u.email === email);
        if (!matchedUser) throw new Error('User not found');
        setUser(matchedUser);
        fetchPregnancy(matchedUser);
      } catch (err) {
        console.error(err);
        setError('Failed to retrieve user information.');
      }
    };
    
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/doctors');
        setDoctors(res.data);
      } catch (err) {
        setError('Failed to fetch doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Parse URL parameters to preselect doctor
    const params = new URLSearchParams(window.location.search);
    const preselectedDoctorId = params.get('doctorId');
    const preselectedDoctorName = params.get('doctorName');
    if (preselectedDoctorId) {
      setSelectedDoctorId(preselectedDoctorId);
      setPreselectedDoctorName(preselectedDoctorName ? decodeURIComponent(preselectedDoctorName) : '');
    }
    
    fetchUser();
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
setLoading(true);
    setError('');
    setSuccess('');
    
    const valid = await validationSchema.isValid({ appointmentDate, appointmentTime, selectedDoctorId });
    if (!valid) {
      setError('Validation failed. Ensure all fields are filled correctly.');
      setLoading(false);
      return;
    }
    
    try {
      if (!user) {
        throw new Error('User information not available.');
      }
      if (!selectedDoctorId) {
        throw new Error('Please select a doctor.');
      }
      if (!appointmentDate) {
        throw new Error('Please select an appointment date.');
      }
      if (!appointmentTime) {
        throw new Error('Please select an appointment time.');
      }

      const payload = {
        user_id: user.patient_id,
        doctor_id: selectedDoctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: 'pending'
      };

      await axios.post('http://localhost:5000/appointment', payload);
      setSuccess('Appointment request submitted successfully!');

      setSelectedDoctorId('');
      setAppointmentDate('');
      setAppointmentTime('');
    } catch (err) {
      setError(err.message || 'Failed to submit appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  let week = pregnancyInfo && pregnancyInfo.lmc ? getPregnancyWeek(pregnancyInfo.lmc) : null;
  let trimester = null;
  if (week !== null) {
    if (week < 13) trimester = '1st Trimester';
    else if (week < 27) trimester = '2nd Trimester';
    else trimester = '3rd Trimester';
  }

  return (
    <div className="dashboard-container">
      <UserNavbar user={user} />
      <div className="dashboard-layout">
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} lmc={pregnancyInfo?.lmc} week={week} trimester={trimester} />
        <main className="dashboard-content">
          <form style={styles.form} onSubmit={handleSubmit}>
            <h2 style={styles.header}>Book Your Appointment</h2>
            <p style={styles.subtitle}>Enter your details to schedule a visit</p>
            
            {error && <div style={styles.errorMessage}>{error}</div>}
            
            {success && (
              <div style={styles.successMessage}>
                <svg style={styles.icon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            )}


            <div style={styles.formGroup}>
              <label style={styles.label}>Select Doctor:</label>
              {preselectedDoctorName && (
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: '#e6fffa',
                  border: '1px solid #38b2ac',
                  borderRadius: '5px',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#234e52'
                }}>
                  ✓ Pre-selected: {preselectedDoctorName}
                </div>
              )}
              <select 
                style={{
                  ...styles.select,
                  backgroundColor: selectedDoctorId ? '#f0fff4' : 'white',
                  borderColor: selectedDoctorId ? '#38a169' : '#e2e8f0'
                }}
                value={selectedDoctorId} 
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                required
              >
                <option value="">{preselectedDoctorName ? 'Change doctor if needed' : 'Choose a doctor'}</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    Dr. {doc.firstname} {doc.lastname} ({doc.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Appointment Date:</label>
              <input 
                style={styles.input}
                type="date" 
                value={appointmentDate} 
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max={(() => {
                  const maxDate = new Date();
                  maxDate.setMonth(maxDate.getMonth() + 2);
                  return maxDate.toISOString().split('T')[0];
                })()}
                required 
              />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Appointments can be booked up to 2 months in advance
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Appointment Time:</label>
              <select 
                style={styles.select}
                value={appointmentTime} 
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
              >
                <option value="">Choose a time</option>
                <option value="08:30">8:30 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="15:00">3:00 PM</option>
              </select>
            </div>

            <button 
              type="submit" 
              style={loading ? {...styles.button, opacity: 0.7} : styles.button}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Appointment'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AppointmentForm;