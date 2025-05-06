import React from "react";
import UserNavbar from "./UserNavbar";
import UserSidebar from "./UserSidebar";
import "../cssonly/pregnancydashboard.css";

function PregnancyDashboard() {
  return (
    <div className="dashboard-container">
      <UserNavbar />
      <div className="dashboard-layout">
        <UserSidebar />
        <main className="dashboard-content">
          <header className="dashboard-header">
            <h2>Pregnancy Tracker Dashboard</h2>
            <p>Monitor your progress, health, and upcoming appointments</p>
          </header>

          <section className="dashboard-grid">
            <div className="widget progress-chart">
              <h3>Pregnancy Progress</h3>
              <img src="chart-placeholder.png" alt="Pregnancy Progress Chart" />
            </div>

            <div className="widget health-overview">
              <h3>Health Overview</h3>
              <ul>
                <li>Gestation Age: <span>16 weeks, 3 days</span></li>
                <li>Due Date: <span>November 15, 2025</span></li>
                <li>Weight: <span>65 kg</span></li>
                <li>Water Intake: <span>6/8 glasses</span></li>
              </ul>
            </div>

            <div className="widget upcoming-appointments">
              <h3>Upcoming Appointments</h3>
              <p>Next Visit: <span>May 8, 2025</span></p>
              <button>View Details</button>
            </div>

            <div className="widget mood-tracker">
              <h3>Today's Mood</h3>
              <p>Feeling: <span>Happy 😊</span></p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default PregnancyDashboard;
