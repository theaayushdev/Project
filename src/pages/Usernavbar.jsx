import React from "react";
import { useNavigate } from "react-router-dom";
import "../cssonly/usernavbar.css";  // Assuming CSS is inside the src/cssonly folder

function UserNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session or token if needed
    navigate("/login");  // Navigate back to login page after logout
  };

  return (
    <nav className="user-navbar">
      <div className="logo">
        <h1>Pregnancy Tracker</h1>
      </div>
      <ul className="nav-links">
        <li><button onClick={() => navigate("/dashboard")}>Dashboard</button></li>
        <li><button onClick={() => navigate("/nutrition")}>Nutrition</button></li>
        <li><button onClick={() => navigate("/parenting")}>Parenting</button></li>
        <li><button onClick={() => navigate("/duedatecalc")}>Due Date Calculator</button></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}

export default UserNavbar;
