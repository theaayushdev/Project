import React, { useEffect, useState } from "react";
import UserNavbar from "./Usernavbar"; // Top navigation bar for user
import UserSidebar from "./usersidebar"; // Sidebar navigation for user
import ChatModal from "../components/Chat/ChatModal"; // Chat modal component
import { Calendar, Heart, Baby, Droplets, Moon, Weight, Activity, Plus, ChevronRight, Star, Target, Users, BookOpen, ArrowLeft } from "lucide-react";
import "../cssonly/pregnancydashboard.css";
import { useLocation, useNavigate } from 'react-router-dom';

function getPregnancyWeek(lmc) {
  if (!lmc) return null;
  const lmcDate = new Date(lmc);
  const now = new Date();
  const diff = now - lmcDate;
  const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  return week > 0 ? week : 0;
}

function getDueDate(lmc) {
  if (!lmc) return null;
  const lmcDate = new Date(lmc);
  const dueDate = new Date(lmcDate.getTime() + 280 * 24 * 60 * 60 * 1000); // 40 weeks
  return dueDate.toLocaleDateString();
}

const babySizes = [
  "Poppy seed", "Sesame seed", "Lentil", "Blueberry", "Kidney bean", "Grape", "Kumquat", "Fig", "Lime", "Plum", "Peach", "Lemon", "Apple", "Avocado", "Onion", "Sweet potato", "Mango", "Banana", "Pomegranate", "Papaya", "Grapefruit", "Cantaloupe", "Cauliflower", "Eggplant", "Romaine lettuce", "Cabbage", "Butternut squash", "Coconut", "Pineapple", "Pumpkin", "Watermelon"
];

function getBabySize(week) {
  if (!week || week < 1) return "Unknown";
  if (week > 40) week = 40;
  return babySizes[week - 1] || "Baby";
}

