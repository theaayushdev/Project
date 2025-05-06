import React from "react";
import UserNavbar from "./UserNavbar";
import UserSidebar from "./UserSidebar";
import "../cssonly/pregnancydashboard.css";

function UserPregnancyDashboard() {
  const userData = {
    name: "Emily Johnson",
    pregnancyWeek: "16 weeks",
    dueDate: "November 15, 2025",
  };

  const healthStats = [
    { title: "Weight", value: "65 kg", icon: "fa-weight" },
    { title: "Water Intake", value: "6 / 8 glasses", icon: "fa-tint" },
    { title: "Sleep Quality", value: "Good (7 hrs)", icon: "fa-bed" },
    { title: "Mood", value: "Happy 😊", icon: "fa-smile" },
  ];

  const appointments = [
    { date: "May 8, 2025", type: "Ultrasound Checkup" },
    { date: "May 22, 2025", type: "Prenatal Yoga Class" },
  ];

  return (
    <div className="dashboard-container">
      <UserNavbar />
      <div className="dashboard-layout">
        <UserSidebar />
        <main className="dashboard-content">
          <header className="dashboard-header">
            <h2>Welcome, {userData.name}!</h2>
            <p>Currently {userData.pregnancyWeek} pregnant | Estimated Due Date: {userData.dueDate}</p>
          </header>

          <section className="dashboard-grid">
            <div className="widget health-overview">
              <h3>Health Overview</h3>
              <ul>
                {healthStats.map((stat, index) => (
                  <li key={index}>
                    <i className={`fas ${stat.icon}`}></i> {stat.title}: <span>{stat.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="widget upcoming-appointments">
              <h3>Upcoming Appointments</h3>
              <ul>
                {appointments.map((appointment, index) => (
                  <li key={index}>
                    <span>{appointment.date}</span> - {appointment.type}
                  </li>
                ))}
              </ul>
            </div>

            <div className="widget baby-growth">
              <h3>Baby Growth Tracker</h3>
              <img src="baby-development-placeholder.png" alt="Baby Growth Visualization" />
              <p>Baby is currently the size of an **Avocado** 🥑</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default UserPregnancyDashboard;
