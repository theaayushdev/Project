import React from "react";
import "../cssonly/usersidebar.css";

function UserSidebar() {
  return (
   <aside className="user-sidebar">
   <ul>
     <li><i className="fas fa-home"></i> Dashboard</li>
     <li><i className="fas fa-tint"></i> Hydration</li>
     <li><i className="fas fa-bed"></i> Sleep</li>
     <li><i className="fas fa-dumbbell"></i> Exercise</li>
     <li><i className="fas fa-smile"></i> Mood</li>
     <li><i className="fas fa-calendar-check"></i> Appointments</li>
     <li><i className="fas fa-sign-out-alt"></i> Logout</li>
   </ul>
 </aside>
 
  );
}

export default UserSidebar;
