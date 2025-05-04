import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import UserHome from "./pages/userhome";
import AboutUs from "./pages/aboutus";
import DoctorModule from "./pages/doctorlogin";
import Resources from "./pages/resources";
import Registerlogin from "./pages/register/userregister"; 
import Parenting from "./pages/parenting";  
import BabySection from "./pages/babysection";
import Nutrition from "./pages/nutritionsection";
import Preg from "./pages/preg";
import AdminDashboard from "./pages/admindashboard";
import AddDoctorForm from "./pages/AddDoctorform"; 

import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/userhome" replace />} />
        <Route path="/userhome" element={<UserHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/doctorlogin" element={<DoctorModule />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/userregister" element={<Registerlogin />} />
        <Route path="/parenting" element={<Parenting />} />
        <Route path="/baby" element={<BabySection />} />
        <Route path="/pregnancy" element={<Preg />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/AddDoctorform" element={<AddDoctorForm />} /> {/* ✅ This enables routing to the form */}
      </Routes>
    </Router>
  );
};

export default App;
