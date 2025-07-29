import React from "react";
import { Home, Calendar, Activity, Baby, BookOpen, MessageCircle, FileText, Settings, LogOut, ChevronRight } from "lucide-react";
import "../cssonly/usersidebar.css";
import { useNavigate } from "react-router-dom";

const UserSidebar = ({ activeTab, setActiveTab, lmc, week, trimester }) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'health', icon: Activity, label: 'Health Tracker' },
    { id: 'baby', icon: Baby, label: 'Baby Growth' },
    { id: 'articles', icon: BookOpen, label: 'Articles' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'reports', icon: FileText, label: 'Reports' },
  ];

  const handleNav = (id) => {
    if (setActiveTab) setActiveTab(id);
    if (id === 'appointments') {
      navigate('/appointment');
    } else if (id === 'dashboard') {
      navigate('/pregnancydashboard');
    } else if (id === 'reports') {
      navigate('/reports');
    } else if (id === 'chat') {
      navigate('/user-messaging');
    }
    // Add more navigation as needed
  };

  // Progress bar width
  const progress = week && week > 0 ? Math.min(week / 40 * 100, 100) : 0;

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="pregnancy-progress">
          <div className="progress-circle">
            <div className="progress-inner">
              <span className="week-number">{week !== null && week !== undefined ? week : '--'}</span>
              <span className="week-text">weeks</span>
            </div>
          </div>
          <div className="progress-bar-container" style={{ margin: '8px 0', width: '80%', marginLeft: '10%' }}>
            <div className="progress-bar-bg" style={{ background: '#e2e8f0', borderRadius: 8, height: 8, width: '100%' }}>
              <div className="progress-bar-fill" style={{ background: '#2c5282', borderRadius: 8, height: 8, width: `${progress}%`, transition: 'width 0.3s' }}></div>
            </div>
          </div>
          <p className="progress-text">{trimester || '--'}</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              <ChevronRight size={16} className="nav-arrow" />
            </button>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <button className="settings-btn">
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <button className="logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;