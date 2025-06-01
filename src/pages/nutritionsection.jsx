import React, { useState } from "react";

const NutritionSection = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');

  const items = [
    {
      title: "What to Eat This Week",
      description: "Personalized weekly meal plan with balanced nutrition tailored to your pregnancy stage.",
      icon: "🥗",
      details: "Get customized meal suggestions based on your trimester, dietary preferences, and nutritional needs.",
      color: "from-green-400 to-emerald-600",
      content: {
        overview: "Weekly personalized meal planning designed specifically for pregnant mothers",
        features: [
          "Trimester-specific meal recommendations",
          "Balanced macronutrient distribution",
          "Easy-to-follow recipe instructions",
          "Nutritional value breakdown for each meal",
          "Alternative options for dietary restrictions"
        ],
        benefits: [
          "Ensures proper fetal development",
          "Maintains maternal health",
          "Reduces pregnancy complications",
          "Boosts energy levels naturally"
        ],
        sample: {
          monday: "Breakfast: Avocado toast with spinach, Lunch: Quinoa bowl with grilled chicken, Dinner: Salmon with sweet potato",
          tuesday: "Breakfast: Greek yogurt parfait, Lunch: Lentil soup with whole grain bread, Dinner: Lean beef stir-fry"
        }
      }
    },
    {
      title: "Hydration Reminders",
      description: "Stay hydrated with smart daily water intake tracking and gentle reminders.",
      icon: "💧",
      details: "Receive personalized hydration goals and tips to maintain optimal fluid levels during pregnancy.",
      color: "from-blue-400 to-cyan-600",
      content: {
        overview: "Smart hydration tracking system with personalized reminders",
        features: [
          "Customized daily water intake goals",
          "Smart reminder notifications",
          "Hydration level tracking",
          "Tips for staying hydrated",
          "Integration with meal planning"
        ],
        benefits: [
          "Prevents dehydration-related complications",
          "Supports healthy blood volume",
          "Aids in nutrient transportation",
          "Helps maintain amniotic fluid levels"
        ],
        tips: [
          "Drink water first thing in the morning",
          "Keep a water bottle within reach",
          "Eat water-rich foods like watermelon",
          "Set hourly hydration reminders"
        ]
      }
    },
    {
      title: "Superfoods by Trimester",
      description: "Discover the most beneficial superfoods for each stage of your pregnancy journey.",
      icon: "🥑",
      details: "Learn about nutrient-dense foods that support your baby's development at every trimester.",
      color: "from-purple-400 to-indigo-600",
      content: {
        overview: "Comprehensive guide to superfoods throughout your pregnancy",
        trimester1: [
          "Folate-rich leafy greens (spinach, kale)",
          "Citrus fruits for vitamin C",
          "Whole grains for energy",
          "Lean proteins for development"
        ],
        trimester2: [
          "Calcium-rich dairy products",
          "Iron-rich foods (lean meats, beans)",
          "Omega-3 fatty acids (salmon, walnuts)",
          "Colorful vegetables for antioxidants"
        ],
        trimester3: [
          "Protein for rapid growth",
          "Healthy fats for brain development",
          "Fiber-rich foods for digestion",
          "Potassium-rich foods (bananas, avocados)"
        ]
      }
    },
    {
      title: "Doctor-Reviewed Recipes",
      description: "Delicious and safe meals carefully reviewed and approved by nutrition professionals.",
      icon: "👩‍⚕️",
      details: "Access hundreds of pregnancy-safe recipes with detailed nutritional information and cooking tips.",
      color: "from-pink-400 to-rose-600",
      content: {
        overview: "Professionally vetted recipes safe for pregnancy",
        categories: [
          "Quick & Easy Meals (15-30 minutes)",
          "High-Protein Dishes",
          "Iron-Rich Recipes",
          "Calcium-Boosting Meals",
          "Morning Sickness-Friendly Foods"
        ],
        featured: {
          "Pregnancy Power Bowl": {
            ingredients: "Quinoa, grilled chicken, avocado, spinach, chickpeas",
            nutrition: "35g protein, 8g fiber, 450mg folate",
            time: "20 minutes"
          },
          "Iron-Rich Lentil Curry": {
            ingredients: "Red lentils, spinach, tomatoes, coconut milk",
            nutrition: "18g protein, 6.6mg iron, 200mcg folate",
            time: "25 minutes"
          }
        }
      }
    },
    {
      title: "Printable Shopping List",
      description: "Smart grocery lists that sync with your meal plans for effortless shopping.",
      icon: "📋",
      details: "Generate organized shopping lists by category with quantity estimates and healthy alternatives.",
      color: "from-orange-400 to-amber-600",
      content: {
        overview: "Automated shopping list generation based on your meal plans",
        features: [
          "Auto-generated from meal plans",
          "Organized by store sections",
          "Quantity calculations",
          "Healthy substitution suggestions",
          "Budget-friendly alternatives"
        ],
        categories: [
          "Fresh Produce",
          "Dairy & Eggs",
          "Meat & Seafood",
          "Pantry Essentials",
          "Frozen Foods"
        ],
        sample: [
          "Spinach (2 bunches) - for iron and folate",
          "Greek yogurt (32oz) - for protein and probiotics",
          "Salmon fillets (1 lb) - for omega-3 fatty acids",
          "Quinoa (2 cups) - for complete protein"
        ]
      }
    },
  ];

  const handleCardClick = (index) => {
    setActiveCard(activeCard === index ? null : index);
    setActiveSection('overview');
  };

  const renderCardContent = (item) => {
    if (!item.content) return null;

    switch (item.title) {
      case "What to Eat This Week":
        return (
          <div className="nut-detailed-content">
            <div className="nut-content-nav">
              <button 
                className={`nut-nav-btn ${activeSection === 'overview' ? 'nut-nav-active' : ''}`}
                onClick={() => setActiveSection('overview')}
              >
                Overview
              </button>
              <button 
                className={`nut-nav-btn ${activeSection === 'features' ? 'nut-nav-active' : ''}`}
                onClick={() => setActiveSection('features')}
              >
                Features
              </button>
              <button 
                className={`nut-nav-btn ${activeSection === 'sample' ? 'nut-nav-active' : ''}`}
                onClick={() => setActiveSection('sample')}
              >
                Sample Menu
              </button>
            </div>
            
            {activeSection === 'overview' && (
              <div className="nut-content-section">
                <p className="nut-content-text">{item.content.overview}</p>
                <div className="nut-benefits-grid">
                  {item.content.benefits.map((benefit, idx) => (
                    <div key={idx} className="nut-benefit-item">
                      <span className="nut-benefit-icon">✓</span>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeSection === 'features' && (
              <div className="nut-content-section">
                <div className="nut-features-list">
                  {item.content.features.map((feature, idx) => (
                    <div key={idx} className="nut-feature-item">
                      <span className="nut-feature-bullet">•</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeSection === 'sample' && (
              <div className="nut-content-section">
                <div className="nut-sample-menu">
                  <div className="nut-menu-day">
                    <h4 className="nut-day-title">Monday</h4>
                    <p className="nut-menu-text">{item.content.sample.monday}</p>
                  </div>
                  <div className="nut-menu-day">
                    <h4 className="nut-day-title">Tuesday</h4>
                    <p className="nut-menu-text">{item.content.sample.tuesday}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "Superfoods by Trimester":
        return (
          <div className="nut-detailed-content">
            <div className="nut-content-nav">
              <button 
                className={`nut-nav-btn ${activeSection === 'trimester1' ? 'nut-nav-active' : ''}`}
                onClick={() => setActiveSection('trimester1')}
              >
                1st Trimester
              </button>
              <button 
                className={`nut-nav-btn ${activeSection === 'trimester2' ? 'nut-nav-active' : ''}`}
                onClick={() => setActiveSection('trimester2')}
              >
                2nd Trimester
              </button>
              <button 
                className={`nut-nav-btn ${activeSection === 'trimester3' ? 'nut-nav-active' : ''}`}
                onClick={() => setActiveSection('trimester3')}
              >
                3rd Trimester
              </button>
            </div>
            
            <div className="nut-content-section">
              <div className="nut-superfoods-list">
                {item.content[activeSection]?.map((food, idx) => (
                  <div key={idx} className="nut-superfood-item">
                    <span className="nut-superfood-icon">🌟</span>
                    {food}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "Doctor-Reviewed Recipes":
        return (
          <div className="nut-detailed-content">
            <div className="nut-content-nav">
              <button 
                className={`nut-nav-btn ${activeSection === 'categories' ? 'nut-nav-active' : ''}`}
                onClick={() => setActiveSection('categories')}
              >
                Categories
              </button>
              <button 
                className={`nut-nav-btn ${activeSection === 'featured' ? 'nut-nav-active' : ''}`}
                onClick={() => setActiveSection('featured')}
              >
                Featured Recipes
              </button>
            </div>
            
            {activeSection === 'categories' && (
              <div className="nut-content-section">
                <div className="nut-categories-grid">
                  {item.content.categories.map((category, idx) => (
                    <div key={idx} className="nut-category-item">
                      <span className="nut-category-icon">👨‍🍳</span>
                      {category}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeSection === 'featured' && (
              <div className="nut-content-section">
                {Object.entries(item.content.featured).map(([recipeName, recipe], idx) => (
                  <div key={idx} className="nut-recipe-card">
                    <h4 className="nut-recipe-title">{recipeName}</h4>
                    <p className="nut-recipe-ingredients"><strong>Ingredients:</strong> {recipe.ingredients}</p>
                    <p className="nut-recipe-nutrition"><strong>Nutrition:</strong> {recipe.nutrition}</p>
                    <p className="nut-recipe-time"><strong>Prep Time:</strong> {recipe.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="nut-detailed-content">
            <div className="nut-content-section">
              <p className="nut-content-text">{item.content.overview}</p>
              {item.content.features && (
                <div className="nut-features-list">
                  {item.content.features.map((feature, idx) => (
                    <div key={idx} className="nut-feature-item">
                      <span className="nut-feature-bullet">•</span>
                      {feature}
                    </div>
                  ))}
                </div>
              )}
              {item.content.tips && (
                <div className="nut-tips-section">
                  <h4 className="nut-tips-title">Pro Tips:</h4>
                  {item.content.tips.map((tip, idx) => (
                    <div key={idx} className="nut-tip-item">
                      <span className="nut-tip-icon">💡</span>
                      {tip}
                    </div>
                  ))}
                </div>
              )}
              {item.content.sample && (
                <div className="nut-sample-section">
                  <h4 className="nut-sample-title">Shopping List Sample:</h4>
                  {item.content.sample.map((sampleItem, idx) => (
                    <div key={idx} className="nut-sample-item">
                      <span className="nut-sample-icon">🛒</span>
                      {sampleItem}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="nut-main-container">
      <div className="nut-header-section">
        <div className="nut-title-wrapper">
          <h2 className="nut-main-title">
            <span className="nut-emoji">🍽️</span>
            Nutrition & Wellness Hub
          </h2>
          <p className="nut-subtitle">
            Your personalized guide to healthy eating during pregnancy journey
          </p>
        </div>
        <div className="nut-decorative-elements">
          <div className="nut-floating-icon nut-float-1">🥕</div>
          <div className="nut-floating-icon nut-float-2">🍎</div>
          <div className="nut-floating-icon nut-float-3">🥬</div>
        </div>
      </div>

      <div className="nut-cards-grid">
        {items.map((item, index) => (
          <div 
            className={`nut-card ${activeCard === index ? 'nut-card-active' : ''}`}
            key={index}
            onClick={() => handleCardClick(index)}
          >
            <div className={`nut-card-gradient bg-gradient-to-br ${item.color}`}>
              <div className="nut-card-content">
                <div className="nut-card-header">
                  <div className="nut-icon-wrapper">
                    <span className="nut-card-icon">{item.icon}</span>
                  </div>
                  <h3 className="nut-card-title">{item.title}</h3>
                </div>
                
                <p className="nut-card-description">{item.description}</p>
                
                <div className={`nut-card-details ${activeCard === index ? 'nut-details-visible' : ''}`}>
                  <p className="nut-details-text">{item.details}</p>
                  
                  {activeCard === index && renderCardContent(item)}
                  
                  <button className="nut-action-btn" onClick={(e) => e.stopPropagation()}>
                    Get Started
                    <span className="nut-btn-arrow">→</span>
                  </button>
                </div>
                
                <div className="nut-card-footer">
                  <span className="nut-expand-hint">
                    {activeCard === index ? 'Click to collapse' : 'Click to explore'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="nut-card-glow"></div>
          </div>
        ))}
      </div>

      <div className="nut-bottom-section">
        <div className="nut-stats-container">
          <div className="nut-stat-item">
            <span className="nut-stat-number">500+</span>
            <span className="nut-stat-label">Healthy Recipes</span>
          </div>
          <div className="nut-stat-item">
            <span className="nut-stat-number">95%</span>
            <span className="nut-stat-label">Mom Satisfaction</span>
          </div>
          <div className="nut-stat-item">
            <span className="nut-stat-number">24/7</span>
            <span className="nut-stat-label">Expert Supports</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .nut-main-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow: hidden;
        }

        .nut-main-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }

        .nut-header-section {
          text-align: center;
          margin-bottom: 4rem;
          position: relative;
          z-index: 2;
        }

        .nut-title-wrapper {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2rem;
          padding: 2rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .nut-main-title {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin: 0 0 1rem 0;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .nut-emoji {
          font-size: 3.5rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .nut-subtitle {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.95);
          margin: 0;
          font-weight: 400;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .nut-decorative-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .nut-floating-icon {
          position: absolute;
          font-size: 2rem;
          opacity: 0.8;
          animation: nut-float 6s ease-in-out infinite;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .nut-float-1 {
          top: 10%;
          left: 10%;
          animation-delay: -2s;
        }

        .nut-float-2 {
          top: 20%;
          right: 15%;
          animation-delay: -4s;
        }

        .nut-float-3 {
          bottom: 30%;
          left: 20%;
          animation-delay: -1s;
        }

        @keyframes nut-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .nut-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
          position: relative;
          z-index: 2;
        }

        .nut-card {
          position: relative;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }

        .nut-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .nut-card-active {
          transform: translateY(-12px) scale(1.05);
        }

        .nut-card-gradient {
          border-radius: 1.5rem;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          min-height: 300px;
        }

        .nut-card-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1));
          border-radius: inherit;
        }

        .nut-card-content {
          position: relative;
          z-index: 2;
          color: white;
        }

        .nut-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .nut-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.4);
        }

        .nut-card-icon {
          font-size: 1.8rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .nut-card-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          line-height: 1.2;
        }

        .nut-card-description {
          font-size: 1.05rem;
          line-height: 1.6;
          margin: 0 0 1rem 0;
          opacity: 0.95;
          font-weight: 400;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }

        .nut-card-details {
          max-height: 0;
          overflow: hidden;
          transition: all 0.5s ease;
          opacity: 0;
        }

        .nut-details-visible {
          max-height: 1000px;
          opacity: 1;
          margin-top: 1.5rem;
        }

        .nut-details-text {
          font-size: 1rem;
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
          opacity: 0.9;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }

        .nut-detailed-content {
          margin: 1.5rem 0;
        }

        .nut-content-nav {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .nut-nav-btn {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 1.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          font-size: 0.9rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .nut-nav-btn:hover, .nut-nav-active {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .nut-content-section {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .nut-content-text {
          font-size: 1rem;
          line-height: 1.6;
          margin: 0 0 1rem 0;
          opacity: 0.95;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .nut-features-list, .nut-superfoods-list, .nut-categories-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .nut-feature-item, .nut-superfood-item, .nut-category-item, .nut-benefit-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .nut-feature-bullet, .nut-superfood-icon, .nut-category-icon, .nut-benefit-icon {
          font-size: 1.2rem;
          opacity: 0.8;
        }

        .nut-benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .nut-sample-menu {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .nut-menu-day {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .nut-day-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .nut-menu-text {
          font-size: 0.95rem;
          line-height: 1.5;
          margin: 0;
          opacity: 0.9;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .nut-recipe-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .nut-recipe-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .nut-recipe-ingredients, .nut-recipe-nutrition, .nut-recipe-time {
          font-size: 0.9rem;
          line-height: 1.4;
          margin: 0.5rem 0;
          opacity: 0.9;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .nut-tips-section, .nut-sample-section {
          margin-top: 1.5rem;
        }

        .nut-tips-title, .nut-sample-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .nut-tip-item, .nut-sample-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 0.5rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .nut-tip-icon, .nut-sample-icon {
          font-size: 1.2rem;
          opacity: 0.8;
          flex-shrink: 0;
        }

        .nut-action-btn {
          background: rgba(255, 255, 255, 0.25);
          border: 2px solid rgba(255, 255, 255, 0.4);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
          margin-top: 1.5rem;
        }

        .nut-action-btn:hover {
          background: rgba(255, 255, 255, 0.35);
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .nut-btn-arrow {
          transition: transform 0.3s ease;
        }

        .nut-action-btn:hover .nut-btn-arrow {
          transform: translateX(4px);
        }

        .nut-card-footer {
          margin-top: 1.5rem;
          text-align: center;
        }

        .nut-expand-hint {
          font-size: 0.85rem;
          opacity: 0.8;
          font-style: italic;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .nut-card-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          border-radius: 1.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .nut-card:hover .nut-card-glow {
          opacity: 1;
        }

        .nut-bottom-section {
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .nut-stats-container {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2rem;
          padding: 2rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .nut-stat-item {
          text-align: center;
        }

        .nut-stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          margin-bottom: 0.5rem;
        }

        .nut-stat-label {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.95);
          font-weight: 400;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .nut-main-container {
            padding: 1rem;
          }

          .nut-main-title {
            font-size: 2.2rem;
            flex-direction: column;
            gap: 0.5rem;
          }

          .nut-subtitle {
            font-size: 1.1rem;
          }

          .nut-cards-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .nut-stats-container {
            gap: 2rem;
            padding: 1.5rem;
          }

          .nut-stat-number {
            font-size: 2rem;
          }

          .nut-stat-label {
            font-size: 1rem;
          }

          .nut-content-nav {
            justify-content: center;
          }

          .nut-nav-btn {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }

          .nut-benefits-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .nut-main-title {
            font-size: 1.8rem;
          }

          .nut-emoji {
            font-size: 2.5rem;
          }

          .nut-card-gradient {
            padding: 1.5rem;
          }

          .nut-card-title {
            font-size: 1.3rem;
          }

          .nut-stats-container {
            flex-direction: column;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NutritionSection;