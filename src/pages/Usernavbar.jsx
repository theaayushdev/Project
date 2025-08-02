import React, { useState } from 'react';
import { Phone, AlertTriangle, Heart, Baby, X, Shield } from 'lucide-react';
import '../cssonly/usernavbar.css';

const UserNavbar = ({ user }) => {
  const [showHotline, setShowHotline] = useState(false);

  const emergencyNumbers = [
    {
      title: "Emergency Ambulance",
      number: "102",
      description: "24/7 Emergency Medical Services",
      icon: AlertTriangle,
      color: "#dc2626",
      urgent: true
    },
    {
      title: "Women's Helpline",
      number: "1091",
      description: "Women in Distress Support",
      icon: Heart,
      color: "#e91e63",
      urgent: false
    },
    {
      title: "Child Helpline",
      number: "1098",
      description: "Child Protection & Support",
      icon: Baby,
      color: "#3b82f6",
      urgent: false
    },
    {
      title: "Police Emergency",
      number: "100",
      description: "Police Emergency Services",
      icon: Shield,
      color: "#1f2937",
      urgent: true
    }
  ];

  const healthTips = [
    "Call 102 immediately for severe bleeding or severe abdominal pain",
    "Contact your doctor if you experience persistent headaches or vision changes",
    "Seek immediate help for signs of preeclampsia: swelling, high blood pressure",
    "Emergency signs: decreased fetal movement, severe nausea, high fever"
  ];

  return (
    <>
      <nav className="user-navbar-modern">
        <div className="user-navbar-logo-modern">
          <span className="pregnify-brand">Pregnify</span>
        </div>
        
        {/* Hotline Button */}
        <div className="hotline-section">
          <button 
            className="hotline-trigger-btn"
            onClick={() => setShowHotline(true)}
            title="Emergency Hotlines & Health Information"
          >
            <Phone size={18} />
            <span className="hotline-text">Emergency Hotlines</span>
            <div className="hotline-pulse"></div>
          </button>
        </div>

        <div className="user-navbar-user-modern">
          <span className="user-navbar-greeting-modern">
            <span className="hello-text">Hello,</span> <span className="user-name">{user && user.firstname ? user.firstname : 'User'}</span>
          </span>
          <div className="user-avatar-modern">
            {user && user.firstname ? user.firstname[0] : 'U'}
          </div>
        </div>
      </nav>

      {/* Hotline Modal */}
      {showHotline && (
        <div className="hotline-modal-overlay" onClick={() => setShowHotline(false)}>
          <div className="hotline-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hotline-header">
              <div className="hotline-title">
                <Phone size={24} className="hotline-icon" />
                <h3>Emergency Hotlines & Health Information</h3>
              </div>
              <button 
                className="hotline-close"
                onClick={() => setShowHotline(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="hotline-content">
              {/* Emergency Numbers Grid */}
              <div className="emergency-numbers-section">
                <h4>Emergency Numbers</h4>
                <div className="emergency-numbers-grid">
                  {emergencyNumbers.map((emergency, index) => (
                    <div 
                      key={index} 
                      className={`emergency-card ${emergency.urgent ? 'urgent' : ''}`}
                    >
                      <div className="emergency-icon" style={{ color: emergency.color }}>
                        <emergency.icon size={28} />
                      </div>
                      <div className="emergency-info">
                        <h5>{emergency.title}</h5>
                        <div className="emergency-number" style={{ color: emergency.color }}>
                          {emergency.number}
                        </div>
                        <p>{emergency.description}</p>
                        <a 
                          href={`tel:${emergency.number}`}
                          className="call-btn"
                          style={{ backgroundColor: emergency.color }}
                        >
                          <Phone size={16} />
                          Call Now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Tips Section */}
              <div className="health-tips-section">
                <h4>Important Health Information</h4>
                <div className="health-tips-list">
                  {healthTips.map((tip, index) => (
                    <div key={index} className="health-tip-item">
                      <div className="tip-icon">
                        <Heart size={16} />
                      </div>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions-section">
                <h4>Quick Actions</h4>
                <div className="quick-actions-grid">
                  <button className="quick-action-btn emergency">
                    <AlertTriangle size={20} />
                    <span>Call Emergency</span>
                    <small>102</small>
                  </button>
                  <button className="quick-action-btn doctor">
                    <Heart size={20} />
                    <span>Contact Doctor</span>
                    <small>From Dashboard</small>
                  </button>
                  <button className="quick-action-btn support">
                    <Baby size={20} />
                    <span>Pregnancy Support</span>
                    <small>1091</small>
                  </button>
                </div>
              </div>

              {/* Additional Information */}
              <div className="additional-info">
                <div className="info-card">
                  <h5>Remember:</h5>
                  <ul>
                    <li>Always keep your doctor's contact handy</li>
                    <li>In case of emergency, call 102 first</li>
                    <li>Keep your pregnancy details ready when calling</li>
                    <li>Don't hesitate to seek help when needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNavbar;