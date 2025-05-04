import React, { useState } from 'react';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import "../cssonly/AddDoctorform.css";

const AddDoctorForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone_number: '',
    gender: '',
    email: '',
    medical_license_number: '',
    specialty: '',
    department: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/add-doctor', formData);
      alert('Doctor added successfully!');
    } catch (err) {
      alert('Error adding doctor: ' + err.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="form-wrapper">
        <h1>Add Doctor</h1>
        <p>Please fill out the form to register a new doctor</p>

        <form onSubmit={handleSubmit} className="doctor-form">
          <div className="form-group-row">
            <div className="form-group">
              <label>First Name</label>
              <input name="firstname" value={formData.firstname} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="lastname" value={formData.lastname} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input name="phone_number" value={formData.phone_number} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Please Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Medical License Number</label>
            <input name="medical_license_number" value={formData.medical_license_number} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Specialty</label>
            <input name="specialty" value={formData.specialty} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input name="department" value={formData.department} onChange={handleChange} />
          </div>

          <div className="form-group">
            <button type="submit" className="primary-btn">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorForm;
