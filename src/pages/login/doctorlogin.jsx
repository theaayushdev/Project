import React, { useState } from 'react';
import { Stethoscope, Sparkles } from 'lucide-react';
import '../../cssonly/doctorlogin.css';

function DoctorLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      alert(`Welcome Dr. ${formData.username}! Login successful.`);
      // Here you would typically redirect to the doctor dashboard
    }, 1500);
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
            <label htmlFor="username" className="doctor-form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`doctor-form-input ${
                errors.username ? 'error' : ''
              }`}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="doctor-form-error">{errors.username}</p>
            )}
          </div>

          <div className="doctor-form-group">
            <label htmlFor="password" className="doctor-form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`doctor-form-input ${
                errors.password ? 'error' : ''
              }`}
              placeholder="Enter your password"
            />
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
