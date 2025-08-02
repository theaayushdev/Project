import React, { useState } from 'react';
import { Heart, Droplets, Moon, Activity } from 'lucide-react';

const HealthTrackerSimple = () => {
  console.log('HealthTrackerSimple is rendering!');
  
  const [mood, setMood] = useState(5);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
    color: '#2d3748'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{color: '#2d3748', fontSize: '2rem', margin: '0 0 0.5rem 0'}}>
          Health Tracker
        </h1>
        <p style={{color: '#718096', margin: 0}}>
          Monitor your daily health metrics
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerStyle}>
          <Activity size={24} />
          <h3 style={{margin: 0}}>Mood Tracker</h3>
        </div>
        <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
            <button
              key={score}
              onClick={() => setMood(score)}
              style={{
                padding: '0.75rem',
                border: mood === score ? '2px solid #667eea' : '2px solid #e2e8f0',
                borderRadius: '8px',
                background: mood === score ? '#667eea' : 'white',
                color: mood === score ? 'white' : '#4a5568',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {score}
            </button>
          ))}
        </div>
        <div style={{textAlign: 'center', marginTop: '1rem', fontSize: '1.2rem'}}>
          Current mood: {mood}/10
        </div>
      </div>

      <div style={cardStyle}>
        <div style={headerStyle}>
          <Droplets size={24} />
          <h3 style={{margin: 0}}>Water Intake</h3>
        </div>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#667eea'}}>
            5 glasses
          </div>
          <p>Keep hydrated throughout the day!</p>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={headerStyle}>
          <Moon size={24} />
          <h3 style={{margin: 0}}>Sleep Tracker</h3>
        </div>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#667eea'}}>
            8 hours
          </div>
          <p>Good night's sleep!</p>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={headerStyle}>
          <Heart size={24} />
          <h3 style={{margin: 0}}>Heart Rate</h3>
        </div>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#f43f5a'}}>
            75 BPM
          </div>
          <p>Normal range</p>
        </div>
      </div>
    </div>
  );
};

export default HealthTrackerSimple;
