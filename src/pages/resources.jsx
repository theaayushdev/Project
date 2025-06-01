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
    <>
      <style>
        {`
          .navs1 {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 15px 30px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 50px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
            margin: 20px auto;
            min-width: 300px;
            width: fit-content;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          
          .navs2, .navs6 {
            display: flex;
            align-items: center;
          }
          
          .navs3, .navs7 {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 20px;
          }
          
          .navs4, .navs8 {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .navs5, .navs9 {
            color: #374151;
            text-decoration: none;
            font-size: 16px;
            font-weight: 500;
            padding: 12px 20px;
            border-radius: 25px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          
          .navs5:hover, .navs9:hover {
            color: #f59e0b;
            background: rgba(245, 158, 11, 0.1);
            transform: translateY(-2px);
          }
        `}
      </style>
      <nav className="navs1">
        <div className="navs2">
          <ul className="navs3">
            <li className="navs4">
              <Link to="/userhome" className="navs5">🏠 Home</Link>
            </li>
            <li className="navs8">
              <Link to="/doctor" className="navs9">👨‍⚕️ Doctor</Link>
            </li>
            <li className="navs8">
              <Link to="/resources" className="navs9">📚 Resources</Link>
            </li>
            <li className="navs8">
              <Link to="/profile" className="navs9">👤 Profile</Link>
            </li>
            <li className="navs8">
              <Link to="/logout" className="navs9">🚪 Logout</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}







export default Resources;
