import React, { useState } from 'react';
import { Stethoscope, Sparkles } from 'lucide-react';
import '../../cssonly/doctorlogin.css';

function DoctorLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/doctor-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      setIsLoading(false);
      
      if (response.ok) {
        // Store doctor data for dashboard
        localStorage.setItem('doctorData', JSON.stringify(result.doctor));
        alert(`Welcome Dr. ${result.doctor.firstname} ${result.doctor.lastname}! Login successful.`);
        // Navigate to doctor dashboard
        window.location.href = '/doctordashboard';
      } else {
        alert(result.error || 'Login failed');
      }
    } catch (error) {
      setIsLoading(false);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="doctor-login-container">
      {/* Background Animation */}
      <div className="doctor-login-bg">
        <div className="doctor-login-bg-circle"></div>
      </div>

      <div className="doctor-login-card">
        {/* Header */}
        <div className="doctor-login-header">
          <div className="doctor-login-icon-container">
            <div className="doctor-login-icon">
              <Stethoscope />
            </div>
            <Sparkles className="doctor-login-sparkles" />
          </div>
          <h1 className="doctor-login-title">
            Doctor Portal
          </h1>
          <p className="doctor-login-subtitle">Please sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="doctor-login-form">
          <div className="doctor-form-group">
            <label htmlFor="email" className="doctor-form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`doctor-form-input ${
                errors.email ? 'error' : ''
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="doctor-form-error">{errors.email}</p>
            )}
          </div>

          <div className="doctor-form-group">
            <label htmlFor="password" className="doctor-form-label">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`doctor-form-input ${
                  errors.password ? 'error' : ''
                }`}
                placeholder="Enter your password"
                style={{ paddingRight: '45px' }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '18px',
                  color: '#666'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <p className="doctor-form-error">{errors.password}</p>
            )}
          </div>

          <div className="doctor-form-options">
            <label className="doctor-form-checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="doctor-form-link">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="doctor-submit-btn"
          >
            {isLoading ? (
              <div className="doctor-loading-content">
                <div className="doctor-spinner"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="doctor-login-footer">
          <p>
            Need help? <a href="#">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;
