import React from 'react';
import '../cssonly/usernavbar.css';

const UserNavbar = ({ user }) => (
  <nav className="user-navbar" style={{ background: '#2c5282', color: '#fff', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(44,82,130,0.07)' }}>
    <div className="user-navbar-logo" style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>Pregnify</div>
    <div className="user-navbar-user" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
      <span className="user-navbar-greeting" style={{ fontWeight: 500, fontSize: 16 }}>
        Hello, <b>{user && user.firstname ? user.firstname : 'User'}</b>
      </span>
      <div style={{ background: '#bee3f8', color: '#2c5282', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
        {user && user.firstname ? user.firstname[0] : 'U'}
      </div>
    </div>
  </nav>
);

export default UserNavbar;