import { useState } from "react";

const Registerlogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('⚠️ Username and password are required.');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Server Error:', errorData); 
        setMessage(`⚠️ Error: ${errorData.error || 'Unexpected error occurred.'} (Status: ${res.status})`);
        return;
      }

      const data = await res.json();
      setMessage(`✅ ${data.message}`);
    } catch (err) {
    
      console.error('Network or Unexpected Error:', err);
      setMessage("⚠️ Network error or server is unreachable.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Register</h2>
      <div>
        <label htmlFor="username">Username:</label><br />
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <label htmlFor="password">Password:</label><br />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" style={{ marginTop: '15px' }}>Register</button>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </form>
  );
};

export default Registerlogin;