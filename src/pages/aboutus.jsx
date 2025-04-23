import React from "react";
import "../cssonly/aboutus.css";

import { FaCalendarCheck, FaClipboardList, FaUserMd, FaFileMedical } from "react-icons/fa";
import { MdLocalPharmacy, MdOutlineLocalHospital, MdOutlineAccessibilityNew, MdHotel } from "react-icons/md";

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <div className="about-section">
          <FaCalendarCheck className="icon" />
          <h3>Make an appointment</h3>
          <p>Lorem ipsum dolor sit amet, nec te mollis utroque honestatis.</p>
        </div>
        <div className="about-section">
          <FaClipboardList className="icon" />
          <h3>Choose your package</h3>
          <p>Lorem ipsum dolor sit amet, nec te mollis utroque honestatis.</p>
        </div>
        <div className="about-section">
          <FaUserMd className="icon" />
          <h3>Help by specialist</h3>
          <p>Lorem ipsum dolor sit amet, nec te mollis utroque honestatis.</p>
        </div>
        <div className="about-section">
          <FaFileMedical className="icon" />
          <h3>Get diagnostic report</h3>
          <p>Lorem ipsum dolor sit amet, nec te mollis utroque honestatis.</p>
        </div>
      </div>

      <div className="about-services">
        <div className="service">
          <MdOutlineLocalHospital className="service-icon" />
          <h4>Medical Checkup</h4>
          <p>Vestibulum tincidunt enim in pharetra malesuada.</p>
        </div>
        <div className="service">
          <MdOutlineAccessibilityNew className="service-icon" />
          <h4>Nursing Services</h4>
          <p>Vestibulum tincidunt enim in pharetra malesuada.</p>
        </div>
        <div className="service">
          <MdLocalPharmacy className="service-icon" />
          <h4>Pharmacy</h4>
          <p>Vestibulum tincidunt enim in pharetra malesuada.</p>
        </div>
        <div className="service">
          <MdHotel className="service-icon" />
          <h4>Sleep Center</h4>
          <p>Vestibulum tincidunt enim in pharetra malesuada.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
