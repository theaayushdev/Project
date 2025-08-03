import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssonly/login.css';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user email in localStorage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userType', 'user');
        
        // Navigate to dashboard
        navigate('/pregnancydashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Unable to connect to server');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Pregnancy Care Login</h1>
          <p>Welcome back! Please sign in to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="quick-login-section">
          <h3>Quick Login (Demo Users)</h3>
          <div className="quick-login-buttons">
            <button 
              type="button" 
              onClick={() => quickLogin('ayushdev@gmail.com', '123')}
              className="quick-login-btn"
            >
              Abhinab (ayushdev@gmail.com)
            </button>
            <button 
              type="button" 
              onClick={() => quickLogin('hero@gmail.com', '123')}
              className="quick-login-btn"
            >
              Hero (hero@gmail.com)
            </button>
            <button 
              type="button" 
              onClick={() => quickLogin('ashreya@gmail.com', 'Ash')}
              className="quick-login-btn"
            >
              Ashreya (ashreya@gmail.com)
            </button>
            <button 
              type="button" 
              onClick={() => quickLogin('mark@gmail.com', 'mark')}
              className="quick-login-btn"
            >
              Mark (mark@gmail.com)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
