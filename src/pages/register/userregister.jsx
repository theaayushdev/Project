import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registerlogin = () => {
  const navigate = useNavigate();
  
  // Form state
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
    password: "",
    confirmPassword: ""
  });

  // Form validation state
  const [errors, setErrors] = useState({});
  
  // UI feedback state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Name validations
    if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
    
    // Contact validation - simple phone format
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10,15}$/.test(formData.contact.replace(/[-()\s]/g, ''))) {
      newErrors.contact = "Please enter a valid phone number";
    }
    
    // Location validation
    if (!formData.location.trim()) newErrors.location = "Location is required";
    
    // Age validation
    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else if (isNaN(formData.age) || parseInt(formData.age) <= 0) {
      newErrors.age = "Please enter a valid age";
    }
    
    // Guardian validations
    if (!formData.guardian_name.trim()) newErrors.guardian_name = "Guardian name is required";
    if (!formData.guardian_contact.trim()) {
      newErrors.guardian_contact = "Guardian contact is required";
    } else if (!/^\d{10,15}$/.test(formData.guardian_contact.replace(/[-()\s]/g, ''))) {
      newErrors.guardian_contact = "Please enter a valid phone number";
    }
    
    // Blood type validation
    if (!formData.bloodtype.trim()) {
      newErrors.bloodtype = "Blood type is required";
    } else if (!/^(A|B|AB|O)[+-]$/.test(formData.bloodtype.toUpperCase())) {
      newErrors.bloodtype = "Please enter a valid blood type (A+, B-, AB+, O-, etc.)";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });
    
    // Create a copy of formData without confirmPassword for API submission
    const submissionData = { ...formData };
    delete submissionData.confirmPassword;
    
    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage({ text: data.message || "Registration successful!", type: "success" });
        // Delay navigation to show success message
        setTimeout(() => navigate("/additionalinformation"), 1500);
      } else {
        setMessage({ text: data.error || "Registration failed", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Network error or server is unreachable.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">Create Your Account</h1>
        <p className="form-subtitle">Please fill in all the required information</p>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === "success" ? "✅ " : "⚠️ "}
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Personal Information Section */}
            <div className="form-section">
              <h2 className="section-title">Personal Information</h2>
              
              <div className="input-row">
                <div className="form-group">
                  <label htmlFor="firstname">First Name</label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className={errors.firstname ? "error" : ""}
                  />
                  {errors.firstname && <span className="error-text">{errors.firstname}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className={errors.lastname ? "error" : ""}
                  />
                  {errors.lastname && <span className="error-text">{errors.lastname}</span>}
                </div>
              </div>
              
              <div className="input-row">
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={errors.age ? "error" : ""}
                  />
                  {errors.age && <span className="error-text">{errors.age}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="bloodtype">Blood Type</label>
                  <select
                    id="bloodtype"
                    name="bloodtype"
                    value={formData.bloodtype}
                    onChange={handleChange}
                    className={errors.bloodtype ? "error" : ""}
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  {errors.bloodtype && <span className="error-text">{errors.bloodtype}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Address</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={errors.location ? "error" : ""}
                />
                {errors.location && <span className="error-text">{errors.location}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="contact">Contact Number</label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g. 1234567890"
                  className={errors.contact ? "error" : ""}
                />
                {errors.contact && <span className="error-text">{errors.contact}</span>}
              </div>
            </div>
            
            {/* Guardian Information Section */}
            <div className="form-section">
              <h2 className="section-title">Guardian Information</h2>
              
              <div className="form-group">
                <label htmlFor="guardian_name">Guardian Full Name</label>
                <input
                  type="text"
                  id="guardian_name"
                  name="guardian_name"
                  value={formData.guardian_name}
                  onChange={handleChange}
                  className={errors.guardian_name ? "error" : ""}
                />
                {errors.guardian_name && <span className="error-text">{errors.guardian_name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="guardian_contact">Guardian Contact</label>
                <input
                  type="tel"
                  id="guardian_contact"
                  name="guardian_contact"
                  value={formData.guardian_contact}
                  onChange={handleChange}
                  placeholder="e.g. 1234567890"
                  className={errors.guardian_contact ? "error" : ""}
                />
                {errors.guardian_contact && <span className="error-text">{errors.guardian_contact}</span>}
              </div>
            </div>
            
            {/* Account Information Section */}
            <div className="form-section">
              <h2 className="section-title">Account Information</h2>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Create Account"}
            </button>
            
            <p className="login-link">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        /* General Reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        /* Form Container */
        .form-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        /* Form Card */
        .form-card {
          width: 100%;
          max-width: 1000px;
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        /* Form Title and Subtitle */
        .form-title {
          font-size: 28px;
          color: #2c3e50;
          margin-bottom: 8px;
          text-align: center;
        }
        
        .form-subtitle {
          color: #7f8c8d;
          text-align: center;
          margin-bottom: 30px;
        }
        
        /* Form Grid Layout */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }
        
        @media (min-width: 768px) {
          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .form-section:last-child {
            grid-column: span 2;
          }
        }
        
        /* Form Sections */
        .form-section {
          margin-bottom: 20px;
        }
        
        .section-title {
          font-size: 18px;
          color: #3498db;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #ecf0f1;
        }
        
        /* Input Row (for side-by-side fields) */
        .input-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
        }
        
        @media (min-width: 576px) {
          .input-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        /* Form Group */
        .form-group {
          margin-bottom: 20px;
        }
        
        /* Labels */
        label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #2c3e50;
          font-size: 14px;
        }
        
        /* Form Inputs */
        input, select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #dce4ec;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        
        input:focus, select:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }
        
        input.error, select.error {
          border-color: #e74c3c;
        }
        
        input.error:focus, select.error:focus {
          box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
        }
        
        /* Error Text */
        .error-text {
          display: block;
          color: #e74c3c;
          font-size: 12px;
          margin-top: 5px;
        }
        
        /* Form Actions */
        .form-actions {
          text-align: center;
          margin-top: 30px;
        }
        
        /* Submit Button */
        .submit-button {
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px 30px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
          width: 100%;
          max-width: 400px;
        }
        
        .submit-button:hover {
          background-color: #2980b9;
        }
        
        .submit-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        
        /* Login Link */
        .login-link {
          margin-top: 20px;
          color: #7f8c8d;
        }
        
        .login-link a {
          color: #3498db;
          text-decoration: none;
          font-weight: 500;
        }
        
        .login-link a:hover {
          text-decoration: underline;
        }
        
        /* Message Styling */
        .message {
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          font-weight: 500;
          text-align: center;
        }
        
        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      `}</style>
    </div>
  );
};

export default Registerlogin;