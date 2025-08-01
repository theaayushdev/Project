import React from 'react';
import '../cssonly/usernavbar.css';

const UserNavbar = ({ user }) => (
  <nav className="user-navbar-modern">
    <div className="user-navbar-logo-modern">
      <span className="pregnify-brand">Pregnify</span>
    </div>
    <div className="user-navbar-user-modern">
      <span className="user-navbar-greeting-modern">
        <span className="hello-text">Hello,</span> <span className="user-name">{user && user.firstname ? user.firstname : 'User'}</span>
      </span>
      <div className="user-avatar-modern">
        {user && user.firstname ? user.firstname[0] : 'U'}
      </div>
    </div>
  </nav>
);

export default UserNavbar;