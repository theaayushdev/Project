import React, { useState } from 'react';
import axios from 'axios';
import "../cssonly/doctorhome.css";


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
      await axios.post('http://localhost:5000/add-doctor', formData); // update the URL as needed
      alert('Doctor added successfully!');
    } catch (err) {
      alert('Error adding doctor: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="doctor-form">
      <input name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required />
      <input name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required />
      <input name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
      
      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} />
      <input name="medical_license_number" placeholder="Medical License Number" value={formData.medical_license_number} onChange={handleChange} />
      <input name="specialty" placeholder="Specialty" value={formData.specialty} onChange={handleChange} />
      <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} />
      
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddDoctorForm;
