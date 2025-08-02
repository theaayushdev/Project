import React from 'react';

const TestNavbar = () => {
  console.log('TestNavbar component is rendering');
  
  return (
    <div style={{
      backgroundColor: '#667eea',
      color: 'white',
      padding: '20px',
      margin: '10px',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2>Test Navbar Component</h2>
      <p>If you can see this, React is working properly!</p>
      <button 
        style={{
          backgroundColor: 'white',
          color: '#667eea',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button clicked!')}
      >
        Test Button
      </button>
    </div>
  );
};

export default TestNavbar;
