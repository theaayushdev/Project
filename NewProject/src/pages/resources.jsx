import { Link, useNavigate } from "react-router-dom";
import "../cssonly/resources.css";

function Resources() {
  return (
    <>
    <Navbar/>
    <>
   
    
    <div className="resource-container">
      <header className="resource-header">

      <h2 className="resource-title">Hey beautiful Moms</h2>
        <p className="resource-description">
          Expecting a baby? We'll guide you through every step of this beautiful journey, 
          from finding out you're pregnant to holding your little one for the first time.
        </p>
      </header>

      <section className="resources-section">
        <h3 className="resources-subtitle">Read these articles</h3>
        <p className="resource-description">
        Maintaining a healthy lifestyle during pregnancy is essential for both you and your developing baby. Here are some reputable resources offering comprehensive information on various aspects of pregnancy, including nutrition, prenatal care, and overall well-being
        </p>
      <div class="container">
      <a href="#" class="button type--C">
        <div class="button__line"></div>
        <div class="button__line"></div>
        <span class="button__text">Check this link</span>
        <div class="button__drow1"></div>
        <div class="button__drow2"></div>
      </a>
     </div>
        <ul className="resource-links">
          <li><a href="https://my.clevelandclinic.org/health/articles/9699-first-trimester" target="_blank" rel="noopener noreferrer">Understanding the First Trimester</a></li>
          <li><a href="https://www.babycenter.com/baby/solids-finger-foods/age-by-age-guide-to-feeding-your-baby_1400680" target="_blank" rel="noopener noreferrer">Healthy Diet Tips for Expecting Mothers</a></li>
      
        </ul>
      </section>
      <section>

      </section>
    </div>
    </>
    </>
  );
}
function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-list left">
        <li><Link to="/userhome">Home</Link></li>
      </ul>
      <ul className="nav-list right">
        <li>Profile</li>
      </ul>
    </nav>
  );
}






export default Resources;
