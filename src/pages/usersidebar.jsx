import React from "react";
import { useNavigate } from "react-router-dom";

import "../cssonly/usersidebar.css";

function UserSidebar() {
  const navigate = useNavigate();

  const sidebarLinks = [
    { label: "Dashboard", icon: "fa-home", path: "/dashboard" },
    { label: "Hydration", icon: "fa-tint", path: "/hydration" },
    { label: "Sleep", icon: "fa-bed", path: "/sleep" },
    { label: "Exercise", icon: "fa-dumbbell", path: "/exercise" },
    { label: "Mood", icon: "fa-smile", path: "/mood" },  // ✅ Mood route linked properly
    { label: "Messages", icon: "fa-comments", path: "/messaging" },
    { label: "Appointment", icon: "fa-calendar-check", path: "/appointment" },
    { label: "Logout", icon: "fa-sign-out-alt", path: "/logout" },
  ];

  return (
    <aside className="user-sidebar">
      <ul>
        {sidebarLinks.map((link, index) => (
          <li key={index} onClick={() => navigate(link.path)}>
            <i className={`fas ${link.icon}`}></i> {link.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default UserSidebar;
