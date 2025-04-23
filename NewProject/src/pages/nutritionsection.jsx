import React from "react";
import "./NutritionSection.css";

const NutritionSection = () => {
  const items = [
    {
      title: "What to Eat This Week",
      description: "Personalized weekly meal plan with balanced nutrition.",
    },
    {
      title: "Hydration Reminders",
      description: "Stay hydrated with daily water intake tips .",
    },
    {
      title: "Superfoods by Trimester",
      description: "Discover the best superfoods for each trimester.",
    },
    {
      title: "Doctor-Reviewed Recipes",
      description: "Tasty and safe meals approved by professionals.",
    },
    {
      title: "Printable Shopping List",
      description: "Download or print your weekly grocery list.",
    },
  ];

  return (
    <div className="nutrition-section">
      <h2>🍽️ Nutrition Section</h2>
      <div className="cards-container">
        {items.map((item, index) => (
          <div className="nutrition-card" key={index}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionSection;
