import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import UserLogin from "./pages/UserLogin";
import UserHome from "./pages/userhome";
import AboutUs from "./pages/aboutus";
import DoctorLogin from "./pages/login/doctorlogin";
import Resources from "./pages/resources";
import Registerlogin from "./pages/register/userregister"; 
import Parenting from "./pages/parenting";  
import BabySection from "./pages/babysection";
import Nutrition from "./pages/nutritionsection";
import Preg from "./pages/preg";
import AdminDashboard from "./pages/admindashboard";
import AddDoctorForm from "./pages/AddDoctorform"; 
import DoctorDashboardApp from "./pages/doctordashboard";
import MoodTracker from "./pages/moodtracker";
import HydrationTracker from "./pages/hydration";
import PregnancyDashboard from "./pages/pregnancydashboard";
import ArticleDetail from "./pages/ArticleDetail";
import DueDateCalculator from "./pages/duedatecalc";
import AppointmentForm from './pages/appointment';
import Removedoctor from './pages/removedoctor';
import PregnancyForm from "./pages/additionalinformation";
import Front from "./pages/front";
import AdminLogin from './pages/login/adminlogin';
import Top from "./pages/userhome"; // <-- import your Top component
import Messaging from './pages/messaging'; // <-- import messaging component
import ReportsPage from "./pages/reports";
import UserMessagingPage from "./pages/user_messaging";
import HealthTrackerWorking from "./components/HealthTrackerWorking";

import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Front />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/doctorlogin" element={<DoctorLogin />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/userregister" element={<Registerlogin />} />
        <Route path="/parenting" element={<Parenting />} />
        <Route path="/baby" element={<BabySection />} />
        <Route path="/pregnancy" element={<Preg />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/AddDoctorform" element={<AddDoctorForm />} /> 
        <Route path="/doctordashboard" element={<DoctorDashboardApp />} />
        <Route path="/pregnancydashboard" element={<PregnancyDashboard />} />
        <Route path="/article-detail" element={<ArticleDetail />} />
        <Route path="/appointment" element={<AppointmentForm />} />
        <Route path="/mood" element={<MoodTracker />} /> 
        <Route path="/additionalinformation" element={<PregnancyForm />} />
        <Route path="/hydration" element={<HydrationTracker />} />
        <Route path="/duedatecalc" element={<DueDateCalculator />} />
        <Route path="/removedoctor" element={<Removedoctor />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/test" element={<Top />} /> {/* <-- test route */}
        <Route path="/user-messaging" element={<UserMessagingPage />} />
        <Route path="/health-tracker" element={<HealthTrackerWorking />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;