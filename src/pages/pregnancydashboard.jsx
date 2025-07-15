import React, { useEffect, useState } from "react";
import UserNavbar from "./Usernavbar";
import UserSidebar from "./usersidebar";
import "../cssonly/pregnancydashboard.css";

function UserPregnancyDashboard() {
  const [user, setUser] = useState(null);
  const [pregnancyInfo, setPregnancyInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch("http://localhost:5000/users");
        const users = await usersRes.json();
        const matchedUser = users.find(u => u.email === email);

        if (!matchedUser) {
          console.warn("User not found for email:", email);
          return;
        }

        setUser(matchedUser);

        const [pregnancyRes, appointmentsRes] = await Promise.all([
          fetch("http://localhost:5000/pregnancy-info"),
          fetch("http://localhost:5000/appointments")
        ]);

        const [pregnancyList, allAppointments] = await Promise.all([
          pregnancyRes.json(),
          appointmentsRes.json()
        ]);

        const matchedPregnancy = pregnancyList.find(p => p.user_id === matchedUser.patient_id);
        setPregnancyInfo(matchedPregnancy);

        const userAppointments = allAppointments.filter(a => a.user_id === matchedUser.patient_id);
        setAppointments(userAppointments);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    if (email) fetchData();
  }, [email]);

  const healthStats = pregnancyInfo ? [
    { title: "Weight", value: `${pregnancyInfo.weight} kg`, icon: "fa-weight" },
    { title: "Height", value: `${pregnancyInfo.height} cm`, icon: "fa-ruler-vertical" },
    { title: "Water Intake", value: "0/ 8 glasses", icon: "fa-tint" },
    { title: "Sleep Quality", value: "Good (7 hrs)", icon: "fa-bed" },
  ] : [];

  return (
    <div className="dashboard-container">
      <UserNavbar />
      <div className="dashboard-layout">
        <UserSidebar />
        <main className="dashboard-content">
          <header className="dashboard-header">
            <h2>Welcome, {user ? user.firstname : "User"}!</h2>
            <p>Estimated Due Date: November 15, 2025</p>
          </header>

          <section className="dashboard-grid">
            <div className="widget health-overview">
              <h3>Health Overview</h3>
              <ul>
                {healthStats.length > 0 ? healthStats.map((stat, index) => (
                  <li key={index}>
                    <i className={`fas ${stat.icon}`}></i> {stat.title}: <span>{stat.value}</span>
                  </li>
                )) : <li>Loading health data...</li>}
              </ul>
            </div>

            <div className="widget upcoming-appointments">
              <h3>Upcoming Appointments</h3>
              <ul>
                {appointments.length > 0 ? appointments.map((appt, index) => (
                  <li key={index}>
                    <span>{appt.appointment_date}</span> - {appt.status}
                  </li>
                )) : <li>No upcoming appointments</li>}
              </ul>
            </div>

            <div className="widget baby-growth">
              <h3>Baby Growth Tracker</h3>
              <img src="baby-development-placeholder.png" alt="Baby Growth Visualization" />
              <p>Baby is currently the size of an <strong>Avocado 🥑</strong></p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default UserPregnancyDashboard;
