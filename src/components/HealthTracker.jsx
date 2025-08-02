import React, { useState, useEffect } from 'react';
import { Heart, Droplets, Moon, Activity, Brain, TrendingUp, Calendar, Plus, Save } from 'lucide-react';
import '../cssonly/healthtracker.css';

const HealthTracker = () => {
  const [user, setUser] = useState(null);
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
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
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
        fetchRecentRecords();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error saving record:', error);
    }
    setSaving(false);
  };

  const handleWaterIntake = (change) => {
    const newValue = Math.max(0, Math.min(20, (todayRecord.water_intake || 0) + change));
    saveRecord('water_intake', newValue);
  };

  if (loading) {
    return (
      <div className="health-tracker-container">
        <div className="loading-spinner">Loading your health tracker...</div>
      </div>
    );
  }

  return (
    <div className="health-tracker-container">
      <div className="health-tracker-header">
        <div className="header-content">
          <h1>Health Tracker</h1>
          <p>Track your daily wellness and see your progress over time</p>
        </div>
        <div className="header-stats">
          {analytics && (
            <div className="quick-stats">
              <div className="stat-item">
                <Brain size={20} />
                <span>Avg Mood: {analytics.avg_mood}/10</span>
              </div>
              <div className="stat-item">
                <Droplets size={20} />
                <span>Avg Water: {analytics.avg_water} glasses</span>
              </div>
              <div className="stat-item">
                <Moon size={20} />
                <span>Avg Sleep: {analytics.avg_sleep}h</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="health-tracker-grid">
        {/* Mood Tracker */}
        <div className="health-card mood-card">
          <div className="card-header">
            <Brain size={24} />
            <h3>Mood Tracker</h3>
          </div>
          <div className="mood-section">
            <div className="mood-scale">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(score => (
                <button
                  key={score}
                  className={`mood-button ${todayRecord.mood_score === score ? 'active' : ''}`}
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
        <div className="health-card water-card">
          <div className="card-header">
            <Droplets size={24} />
            <h3>Water Intake</h3>
          </div>
          <div className="water-section">
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
                className="water-btn decrease"
                onClick={() => handleWaterIntake(-1)}
                disabled={!todayRecord.water_intake}
              >
                -
              </button>
              <button 
                className="water-btn increase"
                onClick={() => handleWaterIntake(1)}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Sleep Tracker */}
        <div className="health-card sleep-card">
          <div className="card-header">
            <Moon size={24} />
            <h3>Sleep Tracker</h3>
          </div>
          <div className="sleep-section">
            <div className="input-group">
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
            <div className="input-group">
              <label>Sleep quality</label>
              <div className="quality-buttons">
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
            </div>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="health-card heart-card">
          <div className="card-header">
            <Heart size={24} />
            <h3>Heart Rate</h3>
          </div>
          <div className="vitals-section">
            <div className="input-group">
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
            {todayRecord.heart_rate && (
              <div className="heart-rate-status">
                <div className="pulse-animation">
                  <Heart size={20} />
                </div>
                <span>{todayRecord.heart_rate} bpm</span>
              </div>
            )}
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="health-card bp-card">
          <div className="card-header">
            <Activity size={24} />
            <h3>Blood Pressure</h3>
          </div>
          <div className="vitals-section">
            <div className="bp-inputs">
              <div className="input-group">
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
              <div className="input-group">
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
            {todayRecord.systolic_bp && todayRecord.diastolic_bp && (
              <div className="bp-display">
                <span className="bp-reading">{todayRecord.systolic_bp}/{todayRecord.diastolic_bp}</span>
                <span className="bp-unit">mmHg</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Records */}
        <div className="health-card history-card full-width">
          <div className="card-header">
            <TrendingUp size={24} />
            <h3>Recent Records</h3>
          </div>
          <div className="history-section">
            {recentRecords.length > 0 ? (
              <div className="records-timeline">
                {recentRecords.map((record, index) => (
                  <div key={record.id || index} className="record-item">
                    <div className="record-date">
                      <Calendar size={16} />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                    <div className="record-data">
                      {record.mood_score && <span className="data-item mood">😊 {record.mood_score}/10</span>}
                      {record.water_intake > 0 && <span className="data-item water">💧 {record.water_intake} glasses</span>}
                      {record.sleep_hours && <span className="data-item sleep">🌙 {record.sleep_hours}h</span>}
                      {record.heart_rate && <span className="data-item heart">❤️ {record.heart_rate} bpm</span>}
                      {record.systolic_bp && record.diastolic_bp && (
                        <span className="data-item bp">🩺 {record.systolic_bp}/{record.diastolic_bp}</span>
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

      {saving && (
        <div className="saving-indicator">
          <Save size={16} />
          Saving...
        </div>
      )}
    </div>
  );
};

export default HealthTracker;
