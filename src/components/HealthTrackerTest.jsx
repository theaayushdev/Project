import React, { useState } from 'react';
import { Heart, Droplets, Moon, Activity, TrendingUp, Calendar, Plus, Minus } from 'lucide-react';
import '../cssonly/healthtracker.css';

const HealthTrackerTest = () => {
  console.log('HealthTrackerTest component is rendering!');
  const [mood, setMood] = useState(5);
  const [waterIntake, setWaterIntake] = useState(3);
  const [sleepHours, setSleepHours] = useState(8);
  const [heartRate, setHeartRate] = useState(75);

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

  return (
    <div className="health-tracker-container">
      <div className="health-tracker-header">
        <div className="header-content">
          <h1>Health Tracker</h1>
          <p>Monitor your daily health metrics</p>
        </div>
        <div className="quick-stats">
          <div className="stat-item">
            <Heart size={20} />
            <span>{heartRate} BPM</span>
          </div>
          <div className="stat-item">
            <Droplets size={20} />
            <span>{waterIntake} glasses</span>
          </div>
          <div className="stat-item">
            <Moon size={20} />
            <span>{sleepHours}h sleep</span>
          </div>
        </div>
      </div>
      
      <div className="health-tracker-grid">
        {/* Mood Tracker */}
        <div className="health-card">
          <div className="card-header">
            <Activity size={24} />
            <h3>Mood Tracker</h3>
          </div>
          <div className="mood-section">
            <div className="mood-scale">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                <button
                  key={score}
                  onClick={() => setMood(score)}
                  className={`mood-button ${mood === score ? 'active' : ''}`}
                >
                  {score}
                </button>
              ))}
            </div>
            <div className="mood-display">
              {moodLabels[mood]}
            </div>
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
              <div className="water-count">{waterIntake}</div>
              <div className="water-label">glasses today</div>
            </div>
            <div className="water-visual">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`water-glass ${i < waterIntake ? 'filled' : ''}`}
                />
              ))}
            </div>
            <div className="water-controls">
              <button 
                className="water-btn decrease"
                onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))}
                disabled={waterIntake <= 0}
              >
                <Minus size={20} />
              </button>
              <button 
                className="water-btn increase"
                onClick={() => setWaterIntake(Math.min(8, waterIntake + 1))}
                disabled={waterIntake >= 8}
              >
                <Plus size={20} />
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
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                placeholder="8.0"
              />
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
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="75"
              />
            </div>
            <div className="heart-rate-status">
              <Heart className="pulse-animation" size={20} />
              <span>{heartRate} BPM - Normal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTrackerTest;
