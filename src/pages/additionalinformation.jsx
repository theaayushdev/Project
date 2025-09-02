import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PregnancyForm = () => {
  const navigate = useNavigate();
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

    const newErrors = {};

    // Validate height
    if (!formData.height.trim()) {
      newErrors.height = "Height is required";
    } else if (isNaN(formData.height)) {
      newErrors.height = "Please enter a valid number";
    } else {
      const height = parseFloat(formData.height);
      if (height <= 0) {
        newErrors.height = "Height must be greater than 0";
      } else if (height < 100 || height > 300) {
        newErrors.height = "Height must be between 100 and 300 cm";
      }
    }

    // Validate weight
    if (!formData.weight.trim()) {
      newErrors.weight = "Weight is required";
    } else if (isNaN(formData.weight)) {
      newErrors.weight = "Please enter a valid number";
    } else {
      const weight = parseFloat(formData.weight);
      if (weight <= 0) {
        newErrors.weight = "Weight must be greater than 0";
      } else if (weight < 30 || weight > 300) {
        newErrors.weight = "Weight must be between 30 and 300 kg";
      }
    }

    // Validate LMC date
    const selectedDate = new Date(formData.lmc);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!formData.lmc) {
      newErrors.lmc = "Last menstrual cycle is required";
    } else if (selectedDate > today) {
      newErrors.lmc = "LMC cannot be a future date";
    }

    // Validate profession
    if (!formData.profession.trim()) {
      newErrors.profession = "Profession is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.profession)) {
      newErrors.profession = "Profession must contain only letters";
    }

    // Validate allergies
    if (formData.allergies && !/^[A-Za-z\s,]+$/.test(formData.allergies)) {
      newErrors.allergies = "Allergies must be text only";
    }

    // Validate conditions
    if (formData.conditions && !/^[A-Za-z\s,]+$/.test(formData.conditions)) {
      newErrors.conditions = "Conditions must be text only";
    }

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      setError(firstError);
      return;
    }

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
        localStorage.removeItem("registeredEmail");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || "Failed to submit.");
      }
    } catch (err) {
      setError("Server error or unreachable.");
    }
  };

  const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Prenatal Information Form</h2>

        {submitted && <p style={styles.success}>✔️ Submitted successfully!</p>}
        {error && <p style={styles.error}>❌ {error}</p>}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Last Menstrual Cycle:</label>
          <input
            type="date"
            name="lmc"
            value={formData.lmc}
            onChange={handleChange}
            required
            max={todayDate}
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
