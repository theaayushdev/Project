import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const Registerlogin = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate

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
        navigate("/additionalinformation"); // ✅ Redirect after success
      } else {
        setMessage(`⚠️ Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Network error or server is unreachable.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Register</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>First Name:</label><br />
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Last Name:</label><br />
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Contact:</label><br />
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Location:</label><br />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Age:</label><br />
        <input
          type="text"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Guardian Name:</label><br />
        <input
          type="text"
          name="guardian_name"
          value={formData.guardian_name}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Guardian Contact:</label><br />
        <input
          type="text"
          name="guardian_contact"
          value={formData.guardian_contact}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Blood Type:</label><br />
        <input
          type="text"
          name="bloodtype"
          value={formData.bloodtype}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Email:</label><br />
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Password:</label><br />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default Registerlogin;
