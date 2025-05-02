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
        setMessage("✅ Login Successful!");
        setTimeout(() => {
          setMessage("");
          navigate("/dashboard");
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
    <>
      <Head />
      <div className="card">
        <div className="card2">
          <form className="form" onSubmit={handleLogin}>
            <p id="heading">Login</p>

            {message && <div className="popup">{message}</div>}

            <div className="field">
              <input
                type="text"
                className="input-field"
                placeholder="Phone Number"
                autoComplete="off"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <input
                type="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="btn">
              <button type="submit" className="button1">
                Login
              </button>
              <button
                type="button"
                className="button2"
                onClick={() => navigate("/userregister")}
              >
                Sign Up
              </button>
            </div>
            <button type="button" className="button3">
              Forgot Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

function Head() {
  return <h1 className="headings">Welcome Dear Users</h1>;
}

export default Login;
