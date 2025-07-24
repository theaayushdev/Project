import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentForm = () => {
  const [user, setUser] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    const fetchUser = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) throw new Error('User not logged in');
        const usersRes = await axios.get('http://localhost:5000/users');
        const users = usersRes.data;
        const matchedUser = users.find(u => u.email === email);
        if (!matchedUser) throw new Error('User not found');
        setUser(matchedUser);
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
    
    fetchUser();
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
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

      const payload = {
        user_id: user.patient_id,
        doctor_id: selectedDoctorId,
        appointment_date: appointmentDate,
        status: 'pending'
      };

      await axios.post('http://localhost:5000/appointment', payload);
      setSuccess('Appointment request submitted successfully!');

      setSelectedDoctorId('');
      setAppointmentDate('');
    } catch (err) {
      setError(err.message || 'Failed to submit appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <select 
          style={styles.select}
          value={selectedDoctorId} 
          onChange={(e) => setSelectedDoctorId(e.target.value)}
          required
        >
          <option value="">Choose a doctor</option>
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
          required 
        />
      </div>

      <button 
        type="submit" 
        style={loading ? {...styles.button, opacity: 0.7} : styles.button}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Confirm Appointment'}
      </button>
    </form>
  );
};

export default AppointmentForm;