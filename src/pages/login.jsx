import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cssonly/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // ✅ Store contact for later use in dashboard
        localStorage.setItem("userContact", contact);

        setMessage("✅ Login Successful!");
        setTimeout(() => {
          setMessage("");
          navigate("/pregnancydashboard"); // ✅ Navigate to dashboard
        }, 1500);
      } else {
        setMessage(`⚠️ ${data.error}`);
        setTimeout(() => setMessage(""), 1500);
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Network error or server is unreachable.");
    }
  };

  return (
    <div className="login1-wrapper">
      <Head />
      <div className="login1-card">
        <div className="login1-card2">
          <form className="login1-form" onSubmit={handleLogin}>
            <p id="heading">Login</p>

            {message && <div className="login1-popup">{message}</div>}

            <div className="login1-field">
              <input
                type="text"
                className="login1-input"
                placeholder="Phone Number"
                autoComplete="off"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
            <div className="login1-field">
              <input
                type="password"
                className="login1-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="btn">
              <button type="submit" className="bun1">Login</button>
              <button
                type="button"
                className="bun2"
                onClick={() => navigate("/userregister")}
              >
                Sign Up
              </button>
            </div>

            <button type="button" className="bun3">Forgot Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

function Head() {
  return <h1 className="login1-headings">Welcome Dear Users</h1>;
}

export default Login;
