import React, { useState, useEffect } from 'react';
import { Heart, Droplets, Moon, Activity, TrendingUp, Calendar, Plus, Minus, Save, Check } from 'lucide-react';
import '../cssonly/healthtracker-fixed.css';

const HealthTrackerWorking = () => {
  const [user, setUser] = useState({ id: 1, name: 'User' });
  const [todayRecord, setTodayRecord] = useState({
    mood_score: 5,
    mood_notes: '',
    water_intake: 0,
    sleep_hours: 8,
    sleep_quality: 3,
    heart_rate: 75,
    systolic_bp: 120,
    diastolic_bp: 80
  });
  const [recentRecords, setRecentRecords] = useState([]);
  const [analytics, setAnalytics] = useState({
    avg_mood: 0,
    avg_water: 0,
    avg_sleep: 0,
    avg_heart_rate: 0
  });
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

  // Load data from localStorage on component mount
  useEffect(() => {
    loadFromLocalStorage();
    loadRecentRecords();
    calculateAnalytics();
    setLoading(false);
  }, []);

  // Auto-save to localStorage whenever todayRecord changes
  useEffect(() => {
    if (!loading) {
      saveToLocalStorage();
    }
  }, [todayRecord, loading]);

  const loadFromLocalStorage = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const savedData = localStorage.getItem(`health_record_${today}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setTodayRecord(parsedData);
      }
    } catch (error) {
      console.log('No saved data found for today');
    }
  };

  const saveToLocalStorage = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`health_record_${today}`, JSON.stringify(todayRecord));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const loadRecentRecords = () => {
    try {
      const allRecords = [];
      // Load last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const record = localStorage.getItem(`health_record_${dateStr}`);
        if (record) {
          allRecords.push({
            ...JSON.parse(record),
            date: dateStr,
            id: i
          });
        }
      }
      setRecentRecords(allRecords);
    } catch (error) {
      console.error('Failed to load recent records:', error);
    }
  };

  const calculateAnalytics = () => {
    try {
      const allRecords = [];
      // Load last 30 days for analytics
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const record = localStorage.getItem(`health_record_${dateStr}`);
        if (record) {
          allRecords.push(JSON.parse(record));
        }
      }

      if (allRecords.length > 0) {
        const avgMood = allRecords.reduce((sum, r) => sum + (r.mood_score || 0), 0) / allRecords.length;
        const avgWater = allRecords.reduce((sum, r) => sum + (r.water_intake || 0), 0) / allRecords.length;
        const avgSleep = allRecords.reduce((sum, r) => sum + (r.sleep_hours || 0), 0) / allRecords.length;
        const avgHR = allRecords.reduce((sum, r) => sum + (r.heart_rate || 0), 0) / allRecords.length;

        setAnalytics({
          avg_mood: Math.round(avgMood * 10) / 10,
          avg_water: Math.round(avgWater * 10) / 10,
          avg_sleep: Math.round(avgSleep * 10) / 10,
          avg_heart_rate: Math.round(avgHR)
        });
      }
    } catch (error) {
      console.error('Failed to calculate analytics:', error);
    }
  };

  const saveHealthRecord = async () => {
    setSaving(true);
    
    // Always save to localStorage first
    saveToLocalStorage();
    
    // Try to save to database
    try {
      const response = await fetch('http://localhost:5000/api/health/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          ...todayRecord
        })
      });
      
      if (response.ok) {
        console.log('Saved to database successfully');
      }
    } catch (error) {
      console.log('Database save failed, but saved locally');
    }
    
    // Reload recent records and analytics
    loadRecentRecords();
    calculateAnalytics();
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  const updateRecord = (field, value) => {
    setTodayRecord(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getHeartRateStatus = (hr) => {
    if (hr < 60) return { status: 'Low', color: '#3b82f6' };
    if (hr > 100) return { status: 'High', color: '#ef4444' };
    return { status: 'Normal', color: '#10b981' };
  };

  const getBPStatus = (sys, dia) => {
    if (sys > 140 || dia > 90) return { status: 'High', color: '#ef4444' };
    if (sys < 90 || dia < 60) return { status: 'Low', color: '#3b82f6' };
    return { status: 'Normal', color: '#10b981' };
  };

  if (loading) {
    return (
      <div className="health-tracker-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'white', fontSize: '1.2rem' }}>
          Loading your health data...
        </div>
      </div>
    );
  }

  return (
    <div className="health-tracker-container">
      {/* Header */}
      <div className="health-tracker-header">
        <div className="header-content">
          <h1>Health Tracker</h1>
          <p>Monitor your daily health metrics and wellness</p>
        </div>
        <div className="quick-stats">
          <div className="stat-item">
            <Heart size={20} />
            <span>{todayRecord.heart_rate} BPM</span>
          </div>
          <div className="stat-item">
            <Droplets size={20} />
            <span>{todayRecord.water_intake} glasses</span>
          </div>
          <div className="stat-item">
            <Moon size={20} />
            <span>{todayRecord.sleep_hours}h sleep</span>
          </div>
        </div>
      </div>

      <div className="health-tracker-grid">
        {/* Mood Tracker */}
        <div className="health-card">
          <div className="card-header">
            <Activity size={24} />
            <h3>Mood Analyzer</h3>
          </div>
          <div className="mood-section">
            <div className="mood-scale">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                <button
                  key={score}
                  onClick={() => updateRecord('mood_score', score)}
                  className={`mood-button ${todayRecord.mood_score === score ? 'active' : ''}`}
                >
                  {score}
                </button>
              ))}
            </div>
            <div className="mood-display">
              {moodLabels[todayRecord.mood_score]}
            </div>
            <textarea
              className="mood-notes"
              value={todayRecord.mood_notes}
              onChange={(e) => updateRecord('mood_notes', e.target.value)}
              placeholder="How are you feeling today? Add any notes..."
            />
          </div>
        </div>

        {/* Water Intake */}
        <div className="health-card">
          <div className="card-header">
            <Droplets size={24} />
            <h3>Water Intake</h3>
          </div>
          <div className="water-section">
            <div className="water-display">
              <div className="water-count">{todayRecord.water_intake}</div>
              <div className="water-label">glasses today</div>
            </div>
            <div className="water-visual">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`water-glass ${i < todayRecord.water_intake ? 'filled' : ''}`}
                />
              ))}
            </div>
            <div className="water-controls">
              <button 
                className="water-btn decrease"
                onClick={() => updateRecord('water_intake', Math.max(0, todayRecord.water_intake - 1))}
                disabled={todayRecord.water_intake <= 0}
              >
                <Minus size={16} />
              </button>
              <button 
                className="water-btn increase"
                onClick={() => updateRecord('water_intake', Math.min(8, todayRecord.water_intake + 1))}
                disabled={todayRecord.water_intake >= 8}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Sleep Tracker */}
        <div className="health-card">
          <div className="card-header">
            <Moon size={24} />
            <h3>Sleep Tracker</h3>
          </div>
          <div className="sleep-section">
            <div className="input-group">
              <label>Sleep Hours</label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={todayRecord.sleep_hours}
                onChange={(e) => updateRecord('sleep_hours', parseFloat(e.target.value) || 0)}
                placeholder="8.0"
              />
            </div>
            <div className="input-group">
              <label>Sleep Quality</label>
              <div className="quality-buttons">
                {[1, 2, 3, 4, 5].map(quality => (
                  <button
                    key={quality}
                    onClick={() => updateRecord('sleep_quality', quality)}
                    className={`quality-btn ${todayRecord.sleep_quality === quality ? 'active' : ''}`}
                  >
                    {quality}
                  </button>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '0.5rem', color: '#667eea', fontWeight: '600' }}>
                {sleepQualityLabels[todayRecord.sleep_quality]}
              </div>
            </div>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="health-card">
          <div className="card-header">
            <Heart size={24} />
            <h3>Heart Rate</h3>
          </div>
          <div className="vitals-section">
            <div className="input-group">
              <label>Heart Rate (BPM)</label>
              <input
                type="number"
                min="40"
                max="200"
                value={todayRecord.heart_rate}
                onChange={(e) => updateRecord('heart_rate', parseInt(e.target.value) || 0)}
                placeholder="75"
              />
            </div>
            <div className="heart-rate-status">
              <Heart className="pulse-animation" size={20} />
              <span style={{ color: getHeartRateStatus(todayRecord.heart_rate).color }}>
                {todayRecord.heart_rate} BPM - {getHeartRateStatus(todayRecord.heart_rate).status}
              </span>
            </div>
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="health-card">
          <div className="card-header">
            <TrendingUp size={24} />
            <h3>Blood Pressure</h3>
          </div>
          <div className="vitals-section">
            <div className="bp-inputs">
              <div className="input-group">
                <label>Systolic</label>
                <input
                  type="number"
                  min="70"
                  max="200"
                  value={todayRecord.systolic_bp}
                  onChange={(e) => updateRecord('systolic_bp', parseInt(e.target.value) || 0)}
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
                  value={todayRecord.diastolic_bp}
                  onChange={(e) => updateRecord('diastolic_bp', parseInt(e.target.value) || 0)}
                  placeholder="80"
                />
              </div>
            </div>
            <div className="bp-display">
              <div className="bp-reading" style={{ color: getBPStatus(todayRecord.systolic_bp, todayRecord.diastolic_bp).color }}>
                {todayRecord.systolic_bp}/{todayRecord.diastolic_bp}
              </div>
              <div className="bp-unit">
                mmHg - {getBPStatus(todayRecord.systolic_bp, todayRecord.diastolic_bp).status}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="health-card">
          <div className="card-header">
            <TrendingUp size={24} />
            <h3>Health Analytics</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="data-item" style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                {analytics.avg_mood}/10
              </div>
              <div style={{ fontSize: '0.8rem', color: '#718096' }}>Avg Mood</div>
            </div>
            <div className="data-item" style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                {analytics.avg_water}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#718096' }}>Avg Water</div>
            </div>
            <div className="data-item" style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                {analytics.avg_sleep}h
              </div>
              <div style={{ fontSize: '0.8rem', color: '#718096' }}>Avg Sleep</div>
            </div>
            <div className="data-item" style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f43f5a' }}>
                {analytics.avg_heart_rate}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#718096' }}>Avg HR</div>
            </div>
          </div>
        </div>

        {/* Recent Records */}
        <div className="health-card full-width">
          <div className="card-header">
            <Calendar size={24} />
            <h3>Recent Records</h3>
          </div>
          <div className="history-section">
            <div className="records-timeline">
              {recentRecords.length > 0 ? recentRecords.map(record => (
                <div key={record.id} className="record-item">
                  <div className="record-date">
                    <Calendar size={16} />
                    <span>{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                  <div className="record-data">
                    <div className="data-item">Mood: {record.mood_score}/10</div>
                    <div className="data-item">Water: {record.water_intake} glasses</div>
                    <div className="data-item">Sleep: {record.sleep_hours}h</div>
                    <div className="data-item">HR: {record.heart_rate} BPM</div>
                  </div>
                </div>
              )) : (
                <div className="no-records">
                  <p>No previous records found. Start tracking your health today!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
        <button
          onClick={saveHealthRecord}
          disabled={saving}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 1.5rem',
            background: saved ? '#10b981' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            transform: saving ? 'scale(0.95)' : 'scale(1)'
          }}
        >
          {saved ? <Check size={20} /> : <Save size={20} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Record'}
        </button>
      </div>

      {/* Auto-save indicator */}
      <div style={{ 
        position: 'fixed', 
        top: '1rem', 
        right: '1rem', 
        background: 'rgba(16, 185, 129, 0.9)', 
        color: 'white', 
        padding: '0.5rem 1rem', 
        borderRadius: '8px', 
        fontSize: '0.8rem',
        zIndex: 1000
      }}>
        ✓ Auto-saving enabled
      </div>
    </div>
  );
};

export default HealthTrackerWorking;
