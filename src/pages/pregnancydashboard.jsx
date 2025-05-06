import React from "react";
import UserNavbar from "./UserNavbar";
import UserSidebar from "./UserSidebar";
import "../cssonly/pregnancydashboard.css";
import "../cssonly/usersidebar.css";
import "../cssonly/usernavbar.css";

function PregnancyDashboard() {
  const gestationAge = "16 weeks, 3 days";
  const estimatedDueDate = "November 15, 2025";
  const nextAppointment = "May 8, 2025";
  const waterIntake = "6 / 8 glasses";
  const sleepQuality = "Good (7 hrs)";
  const mood = "Happy";
  const weight = "65 kg";

  return (
    <div className="dashboard-wrapper">
      <UserNavbar />
      <div className="dashboard-body">
        <UserSidebar />
        <main className="dashboard-content">
          <h2>Welcome Back 👶</h2>
          <div className="dashboard-grid">
            <div className="card pink">
              <h3>Gestation Age</h3>
              <p>{gestationAge}</p>
            </div>
            <div className="card blue">
              <h3>Due Date</h3>
              <p>{estimatedDueDate}</p>
            </div>
            <div className="card green">
              <h3>Next Appointment</h3>
              <p>{nextAppointment}</p>
            </div>
            <div className="card purple">
              <h3>Water Intake</h3>
              <p>{waterIntake}</p>
            </div>
            <div className="card yellow">
              <h3>Sleep Quality</h3>
              <p>{sleepQuality}</p>
            </div>
            <div className="card peach">
              <h3>Mood</h3>
              <p>{mood}</p>
            </div>
            <div className="card sky">
              <h3>Weight</h3>
              <p>{weight}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PregnancyDashboard;
