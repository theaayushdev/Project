import React from "react";
import { useState } from "react";
import "../../cssonly/userregister.css";


const Registerlogin = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    contact: "",
    location: "",
    age: "",
    guardian_name: "",
    guardian_contact: "",
    bloodtype: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`⚠️ Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Network error or server is unreachable.");
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Register</h2>
      <form className="form" onSubmit={handleSubmit}>
        {[
          "firstname",
          "lastname",
          "contact",
          "location",
          "age",
          "guardian_name",
          "guardian_contact",
          "bloodtype",
          "email",
          "password",
        ].map((field) => (
          <div key={field}>
            <input
              className="input"
              type={field === "password" ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.replace("_", " ")}
              required
            />
          </div>
        ))}
        <button type="submit" className="login-button">
          Register
        </button>
        {message && <p>{message}</p>}
        <div className="forgot-password">
          <a href="#">Forgot password?</a>
        </div>
      </form>

      <div className="social-account-container">
        <span className="title">Or register with</span>
        <div className="social-accounts">
          <button className="social-button">
            <svg className="svg" width="20" height="20" fill="currentColor">
              <path d="M10 0c-5.522 0-10 4.478-10 10s4.478 10 10 10 10-4.478 10-10-4.478-10-10-10zm1.8 15h-3.6v-6h3.6v6zm-1.8-7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-6c-.7 0-1.3.3-1.8.8-.5-.5-1.2-.8-1.8-.8-1.7 0-3 1.3-3 3s1.3 3 3 3c.7 0 1.3-.3 1.8-.8.5.5 1.2.8 1.8.8 1.7 0 3-1.3 3-3s-1.3-3-3-3z"/>
            </svg>
          </button>
          {/* Add other social buttons here */}
        </div>
      </div>

      <div className="agreement">
        <a href="#">By signing up, you agree to our terms and conditions</a>
      </div>
    </div>
  );
};

export default Registerlogin;
