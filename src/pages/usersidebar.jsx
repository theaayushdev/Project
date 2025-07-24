import React from "react";
import { Home, Calendar, Activity, Baby, BookOpen, MessageCircle, FileText, Settings, LogOut, ChevronRight } from "lucide-react";
import "../cssonly/usersidebar.css";

const UserSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'health', icon: Activity, label: 'Health Tracker' },
    { id: 'baby', icon: Baby, label: 'Baby Growth' },
    { id: 'articles', icon: BookOpen, label: 'Articles' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'reports', icon: FileText, label: 'Reports' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="pregnancy-progress">
          <div className="progress-circle">
            <div className="progress-inner">
              <span className="week-number">24</span>
              <span className="week-text">weeks</span>
            </div>
          </div>
          <p className="progress-text">2nd Trimester</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab && setActiveTab(item.id)}
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