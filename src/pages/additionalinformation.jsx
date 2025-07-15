import React, { useState, useEffect } from "react";

const PregnancyForm = () => {
  const [formData, setFormData] = useState({
    lmc: "",
    height: "",
    weight: "",
    profession: "",
    gravida: "",
    allergies: "",
    conditions: "",
    email: "",
    notes: ""
  });
  
  // Auto-populate email from registration session
  useEffect(() => {
    const registeredEmail = localStorage.getItem("registeredEmail");
    if (registeredEmail) {
      setFormData(prev => ({
        ...prev,
        email: registeredEmail
      }));
    }
  }, []);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/pregnancy-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setError("");
        // Clean up registration email from localStorage
        localStorage.removeItem("registeredEmail");
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            lmc: "",
            height: "",
            weight: "",
            profession: "",
            gravida: "",
            allergies: "",
            conditions: "",
            email: "",
            notes: ""
          });
        }, 3000);
      } else {
        setError(data.error || "Failed to submit.");
      }
    } catch (err) {
      setError("Server error or unreachable.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Prenatal Information Form</h2>

        {submitted && <p style={styles.success}>✔️ Submitted successfully!</p>}
        {error && <p style={styles.error}>❌ {error}</p>}

        {/* Form Fields */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Last Menstrual Cycle:</label>
          <input
            type="date"
            name="lmc"
            value={formData.lmc}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Height (cm):</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Weight (kg):</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Profession:</label>
          <input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Gravida (number of pregnancies):</label>
          <input
            type="number"
            name="gravida"
            value={formData.gravida}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Allergies (if any):</label>
          <input
            type="text"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="e.g., Penicillin"
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Pre-existing Conditions:</label>
          <input
            type="text"
            name="conditions"
            value={formData.conditions}
            onChange={handleChange}
            placeholder="e.g., Diabetes, Hypertension"
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email Address:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@gmail.com"
            style={{
              ...styles.input,
              backgroundColor: formData.email ? '#f0f0f0' : '#fff',
              cursor: formData.email ? 'not-allowed' : 'text'
            }}
            readOnly={!!formData.email}
          />
          {formData.email && (
            <small style={{color: '#666', fontSize: '12px', marginTop: '4px', display: 'block'}}>
              ✓ Email auto-populated from registration
            </small>
          )}
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Notes for Doctor:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Any additional information you'd like to share"
            style={styles.textarea}
          />
        </div>

        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  container: {
    maxWidth: "700px",
    margin: "50px auto",
    padding: "20px"
  },
  form: {
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px"
  },
  fieldGroup: {
    marginBottom: "15px"
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "6px"
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "vertical"
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#3182ce",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  success: {
    color: "green",
    fontWeight: "bold",
    marginBottom: "15px"
  },
  error: {
    color: "red",
    fontWeight: "bold",
    marginBottom: "15px"
  }
};

export default PregnancyForm;
