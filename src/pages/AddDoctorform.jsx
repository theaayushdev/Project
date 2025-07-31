import React, { useState } from 'react';
import axios from 'axios';

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
    years_of_experience: '',
    age: '',
    password: '',
    profile_photo: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile_photo: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
      // Create FormData for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'profile_photo' && formData[key]) {
          submitData.append(key, formData[key]);
        } else if (key !== 'profile_photo') {
          submitData.append(key, formData[key]);
        }
      });

      // API call to backend
      await axios.post('http://localhost:5000/add-doctor', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
        years_of_experience: '',
        age: '',
        password: '',
        profile_photo: null
      });
      setPhotoPreview(null);
    } catch (err) {
      alert('Error adding doctor: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '40px', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{
        maxWidth: 900,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '40px 56px 32px 56px',
        margin: '0 auto'
      }}>
        <h2 style={{ marginBottom: 28, color: '#1a237e', fontWeight: 700, fontSize: '2rem' }}>Add Doctor</h2>
        <form onSubmit={handleSubmit}>
          {/* Photo Upload Section */}
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: 16, fontWeight: 'bold', color: '#4a5568' }}>Profile Photo</label>
            <div style={{ 
              width: 120, 
              height: 120, 
              margin: '0 auto 16px', 
              border: '2px dashed #cbd5e0', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: photoPreview ? `url(${photoPreview})` : '#f7fafc',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {!photoPreview && (
                <span style={{ color: '#a0aec0', fontSize: '14px' }}>Upload Photo</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: '#888' }}>Click to upload profile photo (JPG, PNG)</p>
          </div>

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
              <label>Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="25"
                max="80"
                style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 4, border: '1px solid #ccc', fontSize: 18 }}
                placeholder="Enter age"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Years of Experience *</label>
              <input
                type="number"
                name="years_of_experience"
                value={formData.years_of_experience}
                onChange={handleChange}
                required
                min="0"
                max="50"
                style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 4, border: '1px solid #ccc', fontSize: 18 }}
                placeholder="Enter years of experience"
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
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                required
                style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 4, border: '1px solid #ccc', fontSize: 18 }}
              >
                <option value="">Select specialty</option>
                <option value="Obstetrician">Obstetrician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Maternal-Fetal Medicine">Maternal-Fetal Medicine</option>
                <option value="Perinatologist">Perinatologist</option>
                <option value="Midwife">Midwife</option>
                <option value="Reproductive Endocrinologist">Reproductive Endocrinologist</option>
                <option value="Family Medicine">Family Medicine</option>
                <option value="Internal Medicine">Internal Medicine</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                style={{ width: '100%', marginBottom: 16, padding: 12, borderRadius: 4, border: '1px solid #ccc', fontSize: 18 }}
              >
                <option value="">Select department</option>
                <option value="Maternity">Maternity</option>
                <option value="Women's Health">Women's Health</option>
                <option value="High-Risk Pregnancy">High-Risk Pregnancy</option>
                <option value="Fetal Medicine">Fetal Medicine</option>
                <option value="Natural Birth">Natural Birth</option>
                <option value="Fertility">Fertility</option>
                <option value="Emergency Medicine">Emergency Medicine</option>
              </select>
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