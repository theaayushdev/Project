import { useState } from "react";

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

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Register</h2>

      {[
        "firstname", "lastname", "contact", "location", "age",
        "guardian_name", "guardian_contact", "email", "password"
      ].map((field) => (
        <div key={field} style={{ marginBottom: "10px" }}>
          <label>{field.replace("_", " ")}:</label><br />
          <input
            type={field === "password" ? "password" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      {/* Blood type dropdown */}
      <div style={{ marginBottom: "10px" }}>
        <label>Blood Type:</label><br />
        <select
          name="bloodtype"
          value={formData.bloodtype}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Blood Type --</option>
          {bloodTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default Registerlogin;
