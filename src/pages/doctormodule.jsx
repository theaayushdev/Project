import React from "react";
import "../cssonly/doctorhome.css";

const DoctorModule = () => {
  return (
    <div className="doctor-dashboard">
      <h2>Welcome, Doctor 👨‍⚕️</h2>
      <p className="subtext">Manage your patients and track their pregnancy journey.</p>
      <div className="doctor-cards">
        <div className="card-item">
          <h3>Patients</h3>
          <p>View list of pregnant patients and their profiles.</p>
        </div>
        <div className="card-item">
          <h3>Reports</h3>
          <p>Write and review diagnostic or health progress reports.</p>
        </div>
        <div className="card-item">
          <h3>Appointments</h3>
          <p>See upcoming and completed appointments.</p>
        </div>
        <div className="card-item">
          <h3>Health Stats</h3>
          <p>Monitor sleep, nutrition, weight & water intake logs.</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorModule;
