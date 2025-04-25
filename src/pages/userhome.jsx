import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../cssonly/userhome.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Pregnify</h2>
      <ul className="sidebar-links">
        <li><Link to="/pregnancy">Pregnancy</Link></li>
        <li><Link to="/baby">Baby</Link></li>
        <li><Link to="/parenting">Parenting</Link></li>
        <li><Link to="/doctor">Doctor</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/resources">Resources</Link></li>
      </ul>
    </aside>
  );
}

function Page() {
  const navigate = useNavigate();

  const navigateToLogin = () => navigate("/login");
  const navigateToDoctorLogin = () => navigate("/doctorlogin");
  const navigateToRes = () => navigate("/resources");
  const navigateToRegisterLogin = () => navigate("/userregister");

  return (
    <div className="page-content">
      <header className="hero-section">
        <h1 className="page-title">Welcome to Pregnify, Your Pregnancy Companion</h1>
        <p className="page-description">
          <b>Your Health is Our Top Priority</b>
        </p>
      </header>

      <div className="page-sections">
        <div className="section-card">
          <h2 className="section-title">Pregnancy</h2>
          <p>Find tips, books, resources, baby names, and much more!</p>
          <div className="buttons-container">
            <button className="club-button" onClick={navigateToLogin}>User Login Page</button>
            <button className="club-button" onClick={navigateToDoctorLogin}>Doctor Login Page</button>
            <button className="club-button" onClick={navigateToRes}>Resources</button>
            <button className="club-button" onClick={navigateToRegisterLogin}>Test</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Top = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <Page />
    </div>
  );
};

export default Top;
