import React from 'react';

const HealthTrackerBasic = () => {
  console.log('HealthTrackerBasic is rendering!');
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      color: 'white'
    }}>
      <h1>Health Tracker is Working!</h1>
      <p>If you can see this text, the component is loading correctly.</p>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '2rem',
        borderRadius: '16px',
        color: 'black',
        marginTop: '2rem'
      }}>
        <h2>Test Card</h2>
        <p>This is a test health tracking interface.</p>
        <button style={{
          padding: '0.75rem 1.5rem',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Test Button
        </button>
      </div>
    </div>
  );
};

export default HealthTrackerBasic;
