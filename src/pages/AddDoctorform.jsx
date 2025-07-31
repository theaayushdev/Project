import React, { useState } from 'react';
import AdminSidebar from './adminsidebar';

const AddDoctorForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone_number: '',
    gender: '',
    email: '',
    medical_license_number: '',
    specialty: '',
    department: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.password) {
      alert('Password is required');
      setIsSubmitting(false);
      return;
    }

    try {
      // Uncomment and use your actual API call here
      // await axios.post('http://localhost:5000/add-doctor', formData);

      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Doctor added successfully!');
      setFormData({
        firstname: '',
        lastname: '',
        phone_number: '',
        gender: '',
        email: '',
        medical_license_number: '',
        specialty: '',
        department: '',
        password: ''
      });
    } catch (err) {
      alert('Error adding doctor: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '48px 0 0 48px' }}>
        <div style={{
          maxWidth: 900, // Increased width
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          padding: '40px 56px 32px 56px', // More horizontal padding
          marginRight: 'auto'
        }}>
          <h2 style={{ marginBottom: 28, color: '#1a237e', fontWeight: 700, fontSize: '2rem' }}>Add Doctor</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: 32 }}>
              <div style={{ flex: 1 }}>
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 4, border: '1px solid #ccc', fontSize: 18 }}
                  placeholder="Enter first name"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 4, border: '1px solid #ccc', fontSize: 18 }}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              <div style={{ flex: 1 }}>
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 4, border: '1px solid #ccc', fontSize: 18 }}
                  placeholder="doctor@example.com"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 4, border: '1px solid #ccc', fontSize: 18 }}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              <div style={{ flex: 1 }}>
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 4, border: '1px solid #ccc', fontSize: 18 }}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label>Medical License Number</label>
                <input
                  type="text"
                  name="medical_license_number"
                  value={formData.medical_license_number}
                  onChange={handleChange}
                  style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 4, border: '1px solid #ccc', fontSize: 18 }}
                  placeholder="Enter license number"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              <div style={{ flex: 1 }}>
                <label>Specialty *</label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 4, border: '1px solid #ccc', fontSize: 18 }}
                  placeholder="e.g., Cardiology, Neurology"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Department *</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 4, border: '1px solid #ccc', fontSize: 18 }}
                  placeholder="e.g., Internal Medicine"
                />
              </div>
            </div>
            <div>
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 4, border: '1px solid #ccc', fontSize: 18 }}
                placeholder="Enter secure password"
              />
              <p style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>
                Password should be at least 8 characters long
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '16px 0',
                fontSize: '1.2rem',
                fontWeight: 600,
                background: isSubmitting ? '#bdbdbd' : '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                marginTop: 8,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
                transition: 'background 0.2s'
              }}
            >
              {isSubmitting ? 'Adding Doctor...' : 'Add Doctor'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorForm;

// This file currently contains the AddDoctorForm component and (for demo) a mock AdminSidebar.
// If you are seeing "Add Doctor" content in the "Remove Doctor" page, it means you are importing or rendering AddDoctorForm
// in the wrong place, or your routing is pointing to AddDoctorForm instead of Removedoctor.

// Solution:
// 1. Make sure your "Remove Doctor" page (Removedoctor) is implemented in /src/pages/removedoctor.jsx.
// 2. In your router (App.jsx), ensure the route for removing doctors uses Removedoctor, not AddDoctorForm.
// Example:
// <Route path="/removedoctor" element={<Removedoctor />} />

// 3. Do not import or render AddDoctorForm in removedoctor.jsx or in the sidebar for the remove doctor section.

// No code changes needed in this file unless you want to remove the mock AdminSidebar.