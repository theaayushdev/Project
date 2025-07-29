import React, { useEffect, useState } from "react";
import UserNavbar from "./Usernavbar";
import UserSidebar from "./usersidebar";
import { Calendar, Heart, Baby, Droplets, Moon, Weight, Activity, Plus, ChevronRight, Star, Target } from "lucide-react";
import "../cssonly/pregnancydashboard.css";

function getPregnancyWeek(lmc) {
  if (!lmc) return null;
  const lmcDate = new Date(lmc);
  const now = new Date();
  const diff = now - lmcDate;
  const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  return week > 0 ? week : 0;
}

function getDueDate(lmc) {
  if (!lmc) return null;
  const lmcDate = new Date(lmc);
  const dueDate = new Date(lmcDate.getTime() + 280 * 24 * 60 * 60 * 1000); // 40 weeks
  return dueDate.toLocaleDateString();
}

const babySizes = [
  "Poppy seed", "Sesame seed", "Lentil", "Blueberry", "Kidney bean", "Grape", "Kumquat", "Fig", "Lime", "Plum", "Peach", "Lemon", "Apple", "Avocado", "Onion", "Sweet potato", "Mango", "Banana", "Pomegranate", "Papaya", "Grapefruit", "Cantaloupe", "Cauliflower", "Eggplant", "Romaine lettuce", "Cabbage", "Butternut squash", "Coconut", "Pineapple", "Pumpkin", "Watermelon"
];

function getBabySize(week) {
  if (!week || week < 1) return "Unknown";
  if (week > 40) week = 40;
  return babySizes[week - 1] || "Baby";
}

