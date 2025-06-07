import React from "react";
import Sidebar from "./Sidebar";
import ImageComponent from "./images";
import { useNavigate } from "react-router-dom";

import "../cssonly/userhome.css";

function Page() {
  const navigate = useNavigate();

  // Navigation handlers
  const navigateToLogin = () => navigate("/login");
  const navigateToAdminLogin = () => navigate("/adminlogin"); // ✅ FIXED
  const navigateToRegisterLogin = () => navigate("/userregister");
  const navigateToDoctorPanel = () => navigate("/doctordashboard");
  const navigateToPregnancy = () => navigate("/pregnancydashboard");

  return (
    <div className="page-scroll-content">
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
            <button className="club-button" onClick={navigateToLogin}>
              User Login Page
            </button>
            <button className="club-button" onClick={navigateToAdminLogin}>
              Admin Login
            </button>
            <button className="club-button" onClick={navigateToDoctorPanel}>
              Doctor Panel
            </button>
            {/* Optional buttons: 
            <button className="club-button" onClick={navigateToPregnancy}>User Dashboard</button>
            <button className="club-button" onClick={navigateToRegisterLogin}>Register</button> 
            */}
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
      <ImageComponent />
      <Page />
    </div>
  );
};

export default Top;

