import React, { useEffect, useState } from "react";
import UserNavbar from "./Usernavbar"; // Top navigation bar for user
import UserSidebar from "./usersidebar"; // Sidebar navigation for user
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
      title: "Height", 
      value: pregnancyInfo && pregnancyInfo.height ? `${pregnancyInfo.height} cm` : "-",
      icon: Activity, // You can choose a more appropriate icon if available
      color: "#4ECDC4",
      change: pregnancyInfo && pregnancyInfo.height ? "Recorded" : "-",
      trend: "neutral"
    },
    { 
      title: "LMC", 
      value: pregnancyInfo && pregnancyInfo.lmc ? new Date(pregnancyInfo.lmc).toLocaleDateString() : "-",
      icon: Calendar,
      color: "#A78BFA",
      change: pregnancyInfo && pregnancyInfo.lmc ? "Last Menstrual Cycle" : "-",
      trend: "neutral"
    },
    { 
      title: "Gravida Number", 
      value: pregnancyInfo && pregnancyInfo.gravida ? pregnancyInfo.gravida : "-",
      icon: Baby,
      color: "#F59E0B",
      change: pregnancyInfo && pregnancyInfo.gravida ? "Recorded" : "-",
      trend: "neutral"
    }
  ];

  const milestones = [
    { id: 1, text: "First prenatal visit", completed: true },
    { id: 2, text: "First ultrasound", completed: true },
    { id: 3, text: "Genetic screening", completed: false },
    { id: 4, text: "Anatomy scan", completed: false },
    { id: 5, text: "Glucose test", completed: false },
    { id: 6, text: "Birth plan preparation", completed: false }
  ];

  const tips = [
    {
      icon: "💧",
      title: "Stay Hydrated",
      content: "Drink at least 8-10 glasses of water daily to support your baby's development."
    },
    {
      icon: "🥗",
      title: "Eat Well",
      content: "Focus on nutrient-rich foods like leafy greens, lean proteins, and whole grains."
    },
    {
      icon: "🚶‍♀️",
      title: "Stay Active",
      content: "Gentle exercise like walking or prenatal yoga can help with energy and mood."
    }
  ];

  if (loading) {
    return (
      <div className="pregnancy-dashboard-container">
        <div className="pregnancy-dashboard-layout">
          <UserSidebar />
          <div className="pregnancy-dashboard-content">
            <div className="pregnancy-widget">
              <p>Loading your pregnancy dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pregnancy-dashboard-container">
        <div className="pregnancy-dashboard-layout">
          <UserSidebar />
          <div className="pregnancy-dashboard-content">
            <div className="pregnancy-widget">
              <p>Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* User Sidebar: navigation for dashboard sections */}
      <UserSidebar week={week} trimester={trimester} activeTab="dashboard" />
      <div style={{ flex: 1, marginLeft: 240, padding: "32px 40px" }}>
        {/* User Navbar: top navigation bar */}
        <UserNavbar />
        
        <div className="pregnancy-dashboard-header">
          <div className="pregnancy-header-content">
            <div className="pregnancy-welcome-section">
              <h1>Welcome back, {user?.firstname}!</h1>
              {dueDate && (
                <p className="pregnancy-due-date">Due Date: {dueDate}</p>
              )}
            </div>
            <div className="pregnancy-header-stats">
              <div className="pregnancy-stat-item">
                <span className="pregnancy-stat-number">{week || 0}</span>
                <span className="pregnancy-stat-label">Weeks</span>
              </div>
              <div className="pregnancy-stat-item">
                <span className="pregnancy-stat-number">{trimester || 'N/A'}</span>
                <span className="pregnancy-stat-label">Trimester</span>
              </div>
              <div className="pregnancy-stat-item">
                <span className="pregnancy-stat-number">{babySize}</span>
                <span className="pregnancy-stat-label">Baby Size</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pregnancy-dashboard-grid">
          {/* Health Stats */}
          <div className="pregnancy-widget">
            <div className="pregnancy-widget-header">
              <h3 className="pregnancy-widget-title">Health Stats</h3>
              <div className="pregnancy-widget-icon" style={{ backgroundColor: "#4ECDC4" }}>
                <Activity size={20} />
              </div>
            </div>
            <div className="pregnancy-health-stats">
              {healthStats.map((stat, index) => (
                <div key={index} className="pregnancy-health-stat-card">
                  <div className="pregnancy-stat-icon" style={{ backgroundColor: stat.color }}>
                    <stat.icon size={24} />
                  </div>
                  <div className="pregnancy-stat-info">
                    <h4>{stat.title}</h4>
                    <div className="pregnancy-stat-value">{stat.value}</div>
                    <div className={`pregnancy-stat-change ${stat.trend}`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="pregnancy-widget">
            <div className="pregnancy-widget-header">
              <h3 className="pregnancy-widget-title">Pregnancy Milestones</h3>
              <div className="pregnancy-widget-icon" style={{ backgroundColor: "#A78BFA" }}>
                <Target size={20} />
              </div>
            </div>
            <div>
              {milestones.map((milestone) => (
                <div key={milestone.id} className={`pregnancy-milestone ${milestone.completed ? 'completed' : ''}`}>
                  <div className="pregnancy-milestone-marker">
                    {milestone.completed ? '✓' : milestone.id}
                  </div>
                  <span>{milestone.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Water Tracker */}
          <div className="pregnancy-widget">
            <div className="pregnancy-widget-header">
              <h3 className="pregnancy-widget-title">Water Intake</h3>
              <div className="pregnancy-widget-icon" style={{ backgroundColor: "#4ECDC4" }}>
                <Droplets size={20} />
              </div>
            </div>
            <div className="pregnancy-water-tracker">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className={`pregnancy-water-glass ${i < waterIntake ? 'filled' : ''}`}
                  onClick={() => setWaterIntake(i + 1)}
                />
              ))}
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#718096' }}>
              Click glasses to track your water intake
            </p>
          </div>

          {/* Tips */}
          <div className="pregnancy-widget">
            <div className="pregnancy-widget-header">
              <h3 className="pregnancy-widget-title">Daily Tips</h3>
              <div className="pregnancy-widget-icon" style={{ backgroundColor: "#F59E0B" }}>
                <Star size={20} />
              </div>
            </div>
            {tips.map((tip, index) => (
              <div key={index} className="pregnancy-tip-card">
                <div className="pregnancy-tip-icon">{tip.icon}</div>
                <div className="pregnancy-tip-content">
                  <h4>{tip.title}</h4>
                  <p>{tip.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Appointments */}
          <div className="pregnancy-widget">
            <div className="pregnancy-widget-header">
              <h3 className="pregnancy-widget-title">Upcoming Appointments</h3>
              <div className="pregnancy-widget-icon" style={{ backgroundColor: "#FF6B6B" }}>
                <Calendar size={20} />
              </div>
            </div>
            {appointments.length > 0 ? (
              <div>
                {appointments.slice(0, 3).map((appointment, index) => (
                  <div key={index} className="pregnancy-milestone">
                    <div className="pregnancy-milestone-marker">
                      📅
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{appointment.purpose}</div>
                      <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>
                No upcoming appointments
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPregnancyDashboard;