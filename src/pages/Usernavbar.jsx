import React, { useState } from "react";
import { Bell, Baby, User } from "lucide-react";
import "../cssonly/usernavbar.css";

const UserNavbar = () => {
  const [notifications, setNotifications] = useState(3);
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Baby className="brand-icon" />
        <span className="brand-text">BabyJourney</span>
      </div>
      
      <div className="navbar-center">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search health tips, articles..." 
            className="search-input"
          />
        </div>
      </div>
      
      <div className="navbar-actions">
        <div className="notification-bell" onClick={() => setNotifications(0)}>
          <Bell size={20} />
          {notifications > 0 && <span className="notification-badge">{notifications}</span>}
        </div>
        <div className="user-profile">
          <div className="user-avatar">
            <User size={18} />
          </div>
          <span className="user-name">Sarah</span>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;