function UserPregnancyDashboard() {
  const [user, setUser] = useState(null);
  const [pregnancyInfo, setPregnancyInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [waterIntake, setWaterIntake] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [dailySteps, setDailySteps] = useState(6432);
  const [heartRate, setHeartRate] = useState(78);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setError("No user email found. Please log in again.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://127.0.0.1:5000/user/dashboard?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch dashboard data");
        setUser(data.user);
        setPregnancyInfo(data.pregnancy);
        setAppointments(data.appointments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  let week = pregnancyInfo && pregnancyInfo.lmc ? getPregnancyWeek(pregnancyInfo.lmc) : null;
  let dueDate = pregnancyInfo && pregnancyInfo.lmc ? getDueDate(pregnancyInfo.lmc) : null;
  let babySize = getBabySize(week);

  // Calculate trimester
  let trimester = null;
  if (week !== null) {
    if (week < 13) trimester = '1st Trimester';
    else if (week < 27) trimester = '2nd Trimester';
    else trimester = '3rd Trimester';
  }

  const healthStats = [
    { 
      title: "Weight", 
      value: pregnancyInfo ? `${pregnancyInfo.weight} kg` : "-",
      icon: Weight, 
      color: "#FF6B6B",
      change: pregnancyInfo ? `Current` : "-",
      trend: "up"
    },
    { 
      title: "Water Intake", 
      value: `${waterIntake}/8 glasses`, 
      icon: Droplets, 
      color: "#4ECDC4",
      change: "62% of daily goal",
      trend: "neutral"
    },
    { 
      title: "Sleep Quality", 
      value: `${sleepHours} hours`, 
      icon: Moon, 
      color: "#45B7D1",
      change: "Good quality",
      trend: "up"
    },
    { 
      title: "Heart Rate", 
      value: `${heartRate} BPM`, 
      icon: Heart, 
      color: "#96CEB4",
      change: "Normal range",
      trend: "neutral"
    }
  ];

  if (loading) return <div className="dashboard-container"><UserNavbar user={user} /><div className="dashboard-layout"><main className="dashboard-content"><h2>Loading...</h2></main></div></div>;
  if (error) return <div className="dashboard-container"><UserNavbar user={user} /><div className="dashboard-layout"><main className="dashboard-content"><h2>Error: {error}</h2></main></div></div>;

  return (
    <div className="dashboard-container">
      <UserNavbar user={user} />
      <div className="dashboard-layout">
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} lmc={pregnancyInfo?.lmc} week={week} trimester={trimester} />
        <main className="dashboard-content">
          <header className="dashboard-header">
            <div className="header-content">
              <div className="welcome-section">
                <h1>Good morning, {user ? user.firstname : "User"}! ✨</h1>
                <p className="due-date">{week !== null && dueDate ? (<span>Baby arrives in <strong>{40 - week}</strong> weeks • Due: {dueDate}</span>) : "No pregnancy info available."}</p>
              </div>
              <div className="header-stats">
                <div className="stat-item">
                  <span className="stat-number">{week !== null ? week : "-"}</span>
                  <span className="stat-label">Weeks</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{week !== null ? 40 - week : "-"}</span>
                  <span className="stat-label">To Go</span>
                </div>
              </div>
            </div>
          </header>

          <div className="dashboard-grid">
            {/* Health Overview */}
            <section className="widget health-overview">
              <div className="widget-header">
                <h3>Health Overview</h3>
                <button className="add-btn">
                  <Plus size={16} />
                </button>
              </div>
              <div className="health-stats-grid">
                {healthStats.map((stat, index) => (
                  <div key={index} className="health-stat-card" style={{ '--accent-color': stat.color }}>
                    <div className="stat-icon">
                      <stat.icon size={24} />
                    </div>
                    <div className="stat-info">
                      <h4>{stat.title}</h4>
                      <p className="stat-value">{stat.value}</p>
                      <span className={`stat-change ${stat.trend}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="widget quick-actions">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                {["Log Symptoms", "Track Mood", "Add Meal", "Record Activity"].map((title, index) => (
                  <button key={index} className="action-card" style={{ '--accent-color': healthStats[index % healthStats.length].color }}>
                    <Plus size={20} />
                    <span>{title}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Upcoming Appointments */}
            <section className="widget appointments">
              <div className="widget-header">
                <h3>Upcoming Appointments</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="appointments-list">
                {appointments.length === 0 ? (
                  <div>No appointments found.</div>
                ) : (
                  appointments.slice(0, 3).map((appt) => (
                  <div key={appt.id} className="appointment-card">
                    <div className="appt-date">
                      <Calendar size={18} />
                      <div>
                          <p className="appt-day">{appt.appointment_date ? new Date(appt.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "-"}</p>
                          <p className="appt-time">{appt.appointment_date ? new Date(appt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}</p>
                        </div>
                    </div>
                    <div className="appt-details">
                        <h4>{appt.status || "Appointment"}</h4>
                        <p>{appt.doctor ? `${appt.doctor.firstname} ${appt.doctor.lastname}` : "Doctor"}</p>
                    </div>
                    <button className="appt-action">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  ))
                )}
              </div>
            </section>

            {/* Baby Growth */}
            <section className="widget baby-growth">
              <h3>Baby Development</h3>
              <div className="growth-visual">
                <div className="baby-size">
                  <div className="fruit-icon">🥑</div>
                  <div className="size-info">
                    <h4>Size of a {babySize}</h4>
                    <p>{week ? `Week ${week}` : "-"}</p>
                  </div>
                </div>
                <div className="growth-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: week ? `${(week / 40) * 100}%` : '0%' }}></div>
                  </div>
                  <span className="progress-text">{week ? `${Math.round((week / 40) * 100)}% developed` : "-"}</span>
                </div>
              </div>
            </section>

            {/* Daily Activity */}
            <section className="widget daily-activity">
              <h3>Today's Activity</h3>
              <div className="activity-stats">
                <div className="activity-item">
                  <div className="activity-icon steps">
                    <Activity size={20} />
                  </div>
                  <div className="activity-details">
                    <h4>{dailySteps.toLocaleString()}</h4>
                    <p>Steps taken</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon water">
                    <Droplets size={20} />
                  </div>
                  <div className="activity-details">
                    <h4>{waterIntake}/8</h4>
                    <p>Glasses of water</p>
                    <div className="water-tracker">
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`water-glass ${i < waterIntake ? 'filled' : ''}`}
                          onClick={() => setWaterIntake(i + 1)}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tips & Articles */}
            <section className="widget tips-articles">
              <h3>Today's Tips</h3>
              <div className="tips-list">
                <div className="tip-card">
                  <div className="tip-icon">💡</div>
                  <div className="tip-content">
                    <h4>Stay Hydrated</h4>
                    <p>Aim for 8-10 glasses of water daily to support healthy pregnancy</p>
                  </div>
                </div>
                <div className="tip-card">
                  <div className="tip-icon">🧘‍♀️</div>
                  <div className="tip-content">
                    <h4>Prenatal Yoga</h4>
                    <p>Gentle stretching can help reduce back pain and improve sleep</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default UserPregnancyDashboard;