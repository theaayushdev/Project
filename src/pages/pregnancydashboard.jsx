import React, { useEffect, useState } from "react";
import UserNavbar from "./Usernavbar";
import UserSidebar from "./usersidebar";
import { Calendar, Heart, Baby, Droplets, Moon, Weight, Activity, Plus, ChevronRight, Star, Target } from "lucide-react";
import "../cssonly/pregnancydashboard.css";

function UserPregnancyDashboard() {
  const [user, setUser] = useState({ firstname: "Sarah", lastname: "Johnson" });
  const [pregnancyInfo, setPregnancyInfo] = useState({
    weight: 65,
    height: 165,
    dueDate: "November 15, 2025",
    currentWeek: 24
  });
  const [appointments, setAppointments] = useState([
    { id: 1, date: "2025-07-28", time: "10:00 AM", doctor: "Dr. Smith", type: "Regular Checkup" },
    { id: 2, date: "2025-08-05", time: "2:30 PM", doctor: "Dr. Johnson", type: "Ultrasound" },
    { id: 3, date: "2025-08-12", time: "11:00 AM", doctor: "Dr. Smith", type: "Blood Test" }
  ]);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [waterIntake, setWaterIntake] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [dailySteps, setDailySteps] = useState(6432);
  const [heartRate, setHeartRate] = useState(78);

  // Simulate API calls (replace with actual API calls)
  useEffect(() => {
    // const email = localStorage.getItem("userEmail");
    // Fetch user data, pregnancy info, and appointments here
    // For now, we're using mock data initialized in state
  }, []);

  const healthStats = [
    { 
      title: "Weight", 
      value: `${pregnancyInfo.weight} kg`, 
      icon: Weight, 
      color: "#FF6B6B",
      change: "+2.1kg this month",
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

  const babyMilestones = [
    { week: 24, description: "Baby can hear sounds", completed: true },
    { week: 25, description: "Hair begins to grow", completed: false },
    { week: 26, description: "Eyes begin to open", completed: false },
    { week: 28, description: "Brain tissue develops", completed: false }
  ];

  const quickActions = [
    { title: "Log Symptoms", icon: Plus, color: "#FF6B6B" },
    { title: "Track Mood", icon: Heart, color: "#4ECDC4" },
    { title: "Add Meal", icon: Target, color: "#45B7D1" },
    { title: "Record Activity", icon: Activity, color: "#96CEB4" }
  ];

  return (
    <div className="dashboard-container">
      <UserNavbar />
      <div className="dashboard-layout">
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="dashboard-content">
          <header className="dashboard-header">
            <div className="header-content">
              <div className="welcome-section">
                <h1>Good morning, {user.firstname}! ✨</h1>
                <p className="due-date">Baby arrives in <strong>16 weeks</strong> • Due: {pregnancyInfo.dueDate}</p>
              </div>
              <div className="header-stats">
                <div className="stat-item">
                  <span className="stat-number">24</span>
                  <span className="stat-label">Weeks</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">16</span>
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
                {quickActions.map((action, index) => (
                  <button key={index} className="action-card" style={{ '--accent-color': action.color }}>
                    <action.icon size={20} />
                    <span>{action.title}</span>
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
                {appointments.slice(0, 3).map((appt) => (
                  <div key={appt.id} className="appointment-card">
                    <div className="appt-date">
                      <Calendar size={18} />
                      <div>
                        <p className="appt-day">{new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        <p className="appt-time">{appt.time}</p>
                      </div>
                    </div>
                    <div className="appt-details">
                      <h4>{appt.type}</h4>
                      <p>{appt.doctor}</p>
                    </div>
                    <button className="appt-action">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Baby Growth */}
            <section className="widget baby-growth">
              <h3>Baby Development</h3>
              <div className="growth-visual">
                <div className="baby-size">
                  <div className="fruit-icon">🥑</div>
                  <div className="size-info">
                    <h4>Size of an Avocado</h4>
                    <p>About 12 inches long</p>
                    <p>~1.3 pounds</p>
                  </div>
                </div>
                <div className="growth-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '60%' }}></div>
                  </div>
                  <span className="progress-text">60% developed</span>
                </div>
              </div>
              
              <div className="milestones">
                <h4>Milestones</h4>
                {babyMilestones.map((milestone, index) => (
                  <div key={index} className={`milestone ${milestone.completed ? 'completed' : ''}`}>
                    <div className="milestone-marker">
                      {milestone.completed && <Star size={12} />}
                    </div>
                    <div className="milestone-content">
                      <span className="milestone-week">Week {milestone.week}</span>
                      <span className="milestone-desc">{milestone.description}</span>
                    </div>
                  </div>
                ))}
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