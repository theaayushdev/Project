import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { FaUsers, FaCogs, FaSignInAlt, FaUserMd, FaBook, FaHeartbeat } from "react-icons/fa"; // icons

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Pregnify</h2>
        <div className="workspace-selector">
          <select className="workspace-dropdown">
            <option>Welcome User</option>
          </select>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-links">
          <li><Link to="/pregnancy" className="sidebar-link"><FaHeartbeat /> Overview</Link></li>
          <li><Link to="/baby" className="sidebar-link"><FaUsers /> Customers</Link></li>
          <li><Link to="/parenting" className="sidebar-link"><FaCogs /> Parental Guide</Link></li>
          <li><Link to="/settings" className="sidebar-link"><FaCogs /> Settings</Link></li>
          <li><Link to="/doctorlogin" className="sidebar-link"><FaUserMd /> Doctor</Link></li>
          <li><Link to="/resources" className="sidebar-link"><FaBook /> Resources</Link></li>
          <li><Link to="/nutrition" className="sidebar-link"><FaHeartbeat /> Nutrition</Link></li>
          <li><Link to="/error" className="sidebar-link"><FaSignInAlt /> Error</Link></li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-footer-text">Need more features?</p>
        <p className="sidebar-footer-subtext">Check out our Pro solution .</p>
        <div className="pro-version-card">
          {/* You can replace this with an actual image later */}
          <img src="/path-to-your-illustration.png" alt="Premium version" className="pro-img" />
          <Link to="/pro-version" className="pro-button">Pro version</Link>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
