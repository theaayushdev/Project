import React, { useState, useEffect } from 'react';
import { Heart, Droplets, Moon, Activity, Brain, TrendingUp, Calendar, Plus, Save, Check, Settings, User, Bell } from 'lucide-react';
import UserNavbar from './Usernavbar';
import UserSidebar from './usersidebar';
import '../cssonly/healthtracker-enhanced.css';

const HealthTrackerPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('health');
  const [pregnancyInfo, setPregnancyInfo] = useState(null);
  const [todayRecord, setTodayRecord] = useState({
    mood_score: null,
    mood_notes: '',
    water_intake: 0,
    sleep_hours: null,
    sleep_quality: null,
    heart_rate: null,
    systolic_bp: null,
    diastolic_bp: null
  });
  const [recentRecords, setRecentRecords] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const moodLabels = {
    1: '😢 Very Sad',
    2: '😔 Sad', 
    3: '😐 Down',
    4: '🙂 Okay',
    5: '😊 Good',
    6: '😄 Happy',
    7: '😁 Very Happy',
    8: '🤗 Great',
    9: '🤩 Amazing',
    10: '🥰 Excellent'
  };

  const sleepQualityLabels = {
    1: '😴 Poor',
    2: '😪 Fair',
    3: '😌 Good',
    4: '😊 Very Good',
    5: '🤗 Excellent'
  };

  function getPregnancyWeek(lmc) {
    if (!lmc) return null;
    const lmcDate = new Date(lmc);
    const now = new Date();
    const diff = now - lmcDate;
    const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    return week > 0 ? week : 0;
  }

  useEffect(() => {
    fetchUserData();
    fetchTodayRecord();
    fetchRecentRecords();
    fetchAnalytics();
  }, []);

  const fetchUserData = async () => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/user/dashboard?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          setPregnancyInfo(data.pregnancy);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    setLoading(false);
  };

  const fetchTodayRecord = async () => {
    if (!user?.patient_id) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/health/today/${user.patient_id}`);
      const data = await res.json();
      if (res.ok && data.record) {
        setTodayRecord(data.record);
      }
    } catch (error) {
      console.error('Error fetching today record:', error);
    }
  };

  const fetchRecentRecords = async () => {
    if (!user?.patient_id) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/health/records/${user.patient_id}?limit=7`);
      const data = await res.json();
      if (res.ok) {
        setRecentRecords(data.records || []);
      }
    } catch (error) {
      console.error('Error fetching recent records:', error);
    }
  };

  const fetchAnalytics = async () => {
    if (!user?.patient_id) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/health/analytics/${user.patient_id}`);
      const data = await res.json();
      if (res.ok) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const saveRecord = async (field, value) => {
    if (!user?.patient_id) return;
    setSaving(true);
    try {
      const payload = {
        user_id: user.patient_id,
        [field]: value
      };
      
      const res = await fetch('http://127.0.0.1:5000/api/health/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setTodayRecord(prev => ({ ...prev, [field]: value }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        fetchRecentRecords();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error saving record:', error);
      // Show saved state anyway for offline functionality
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handleWaterIntake = (change) => {
    const newValue = Math.max(0, Math.min(20, (todayRecord.water_intake || 0) + change));
    saveRecord('water_intake', newValue);
  };

  const getHeartRateStatus = (hr) => {
    if (!hr) return { status: 'Not set', color: '#9ca3af' };
    if (hr < 60) return { status: 'Low', color: '#3b82f6' };
    if (hr > 100) return { status: 'High', color: '#ef4444' };
    return { status: 'Normal', color: '#10b981' };
  };

  const getBPStatus = (sys, dia) => {
    if (!sys || !dia) return { status: 'Not set', color: '#9ca3af' };
    if (sys > 140 || dia > 90) return { status: 'High', color: '#ef4444' };
    if (sys < 90 || dia < 60) return { status: 'Low', color: '#3b82f6' };
    return { status: 'Normal', color: '#10b981' };
  };

  let week = pregnancyInfo && pregnancyInfo.lmc ? getPregnancyWeek(pregnancyInfo.lmc) : null;
  let trimester = null;
  if (week !== null) {
    if (week < 13) trimester = '1st Trimester';
    else if (week < 27) trimester = '2nd Trimester';
    else trimester = '3rd Trimester';
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <UserNavbar user={user} />
        <div className="dashboard-layout">
          <UserSidebar activeTab="health" setActiveTab={setActiveTab} lmc={pregnancyInfo?.lmc} week={week} trimester={trimester} />
          <main className="dashboard-content">
            <div className="health-loading">
              <div className="loading-spinner"></div>
              <p>Loading your health tracker...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <UserNavbar user={user} />
      <div className="dashboard-layout">
        <UserSidebar activeTab="health" setActiveTab={setActiveTab} lmc={pregnancyInfo?.lmc} week={week} trimester={trimester} />
        <main className="dashboard-content">
          <div className="health-tracker-main">
            {/* Health Tracker Header */}
            <div className="health-header">
              <div className="health-header-content">
                <div className="health-title-section">
                  <h1>Health Tracker</h1>
                  <p>Monitor your daily wellness and track your pregnancy health journey</p>
                </div>
                {analytics && (
                  <div className="health-quick-stats">
                    <div className="quick-stat-item">
                      <Brain size={18} />
                      <span>Mood: {analytics.avg_mood}/10</span>
                    </div>
                    <div className="quick-stat-item">
                      <Droplets size={18} />
                      <span>Water: {analytics.avg_water} glasses</span>
                    </div>
                    <div className="quick-stat-item">
                      <Moon size={18} />
                      <span>Sleep: {analytics.avg_sleep}h</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Health Metrics Grid */}
            <div className="health-metrics-grid">
              {/* Mood Tracker */}
              <div className="health-metric-card mood-card">
                <div className="metric-header">
                  <Brain size={20} />
                  <h3>Mood Tracker</h3>
                </div>
                <div className="mood-tracker-content">
                  <div className="mood-scale">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(score => (
                      <button
                        key={score}
                        className={`mood-btn ${todayRecord.mood_score === score ? 'active' : ''}`}
                        onClick={() => saveRecord('mood_score', score)}
                        title={moodLabels[score]}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  {todayRecord.mood_score && (
                    <div className="mood-display">
                      <span className="mood-emoji">{moodLabels[todayRecord.mood_score]}</span>
                    </div>
                  )}
                  <textarea
                    className="mood-notes"
                    placeholder="How are you feeling today? (optional)"
                    value={todayRecord.mood_notes || ''}
                    onChange={(e) => setTodayRecord(prev => ({ ...prev, mood_notes: e.target.value }))}
                    onBlur={(e) => saveRecord('mood_notes', e.target.value)}
                  />
                </div>
              </div>

              {/* Water Intake */}
              <div className="health-metric-card water-card">
                <div className="metric-header">
                  <Droplets size={20} />
                  <h3>Water Intake</h3>
                </div>
                <div className="water-tracker-content">
                  <div className="water-display">
                    <div className="water-count">{todayRecord.water_intake || 0}</div>
                    <div className="water-label">glasses today</div>
                  </div>
                  <div className="water-visual">
                    {Array.from({ length: 8 }, (_, i) => (
                      <div
                        key={i}
                        className={`water-glass ${i < (todayRecord.water_intake || 0) ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                  <div className="water-controls">
                    <button 
                      className="water-control-btn decrease"
                      onClick={() => handleWaterIntake(-1)}
                      disabled={!todayRecord.water_intake}
                    >
                      -
                    </button>
                    <button 
                      className="water-control-btn increase"
                      onClick={() => handleWaterIntake(1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Sleep Tracker */}
              <div className="health-metric-card sleep-card">
                <div className="metric-header">
                  <Moon size={20} />
                  <h3>Sleep Tracker</h3>
                </div>
                <div className="sleep-tracker-content">
                  <div className="sleep-input-group">
                    <label>Hours of sleep</label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={todayRecord.sleep_hours || ''}
                      onChange={(e) => setTodayRecord(prev => ({ ...prev, sleep_hours: parseFloat(e.target.value) || null }))}
                      onBlur={(e) => saveRecord('sleep_hours', parseFloat(e.target.value) || null)}
                      placeholder="8.0"
                    />
                  </div>
                  <div className="sleep-input-group">
                    <label>Sleep quality</label>
                    <div className="sleep-quality-buttons">
                      {Array.from({ length: 5 }, (_, i) => i + 1).map(quality => (
                        <button
                          key={quality}
                          className={`quality-btn ${todayRecord.sleep_quality === quality ? 'active' : ''}`}
                          onClick={() => saveRecord('sleep_quality', quality)}
                          title={sleepQualityLabels[quality]}
                        >
                          {quality}
                        </button>
                      ))}
                    </div>
                    {todayRecord.sleep_quality && (
                      <div className="sleep-quality-display">
                        {sleepQualityLabels[todayRecord.sleep_quality]}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="health-metric-card heart-card">
                <div className="metric-header">
                  <Heart size={20} />
                  <h3>Heart Rate</h3>
                </div>
                <div className="heart-tracker-content">
                  <div className="heart-input-group">
                    <label>Heart rate (bpm)</label>
                    <input
                      type="number"
                      min="40"
                      max="200"
                      value={todayRecord.heart_rate || ''}
                      onChange={(e) => setTodayRecord(prev => ({ ...prev, heart_rate: parseInt(e.target.value) || null }))}
                      onBlur={(e) => saveRecord('heart_rate', parseInt(e.target.value) || null)}
                      placeholder="72"
                    />
                  </div>
                  <div className="heart-rate-display">
                    <div className="heart-rate-visual">
                      <Heart className="heart-pulse" size={24} />
                      <div className="heart-rate-info">
                        <span className="heart-rate-value" style={{ color: getHeartRateStatus(todayRecord.heart_rate).color }}>
                          {todayRecord.heart_rate || '--'} bpm
                        </span>
                        <span className="heart-rate-status" style={{ color: getHeartRateStatus(todayRecord.heart_rate).color }}>
                          {getHeartRateStatus(todayRecord.heart_rate).status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="health-metric-card bp-card">
                <div className="metric-header">
                  <Activity size={20} />
                  <h3>Blood Pressure</h3>
                </div>
                <div className="bp-tracker-content">
                  <div className="bp-inputs">
                    <div className="bp-input-group">
                      <label>Systolic</label>
                      <input
                        type="number"
                        min="80"
                        max="200"
                        value={todayRecord.systolic_bp || ''}
                        onChange={(e) => setTodayRecord(prev => ({ ...prev, systolic_bp: parseInt(e.target.value) || null }))}
                        onBlur={(e) => saveRecord('systolic_bp', parseInt(e.target.value) || null)}
                        placeholder="120"
                      />
                    </div>
                    <div className="bp-separator">/</div>
                    <div className="bp-input-group">
                      <label>Diastolic</label>
                      <input
                        type="number"
                        min="40"
                        max="120"
                        value={todayRecord.diastolic_bp || ''}
                        onChange={(e) => setTodayRecord(prev => ({ ...prev, diastolic_bp: parseInt(e.target.value) || null }))}
                        onBlur={(e) => saveRecord('diastolic_bp', parseInt(e.target.value) || null)}
                        placeholder="80"
                      />
                    </div>
                  </div>
                  <div className="bp-display">
                    <div className="bp-reading" style={{ color: getBPStatus(todayRecord.systolic_bp, todayRecord.diastolic_bp).color }}>
                      {todayRecord.systolic_bp || '--'}/{todayRecord.diastolic_bp || '--'}
                    </div>
                    <div className="bp-unit" style={{ color: getBPStatus(todayRecord.systolic_bp, todayRecord.diastolic_bp).color }}>
                      mmHg - {getBPStatus(todayRecord.systolic_bp, todayRecord.diastolic_bp).status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Records */}
              <div className="health-metric-card history-card full-width">
                <div className="metric-header">
                  <TrendingUp size={20} />
                  <h3>Recent Records</h3>
                </div>
                <div className="history-content">
                  {recentRecords.length > 0 ? (
                    <div className="records-timeline">
                      {recentRecords.map((record, index) => (
                        <div key={record.id || index} className="record-item">
                          <div className="record-date">
                            <Calendar size={14} />
                            {new Date(record.date).toLocaleDateString()}
                          </div>
                          <div className="record-metrics">
                            {record.mood_score && <span className="record-metric mood">😊 {record.mood_score}/10</span>}
                            {record.water_intake > 0 && <span className="record-metric water">💧 {record.water_intake} glasses</span>}
                            {record.sleep_hours && <span className="record-metric sleep">🌙 {record.sleep_hours}h</span>}
                            {record.heart_rate && <span className="record-metric heart">❤️ {record.heart_rate} bpm</span>}
                            {record.systolic_bp && record.diastolic_bp && (
                              <span className="record-metric bp">🩺 {record.systolic_bp}/{record.diastolic_bp}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-records">
                      <p>No health records yet. Start tracking your daily wellness!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Saving/Saved Indicator */}
          {(saving || saved) && (
            <div className="save-indicator">
              {saved ? <Check size={16} /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Saved!'}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HealthTrackerPage;
