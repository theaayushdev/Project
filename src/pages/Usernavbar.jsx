import React from "react";
import { useNavigate } from "react-router-dom";
import "../cssonly/usernavbar.css";

function UserNavbar() {
  const navigate = useNavigate();

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Nutrition", path: "/nutrition" },
    { label: "Parenting", path: "/parenting" },
    { label: "Due Date Calculator", path: "/duedatecalc" },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <nav className="user-navbar">
      <div className="logo">
        <h1>Pregnancy Tracker</h1>
      </div>
      <ul className="nav-links">
        {navLinks.map((link, index) => (
          <li key={index}>
            <button onClick={() => navigate(link.path)}>{link.label}</button>
          </li>
        ))}
        <li>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}

export default UserNavbar;
