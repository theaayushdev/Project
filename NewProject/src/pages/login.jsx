import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cssonly/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault(); 

    if (username === "Uadmin" && password === "Upassword") {
      setMessage("Login Successful!");
      setTimeout(() => {
        setMessage(""); 
        navigate("/userhome");
      }, 1500); 
    } else {
      setMessage("Invalid Username or Password!");
      setTimeout(() => setMessage(""), 1500);
    }
  };

  return (
    <>
      <Head />
      <div className="card">
        <div className="card2">
          <form className="form">
            <p id="heading">Login</p>
            
            {message && <div className="popup">{message}</div>}

            <div className="field">
              <input
                type="text"
                className="input-field"
                placeholder="Username"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="field">
              <input
                type="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="btn">
              <button type="button" className="button1" onClick={handleLogin}>
                Login
              </button>
              <button type="button" className="button2">Sign Up</button>
            </div>
            <button type="button" className="button3">Forgot Password</button>
          </form>
        </div>
      </div>
    </>
  );
};

function Head() {
  return <h1 className="headings">Welcome Dear User</h1>;
}
export default Login;
