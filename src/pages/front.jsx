import React, { useState, useEffect } from 'react';
import { Heart, Shield, Activity, Baby, Stethoscope, User, ArrowRight, Sparkles } from 'lucide-react';
import '../cssonly/front.css';
import { useNavigate } from "react-router-dom";

const Front = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "24/7 Care Support",
      description: "Round-the-clock monitoring and support for expecting mothers"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Health Records",
      description: "HIPAA-compliant secure storage of all medical information"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Real-time Tracking",
      description: "Monitor vital signs, appointments, and health metrics"
    }
  ];

  const testimonials = [
    {
      text: "Pregnify made my pregnancy journey so much easier. The doctors were always available when I needed them.",
      author: "Anusha",
      role: "User"
    },
    {
       text: "Pregnify made my pregnancy journey so much easier. The doctors were always available when I needed them.",
      author: "Anusha",
      role: "User"
    },
    {
      text: "Pregnify made my pregnancy journey so much easier. The doctors were always available when I needed them.",
      author: "Anusha",
      role: "User"
    }
  ];

  const stats = [
    { number: '3', label: 'Happy Mothers' },
    { number: '2', label: 'Healthcare Providers' },
    { number: '85.5%', label: 'Uptime' },
    { number: '12/7', label: 'Support' }
  ];

  return (
    <div className="front1">
      {/* Background Animation */}
      <div className="front2">
        <div style={{
          position: 'absolute',
          bottom: '-32px',
          left: '33.333333%',
          width: '288px',
          height: '288px',
          background: '#e9d5ff',
          borderRadius: '50%',
          opacity: 0.2,
          animation: 'pulse 2s infinite 2s'
        }}></div>
      </div>

      {/* Navigation */}
      <nav className={`front3 ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="front4">
          <div className="front5">
            <div style={{ position: 'relative' }}>
              <Baby className="w-8 h-8 text-pink-600" />
              <Sparkles className="w-4 h-4 text-yellow-400" style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                animation: 'pulse 2s infinite'
              }} />
            </div>
            <h1 className="front6">Pregnify</h1>
          </div>
          <div className="front7">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="front8">
        <div className={`front9 ${isVisible ? 'visible' : 'hidden'}`}>
          <h2 className="front10">
            Welcome to
            <span className="front11">Pregnify</span>
          </h2>
          <p className="front12">
            Your trusted companion for a healthy pregnancy journey. Connect with healthcare professionals and track your progress with confidence.
          </p>

          {/* Main Action Buttons */}
          <div className="front13">
          <button 
            className="front14"
            onClick={() => navigate("/login")}
          >
            <User className="w-6 h-6" />
            <span>Login as User</span>
            <ArrowRight className="w-5 h-5" />
          </button>
            <button className="front15">
              <Stethoscope className="w-6 h-6" />
              <span>Login as Doctor</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              className="front15"
              onClick={() => navigate("/test")}
            >
              <Stethoscope className="w-6 h-6" />
              <span>Test</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className={`front16 ${isVisible ? 'visible' : 'hidden'}`}>
          <h3 className="front17">Why Choose Pregnify?</h3>
          <div className="front18">
            {features.map((feature, index) => (
              <div key={index} className="front19">
                <div>{feature.icon}</div>
                <h4 className="front20">{feature.title}</h4>
                <p className="front21">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className={`front22 ${isVisible ? 'visible' : 'hidden'}`}>
          <h3 className="front17">What Our Users Say</h3>
          <div className="front23">
            <div className="front24">
              <p className="front25">"{testimonials[currentSlide].text}"</p>
              <div className="front26">
                <div className="front27">
                  <span>{testimonials[currentSlide].author.charAt(0)}</span>
                </div>
                <div>
                  <p className="front28">{testimonials[currentSlide].author}</p>
                  <p className="front29">{testimonials[currentSlide].role}</p>
                </div>
              </div>
            </div>
            
            {/* Carousel Indicators */}
            <div className="front30">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`front31 ${index === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`front32 ${isVisible ? 'visible' : 'hidden'}`}>
          {stats.map((stat, index) => (
            <div key={index} className="front33">
              <div className="front34">{stat.number}</div>
              <div className="front35">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className={`front36 ${isVisible ? 'visible' : 'hidden'}`}>
          <p className="front37">© 2025 Pregnify. All rights reserved.</p>
          <div className="front38">
            {/* Footer links here if needed */}
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Front;