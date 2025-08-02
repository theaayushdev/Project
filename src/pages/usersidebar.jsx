import React from "react";
import { Home, Calendar, Activity, Baby, BookOpen, MessageCircle, FileText, Settings, ChevronRight, Sparkles } from "lucide-react";
import "../cssonly/usersidebar.css";
import { useNavigate } from "react-router-dom";

const UserSidebar = ({ activeTab, setActiveTab, lmc, week, trimester, onChatOpen, user }) => {
  const navigate = useNavigate();
    const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'doctors', icon: Activity, label: 'Doctors' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'health', icon: Activity, label: 'Health Tracker' },
    { id: 'baby', icon: Baby, label: 'Baby Growth' },
    { id: 'babynames', icon: Sparkles, label: 'Baby Names' },
    { id: 'articles', icon: BookOpen, label: 'Articles' },
    { id: 'reports', icon: FileText, label: 'Reports' },
  ];

  const handleNav = (id) => {
    if (setActiveTab) setActiveTab(id);
    if (id === 'appointments') {
      navigate('/appointment');
    } else if (id === 'dashboard') {
      navigate('/pregnancydashboard');
    } else if (id === 'doctors') {
      navigate('/pregnancydashboard?section=doctors');
    } else if (id === 'articles') {
      navigate('/pregnancydashboard?section=articles');
    } else if (id === 'baby') {
      navigate('/pregnancydashboard?section=babygrowth');
    } else if (id === 'babynames') {
      navigate('/pregnancydashboard?section=babynames');
    } else if (id === 'health') {
      navigate('/healthtracker');
    } else if (id === 'reports') {
      navigate('/reports');
    } else if (id === 'chat') {
      // Open chat modal instead of navigating
      if (onChatOpen) {
        onChatOpen();
      } else {
        navigate('/user-messaging');
      }
    }
    // Add more navigation as needed
  };

  const progress = week && week > 0 ? Math.min(week / 40 * 100, 100) : 0;

  return (
    <aside className="usersidebar">
      <div className="usersidebar-header">
        <div className="usersidebar-header-icon">
          <Baby size={28} />
        </div>
        <h1>Pregnancy Care</h1>
      </div>
      
      <div className="usersidebar-progress">
        <div className="usersidebar-progress-circle">
          <span className="usersidebar-week-number">{week !== null && week !== undefined ? week : '--'}</span>
          <span className="usersidebar-week-text">weeks</span>
        </div>
        <div className="usersidebar-progress-bar-container">
          <div className="usersidebar-progress-bar-bg">
            <div
              className="usersidebar-progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <p className="usersidebar-progress-text">{trimester || '--'}</p>
      </div>
      <nav className="usersidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`usersidebar-link${activeTab === item.id ? " active" : ""}`}
                onClick={() => handleNav(item.id)}
              >
                <span className="icon"><item.icon size={20} /></span>
                <span>{item.label}</span>
                <ChevronRight size={16} className="nav-arrow" />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="usersidebar-footer">
        <button className="usersidebar-link" style={{ width: "100%", marginBottom: 8 }}>
          <span className="icon"><Settings size={18} /></span>
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;