function UserPregnancyDashboard() {
  const [user, setUser] = useState(null);
  const [pregnancyInfo, setPregnancyInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [waterIntake, setWaterIntake] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [dailySteps, setDailySteps] = useState(6432);
  const [heartRate, setHeartRate] = useState(78);
  const [doctors, setDoctors] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const section = searchParams.get('section');

  // Pregnancy articles data - Real medical sources
  const pregnancyArticles = [
    {
      id: 1,
      title: "Nutrition During Pregnancy: What to Eat",
      category: "Nutrition",
      readTime: "8 min read",
      date: "Updated Daily",
      excerpt: "Official CDC guidelines on healthy eating during pregnancy, including foods to eat and avoid.",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=250&fit=crop",
      url: "https://www.cdc.gov/pregnancy/during/nutrition.html",
      source: "CDC - Centers for Disease Control",
      tags: ["nutrition", "health", "diet", "prenatal"],
      featured: true
    },
    {
      id: 2,
      title: "First Trimester: What to Expect",
      category: "Pregnancy Stages",
      readTime: "10 min read",
      date: "Updated Daily",
      excerpt: "Mayo Clinic's comprehensive guide to first trimester symptoms, development, and care.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      url: "https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/pregnancy/art-20047208",
      source: "Mayo Clinic",
      tags: ["first trimester", "symptoms", "development"],
      featured: true
    },
    {
      id: 3,
      title: "Exercise During Pregnancy",
      category: "Fitness",
      readTime: "7 min read",
      date: "Updated Daily",
      excerpt: "ACOG's official guidelines for safe exercise and physical activity during pregnancy.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
      url: "https://www.acog.org/womens-health/faqs/exercise-during-pregnancy",
      source: "ACOG - American College of Obstetricians and Gynecologists",
      tags: ["exercise", "fitness", "prenatal yoga", "health"],
      featured: false
    },
    {
      id: 4,
      title: "Prenatal Vitamins: Complete Guide",
      category: "Health",
      readTime: "6 min read",
      date: "Updated Daily",
      excerpt: "WebMD's expert guide to prenatal vitamins, including what to look for and when to start.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=250&fit=crop",
      url: "https://www.webmd.com/baby/guide/prenatal-vitamins",
      source: "WebMD",
      tags: ["prenatal vitamins", "supplements", "health", "nutrition"],
      featured: false
    },
    {
      id: 5,
      title: "Second Trimester Changes and Care",
      category: "Pregnancy Stages",
      readTime: "9 min read",
      date: "Updated Daily",
      excerpt: "Cleveland Clinic's detailed overview of second trimester development and maternal changes.",
      image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=250&fit=crop",
      url: "https://my.clevelandclinic.org/health/articles/7247-pregnancy-2nd-trimester",
      source: "Cleveland Clinic",
      tags: ["second trimester", "development", "energy", "movements"],
      featured: true
    },
    {
      id: 6,
      title: "Managing Pregnancy Discomforts",
      category: "Wellness",
      readTime: "8 min read",
      date: "Updated Daily",
      excerpt: "Harvard Health's evidence-based approaches to common pregnancy symptoms and discomforts.",
      image: "https://images.unsplash.com/photo-1506629905496-517de62ad72b?w=400&h=250&fit=crop",
      url: "https://www.health.harvard.edu/womens-health/managing-common-pregnancy-discomforts",
      source: "Harvard Health Publishing",
      tags: ["discomfort", "natural remedies", "wellness", "relief"],
      featured: false
    },
    {
      id: 7,
      title: "Labor and Delivery: What to Expect",
      category: "Labor & Delivery",
      readTime: "12 min read",
      date: "Updated Daily",
      excerpt: "Johns Hopkins Medicine comprehensive guide to labor stages, delivery, and pain management.",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=250&fit=crop",
      url: "https://www.hopkinsmedicine.org/health/wellness-and-prevention/labor-and-delivery",
      source: "Johns Hopkins Medicine",
      tags: ["labor", "delivery", "birth plan", "pain management"],
      featured: true
    },
    {
      id: 8,
      title: "Third Trimester: Final Preparations",
      category: "Pregnancy Stages",
      readTime: "10 min read",
      date: "Updated Daily",
      excerpt: "Stanford Medicine's guide to third trimester changes, preparations, and warning signs.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
      url: "https://stanfordhealthcare.org/medical-conditions/womens-health/pregnancy/third-trimester.html",
      source: "Stanford Medicine",
      tags: ["third trimester", "preparation", "contractions", "nursery"],
      featured: false
    },
    {
      id: 9,
      title: "Breastfeeding: Getting Started",
      category: "Postpartum",
      readTime: "11 min read",
      date: "Updated Daily",
      excerpt: "La Leche League's expert guide to successful breastfeeding initiation and techniques.",
      image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=250&fit=crop",
      url: "https://www.llli.org/breastfeeding-info/getting-started/",
      source: "La Leche League International",
      tags: ["breastfeeding", "newborn", "nutrition", "postpartum"],
      featured: false
    },
    {
      id: 10,
      title: "Mental Health During Pregnancy",
      category: "Mental Health",
      readTime: "9 min read",
      date: "Updated Daily",
      excerpt: "NIMH's comprehensive resource on perinatal mental health and support options.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      url: "https://www.nimh.nih.gov/health/publications/perinatal-depression",
      source: "National Institute of Mental Health",
      tags: ["mental health", "self-care", "support", "emotional wellness"],
      featured: true
    },
    {
      id: 11,
      title: "Early Pregnancy Signs and Testing",
      category: "Early Pregnancy",
      readTime: "7 min read",
      date: "Updated Daily",
      excerpt: "Planned Parenthood's factual guide to pregnancy signs, testing, and early care options.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      url: "https://www.plannedparenthood.org/learn/pregnancy/pregnancy-tests",
      source: "Planned Parenthood",
      tags: ["pregnancy tests", "early signs", "hCG", "symptoms"],
      featured: false
    },
    {
      id: 12,
      title: "Fetal Development Week by Week",
      category: "Fetal Development",
      readTime: "15 min read",
      date: "Updated Daily",
      excerpt: "BabyCenter's medically reviewed week-by-week fetal development guide.",
      image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&h=250&fit=crop",
      url: "https://www.babycenter.com/pregnancy/week-by-week",
      source: "BabyCenter Medical Advisory Board",
      tags: ["fetal development", "milestones", "growth", "baby"],
      featured: true
    },
    {
      id: 13,
      title: "Prenatal Care and Checkups",
      category: "Health",
      readTime: "8 min read",
      date: "Updated Daily",
      excerpt: "ACOG's official guidelines for prenatal care schedule and important tests.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
      url: "https://www.acog.org/womens-health/faqs/prenatal-care",
      source: "ACOG",
      tags: ["prenatal care", "checkups", "tests", "screening"],
      featured: false
    },
    {
      id: 14,
      title: "High-Risk Pregnancy Management",
      category: "Health",
      readTime: "10 min read",
      date: "Updated Daily",
      excerpt: "March of Dimes comprehensive guide to high-risk pregnancy factors and management.",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop",
      url: "https://www.marchofdimes.org/complications/high-risk-pregnancy.aspx",
      source: "March of Dimes",
      tags: ["high-risk", "complications", "management", "care"],
      featured: false
    },
    {
      id: 15,
      title: "Postpartum Recovery Guide",
      category: "Postpartum",
      readTime: "12 min read",
      date: "Updated Daily",
      excerpt: "American Pregnancy Association's complete guide to postpartum recovery and self-care.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      url: "https://americanpregnancy.org/healthy-pregnancy/postpartum-recovery/",
      source: "American Pregnancy Association",
      tags: ["postpartum", "recovery", "healing", "self-care"],
      featured: true
    }
  ];

  // Static fallback doctors data (used when API fails)
  const staticDoctors = [
    {
      id: 1,
      firstname: "Sarah",
      lastname: "Johnson",
      age: 42,
      years_of_experience: 15,
      specialty: "Obstetrician",
      profile_photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      department: "Maternity"
    },
    {
      id: 2,
      firstname: "Michael",
      lastname: "Chen",
      age: 38,
      years_of_experience: 12,
      specialty: "Gynecologist",
      profile_photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      department: "Women's Health"
    },
    {
      id: 3,
      firstname: "Emily",
      lastname: "Rodriguez",
      age: 35,
      years_of_experience: 10,
      specialty: "Maternal-Fetal Medicine",
      profile_photo: "https://images.unsplash.com/photo-1594824475180-29c1d1d4d2d8?w=150&h=150&fit=crop&crop=face",
      department: "High-Risk Pregnancy"
    },
    {
      id: 4,
      firstname: "David",
      lastname: "Wilson",
      age: 45,
      years_of_experience: 18,
      specialty: "Perinatologist",
      profile_photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
      department: "Fetal Medicine"
    }
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      const email = localStorage.getItem("userEmail");
      
      if (!email) {
        setError("Please log in to access your dashboard.");
        setLoading(false);
        return;
      }
      
      try {
        // Fetch dashboard data
        const res = await fetch(`http://127.0.0.1:5000/user/dashboard?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch dashboard data");
        setUser(data.user);
        setPregnancyInfo(data.pregnancy);
        setAppointments(data.appointments || []);

        // Fetch doctors data
        try {
          const doctorsRes = await fetch('http://127.0.0.1:5000/doctors');
          const doctorsData = await doctorsRes.json();
          if (doctorsRes.ok) {
            setDoctors(doctorsData);
          } else {
            console.log("Failed to fetch doctors, using static data");
            setDoctors(staticDoctors);
          }
        } catch (doctorsError) {
          console.log("Error fetching doctors, using static data:", doctorsError);
          setDoctors(staticDoctors);
        }
      } catch (err) {
        setError(err.message);
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  let week = pregnancyInfo && pregnancyInfo.lmc ? getPregnancyWeek(pregnancyInfo.lmc) : null;
  let dueDate = pregnancyInfo && pregnancyInfo.lmc ? getDueDate(pregnancyInfo.lmc) : null;
  let babySize = getBabySize(week);

  // Calculate trimester
  let trimester = null;
  if (week !== null) {
    if (week < 13) trimester = '1st Trimester';
    else if (week < 27) trimester = '2nd Trimester';
    else trimester = '3rd Trimester';
  }

  const healthStats = [
    { 
      title: "Weight", 
      value: pregnancyInfo ? `${pregnancyInfo.weight} kg` : "-",
      icon: Weight, 
      color: "#FF6B6B",
      change: pregnancyInfo ? `Current` : "-",
      trend: "up"
    },
    { 
      title: "Height", 
      value: pregnancyInfo && pregnancyInfo.height ? `${pregnancyInfo.height} cm` : "-",
      icon: Activity, // You can choose a more appropriate icon if available
      color: "#4ECDC4",
      change: pregnancyInfo && pregnancyInfo.height ? "Recorded" : "-",
      trend: "neutral"
    },
    { 
      title: "LMC", 
      value: pregnancyInfo && pregnancyInfo.lmc ? new Date(pregnancyInfo.lmc).toLocaleDateString() : "-",
      icon: Calendar,
      color: "#A78BFA",
      change: pregnancyInfo && pregnancyInfo.lmc ? "Last Menstrual Cycle" : "-",
      trend: "neutral"
    },
    { 
      title: "Gravida Number", 
      value: pregnancyInfo && pregnancyInfo.gravida ? pregnancyInfo.gravida : "-",
      icon: Baby,
      color: "#F59E0B",
      change: pregnancyInfo && pregnancyInfo.gravida ? "Recorded" : "-",
      trend: "neutral"
    }
  ];

  const tips = [
    {
      icon: "💧",
      title: "Stay Hydrated",
      content: "Drink at least 8-10 glasses of water daily to support your baby's development."
    },
    {
      icon: "🥗",
      title: "Eat Well",
      content: "Focus on nutrient-rich foods like leafy greens, lean proteins, and whole grains."
    },
    {
      icon: "🚶‍♀️",
      title: "Stay Active",
      content: "Gentle exercise like walking or prenatal yoga can help with energy and mood."
    }
  ];

  if (loading) {
    return (
      <div className="pregnancy-dashboard-container">
        <div className="pregnancy-dashboard-layout">
          <UserSidebar />
          <div className="pregnancy-dashboard-content">
            <div className="pregnancy-widget">
              <p>Loading your pregnancy dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pregnancy-dashboard-container">
        <div className="pregnancy-dashboard-layout">
          <UserSidebar />
          <div className="pregnancy-dashboard-content">
            <div className="pregnancy-widget">
              <p>Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render doctors section if requested
  if (section === 'doctors') {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
        <UserSidebar 
        week={week} 
        trimester={trimester} 
        activeTab="doctors" 
        onChatOpen={() => setIsChatOpen(true)}
      />
        <div style={{ flex: 1, marginLeft: 240, padding: "32px 40px" }}>
          <UserNavbar user={user} />
          
          <div className="pregnancy-dashboard-header">
            <div className="pregnancy-header-content">
              <div className="pregnancy-welcome-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <button 
                    onClick={() => window.location.href = '/pregnancydashboard'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#5a67d8'}
                    onMouseOut={(e) => e.target.style.background = '#667eea'}
                  >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                  </button>
                </div>
                <h1>Our Medical Team</h1>
                <p className="pregnancy-due-date">Expert healthcare professionals dedicated to your care</p>
              </div>
            </div>
          </div>

          <div className="pregnancy-doctors-section">
            <div className="pregnancy-widget" style={{ gridColumn: 'span 3' }}>
              <div className="pregnancy-widget-header">
                <h3 className="pregnancy-widget-title">Available Doctors</h3>
                <div className="pregnancy-widget-icon" style={{ backgroundColor: "#10B981" }}>
                  <Users size={20} />
                </div>
              </div>
              <div className="pregnancy-doctors-grid">
                {doctors.map((doctor) => {
                  // Handle both API data and static fallback data
                  const doctorName = doctor.name || `Dr. ${doctor.firstname} ${doctor.lastname}`;
                  const doctorAge = doctor.age;
                  const doctorExperience = doctor.years_of_experience || doctor.yearsOfExperience;
                  const doctorPhoto = doctor.profile_photo || doctor.profilePhoto || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face";
                  const doctorEmail = doctor.email;
                  const doctorPhone = doctor.phone_number;

                  return (
                    <div key={doctor.id} className="pregnancy-doctor-card">
                      <div className="pregnancy-doctor-header">
                        <div className="pregnancy-doctor-photo-container">
                          <img 
                            src={doctorPhoto} 
                            alt={doctorName}
                            className="pregnancy-doctor-photo"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face";
                            }}
                          />
                        </div>
                      </div>
                      <div className="pregnancy-doctor-info">
                        <h4 className="pregnancy-doctor-name">{doctorName}</h4>
                        <p className="pregnancy-doctor-specialty">{doctor.specialty}</p>
                        <p className="pregnancy-doctor-department">{doctor.department}</p>
                        
                        <div className="pregnancy-doctor-details">
                          <div className="pregnancy-doctor-detail">
                            <span className="pregnancy-doctor-label">Age:</span>
                            <span className="pregnancy-doctor-value">{doctorAge || 'N/A'}</span>
                          </div>
                          <div className="pregnancy-doctor-detail">
                            <span className="pregnancy-doctor-label">Experience:</span>
                            <span className="pregnancy-doctor-value">{doctorExperience ? `${doctorExperience} years` : 'N/A'}</span>
                          </div>
                          <div className="pregnancy-doctor-detail">
                            <span className="pregnancy-doctor-label">Phone:</span>
                            <span className="pregnancy-doctor-value">{doctorPhone || 'N/A'}</span>
                          </div>
                          <div className="pregnancy-doctor-detail">
                            <span className="pregnancy-doctor-label">Email:</span>
                            <span className="pregnancy-doctor-value" title={doctorEmail}>
                              {doctorEmail ? (doctorEmail.length > 20 ? doctorEmail.substring(0, 20) + '...' : doctorEmail) : 'N/A'}
                            </span>
                          </div>
                        </div>
                        
                        <button 
                          className="pregnancy-doctor-book-btn"
                          onClick={() => window.location.href = `/appointment?doctorId=${doctor.id}&doctorName=${encodeURIComponent(doctorName)}`}
                        >
                          <Calendar size={16} />
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render articles section if requested
  if (section === 'articles') {
    const categories = ['All', 'Nutrition', 'Pregnancy Stages', 'Fitness', 'Health', 'Wellness', 'Labor & Delivery', 'Postpartum', 'Mental Health', 'Early Pregnancy', 'Fetal Development'];

    const filteredArticles = pregnancyArticles.filter(article => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    const featuredArticles = pregnancyArticles.filter(article => article.featured);

    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
        <UserSidebar 
          week={week} 
          trimester={trimester} 
          activeTab="articles" 
          onChatOpen={() => setIsChatOpen(true)}
        />
        <div style={{ flex: 1, marginLeft: 240, padding: "32px 40px" }}>
          <UserNavbar user={user} />
          
          <div className="pregnancy-dashboard-header">
            <div className="pregnancy-header-content">
              <div className="pregnancy-welcome-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <button 
                    onClick={() => window.location.href = '/pregnancydashboard'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#5a67d8'}
                    onMouseOut={(e) => e.target.style.background = '#667eea'}
                  >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                  </button>
                </div>
                <h1>Pregnancy & Health Articles</h1>
                <p className="pregnancy-due-date">Expert advice from trusted medical sources like CDC, Mayo Clinic, ACOG, and more</p>
                <div className="trusted-sources-badge">
                  <span className="badge-icon">🏥</span>
                  <span className="badge-text">100% Medically Reviewed Content</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="articles-filter-section">
            <div className="articles-search-container">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="articles-search-input"
              />
            </div>
            <div className="articles-categories">
              {categories.map(category => (
                <button
                  key={category}
                  className={`articles-category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Articles Section */}
          {selectedCategory === 'All' && !searchTerm && (
            <div className="articles-featured-section">
              <h2 className="articles-section-title">Featured Articles</h2>
              <div className="articles-featured-grid">
                {featuredArticles.slice(0, 3).map(article => (
                  <div 
                    key={article.id} 
                    className="articles-featured-card"
                    onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="articles-featured-image">
                      <img src={article.image} alt={article.title} />
                      <div className="articles-featured-badge">Featured</div>
                    </div>
                    <div className="articles-featured-content">
                      <div className="articles-featured-meta">
                        <span className="articles-category">{article.category}</span>
                        <span className="articles-read-time">{article.readTime}</span>
                      </div>
                      <h3 className="articles-featured-title">{article.title}</h3>
                      <p className="articles-featured-excerpt">{article.excerpt}</p>
                      <div className="articles-source">
                        <span className="source-label">Source:</span>
                        <span className="source-name">{article.source}</span>
                        <span className="external-link-icon">🔗</span>
                      </div>
                      <div className="articles-featured-footer">
                        <span className="articles-date">{article.date}</span>
                        <button 
                          className="articles-read-more"
                          onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
                        >
                          Read on {article.source.split(' - ')[0]} ↗
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Articles Section */}
          <div className="articles-main-section">
            <h2 className="articles-section-title">
              {selectedCategory === 'All' ? 'All Articles' : `${selectedCategory} Articles`}
              <span className="articles-count">({filteredArticles.length})</span>
            </h2>
            <div className="articles-grid">
              {filteredArticles.map(article => (
                <div 
                  key={article.id} 
                  className="articles-card"
                  onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="articles-card-image">
                    <img src={article.image} alt={article.title} />
                    {article.featured && <div className="articles-badge">Featured</div>}
                  </div>
                  <div className="articles-card-content">
                    <div className="articles-card-meta">
                      <span className="articles-category">{article.category}</span>
                      <span className="articles-read-time">{article.readTime}</span>
                    </div>
                    <h3 className="articles-card-title">{article.title}</h3>
                    <p className="articles-card-excerpt">{article.excerpt}</p>
                    <div className="articles-source">
                      <span className="source-label">Source:</span>
                      <span className="source-name">{article.source}</span>
                      <span className="external-link-icon">🔗</span>
                    </div>
                    <div className="articles-card-tags">
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="articles-tag">#{tag}</span>
                      ))}
                    </div>
                    <div className="articles-card-footer">
                      <span className="articles-date">{article.date}</span>
                      <button 
                        className="articles-read-more"
                        onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
                      >
                        Read on {article.source.split(' - ')[0]} ↗
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredArticles.length === 0 && (
              <div className="articles-empty-state">
                <BookOpen size={48} className="articles-empty-icon" />
                <h3>No articles found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* User Sidebar: navigation for dashboard sections */}
      <UserSidebar 
        week={week} 
        trimester={trimester} 
        activeTab="dashboard" 
        onChatOpen={() => setIsChatOpen(true)}
        user={user}
      />
      <div style={{ flex: 1, marginLeft: 240, padding: "32px 40px" }}>
        {/* User Navbar: top navigation bar */}
        <UserNavbar user={user} />
        
        <div className="pregnancy-dashboard-header">
          <div className="pregnancy-header-clean">
            <div className="pregnancy-header-content">
              <div className="pregnancy-welcome-section">
                <div className="welcome-content">
                  <div className="welcome-avatar-container">
                    <img 
                      src={user?.profile_photo ? 
                        (user.profile_photo.startsWith('http') ? 
                          user.profile_photo : 
                          `http://127.0.0.1:5000/uploads/user_photos/${user.profile_photo}`) 
                        : 'http://127.0.0.1:5000/assets/default-avatar.svg'
                      }
                      alt={`${user?.firstname} ${user?.lastname}`}
                      className="welcome-profile-avatar"
                      onError={(e) => {
                        e.target.src = 'http://127.0.0.1:5000/assets/default-avatar.svg';
                      }}
                    />
                    <div className="avatar-status-badge">
                      <Heart size={10} />
                    </div>
                  </div>
                  <div className="welcome-text-content">
                    <div className="welcome-main-info">
                      <h1>Welcome back, {user?.firstname}!</h1>
                      <p className="welcome-subtitle">
                        {week && week > 0 ? 
                          `${week} weeks along in your pregnancy journey` : 
                          'Your pregnancy journey starts here'
                        }
                      </p>
                    </div>
                    <div className="user-details-compact">
                      <div className="user-detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{user?.email}</span>
                      </div>
                      <div className="user-detail-row">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{user?.contact || 'Not provided'}</span>
                      </div>
                      {dueDate && (
                        <div className="user-detail-row due-date-row">
                          <Calendar size={14} className="detail-icon" />
                          <span className="detail-label">Due Date:</span>
                          <span className="detail-value">{dueDate}</span>
                          {week && week > 0 && (
                            <span className="weeks-left">({40 - week} weeks left)</span>
                          )}
                        </div>
                      )}
                      {!dueDate && (
                        <div className="user-detail-row due-date-row">
                          <Calendar size={14} className="detail-icon" />
                          <span className="detail-label">Due Date:</span>
                          <span className="detail-value">Complete pregnancy profile to set due date</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pregnancy-message-compact">
                  <Heart size={16} className="message-heart" />
                  <span>
                    {week && week > 0 ? 
                      `You're doing amazing! Week ${week} of your journey.` :
                      'Welcome to your pregnancy journey!'
                    }
                  </span>
                </div>
              </div>
              <div className="pregnancy-header-stats">
                <div className="pregnancy-stat-item">
                  <div className="pregnancy-stat-icon">
                    <Calendar size={18} />
                  </div>
                  <span className="pregnancy-stat-number">{week || 0}</span>
                  <span className="pregnancy-stat-label">Weeks</span>
                </div>
                <div className="pregnancy-stat-item">
                  <div className="pregnancy-stat-icon">
                    <Heart size={18} />
                  </div>
                  <span className="pregnancy-stat-number">{trimester ? trimester.split(' ')[0] : 'N/A'}</span>
                  <span className="pregnancy-stat-label">Trimester</span>
                </div>
                <div className="pregnancy-stat-item">
                  <div className="pregnancy-stat-icon">
                    <Baby size={18} />
                  </div>
                  <span className="pregnancy-stat-number">{babySize}</span>
                  <span className="pregnancy-stat-label">Baby Size</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pregnancy-dashboard-grid">
          {/* Health Overview - Complete health stats */}
          <div className="pregnancy-widget pregnancy-widget-expanded">
            <div className="pregnancy-widget-header">
              <h3 className="pregnancy-widget-title">Health Overview</h3>
              <div className="pregnancy-widget-icon" style={{ backgroundColor: "#4ECDC4" }}>
                <Activity size={20} />
              </div>
            </div>
            <div className="pregnancy-health-stats-full">
              {healthStats.map((stat, index) => (
                <div key={index} className="pregnancy-health-stat-card-full" style={{'--stat-color': stat.color}}>
                  <div className="pregnancy-stat-icon-full" style={{ backgroundColor: stat.color }}>
                    <stat.icon size={22} />
                  </div>
                  <div className="pregnancy-stat-info-full">
                    <h4>{stat.title}</h4>
                    <div className="pregnancy-stat-value-full">{stat.value}</div>
                    <div className={`pregnancy-stat-change-full ${stat.trend}`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointments */}
          <div className="pregnancy-widget">
            <div className="pregnancy-widget-header">
              <h3 className="pregnancy-widget-title">Upcoming Appointments</h3>
              <div className="pregnancy-widget-icon" style={{ backgroundColor: "#FF6B6B" }}>
                <Calendar size={20} />
              </div>
            </div>
            <div className="appointments-content">
              {appointments.length > 0 ? (
                <div>
                  {appointments.slice(0, 3).map((appointment, index) => (
                    <div key={index} className="appointment-item">
                      <div className="appointment-date">
                        <span className="appointment-day">
                          {new Date(appointment.appointment_date).getDate()}
                        </span>
                        <span className="appointment-month">
                          {new Date(appointment.appointment_date).toLocaleDateString('en', { month: 'short' })}
                        </span>
                      </div>
                      <div className="appointment-info">
                        <div className="appointment-title">
                          {appointment.doctor ? 
                            `Dr. ${appointment.doctor.firstname} ${appointment.doctor.lastname}` : 
                            'Medical Appointment'
                          }
                        </div>
                        <div className="appointment-time">
                          {appointment.doctor?.specialty || 'General Consultation'}
                        </div>
                      </div>
                      <div className="appointment-status">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Calendar size={48} className="empty-icon" />
                  <p>No upcoming appointments</p>
                  <button 
                    className="book-appointment-btn"
                    onClick={() => window.location.href = '/pregnancydashboard?section=doctors'}
                  >
                    Book Appointment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Pregnancy Progress */}
          <div className="pregnancy-widget">
            <div className="pregnancy-widget-header">
              <h3 className="pregnancy-widget-title">Pregnancy Progress</h3>
              <div className="pregnancy-widget-icon" style={{ backgroundColor: "#A78BFA" }}>
                <Target size={20} />
              </div>
            </div>
            <div className="pregnancy-progress-content">
              <div className="pregnancy-progress-main">
                <div className="pregnancy-progress-circle">
                  <div className="progress-ring">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        transform: `rotate(${((week || 0) / 40) * 360}deg)` 
                      }}
                    ></div>
                  </div>
                  <div className="progress-center">
                    <span className="progress-week">{week || 0}</span>
                    <span className="progress-label">weeks</span>
                  </div>
                </div>
                <div className="pregnancy-progress-info">
                  <div className="progress-detail">
                    <span className="progress-detail-label">Baby Size:</span>
                    <span className="progress-detail-value">{babySize}</span>
                  </div>
                  <div className="progress-detail">
                    <span className="progress-detail-label">Trimester:</span>
                    <span className="progress-detail-value">{trimester || 'N/A'}</span>
                  </div>
                  <div className="progress-detail">
                    <span className="progress-detail-label">Weeks Left:</span>
                    <span className="progress-detail-value">{week ? 40 - week : 40}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Wellness Tracker */}
          <div className="pregnancy-widget">
            <div className="pregnancy-widget-header">
              <h3 className="pregnancy-widget-title">Daily Wellness</h3>
              <div className="pregnancy-widget-icon" style={{ backgroundColor: "#4ECDC4" }}>
                <Droplets size={20} />
              </div>
            </div>
            <div className="wellness-tracker">
              <div className="wellness-item">
                <div className="wellness-item-header">
                  <Droplets size={18} />
                  <span>Water Intake</span>
                  <span className="wellness-count">{waterIntake}/8</span>
                </div>
                <div className="pregnancy-water-tracker">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className={`pregnancy-water-glass ${i < waterIntake ? 'filled' : ''}`}
                      onClick={() => setWaterIntake(i + 1)}
                    />
                  ))}
                </div>
              </div>
              <div className="wellness-item">
                <div className="wellness-item-header">
                  <Moon size={18} />
                  <span>Sleep Hours</span>
                  <span className="wellness-count">{sleepHours}h</span>
                </div>
                <div className="wellness-slider">
                  <input 
                    type="range" 
                    min="4" 
                    max="12" 
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseInt(e.target.value))}
                    className="wellness-range"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Daily Tips */}
          <div className="pregnancy-widget">
            <div className="pregnancy-widget-header">
              <h3 className="pregnancy-widget-title">Today's Tips</h3>
              <div className="pregnancy-widget-icon" style={{ backgroundColor: "#10B981" }}>
                <Heart size={20} />
              </div>
            </div>
            <div className="tips-content">
              {tips.map((tip, index) => (
                <div key={index} className="pregnancy-tip-card">
                  <div className="pregnancy-tip-icon">{tip.icon}</div>
                  <div className="pregnancy-tip-content">
                    <h4>{tip.title}</h4>
                    <p>{tip.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Modal */}
      <ChatModal 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userType="user"
        userId={user?.patient_id}
      />
    </div>
  );
}

export default UserPregnancyDashboard;