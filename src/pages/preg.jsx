import React from 'react';
import './preg.css';

function PregnancySection() {
  const sections = [
    {
      title: "First Trimester (Weeks 1–12)",
      points: [
        ["What's Happening", "Week-by-week fetal development milestones."],
        ["Body Changes", "Nausea, fatigue, breast tenderness, frequent urination."],
        ["Health & Wellness", "Hydration, rest, light exercise, folic acid."],
        ["Important Tests", "Early ultrasounds, blood tests, NIPT."],
        ["Emotional Well-being", "Mood swings, mental adjustments."],
        ["Things to Avoid", "List of harmful substances/activities."],
        ["Tips", "Staying comfortable and symptom relief."]
      ]
    },
    {
      title: "Second Trimester (Weeks 13–27)",
      points: [
        ["What's Happening", "Fetal movement, organ development."],
        ["Body Changes", "Growing bump, skin changes, cramps."],
        ["Health & Wellness", "Balanced meals, staying active."],
        ["Tests & Screenings", "Anatomy scan, glucose screening."],
        ["Baby's Movements", "Feeling kicks."],
        ["Nursery Prep", "Tips for baby's space."],
        ["Tips", "Better sleep positions, posture."]
      ]
    },
    {
      title: "Third Trimester (Weeks 28–Birth)",
      points: [
        ["Final Development", "Weight gain, head-down position."],
        ["Body Changes", "Swelling, Braxton Hicks, labor signs."],
        ["Health & Wellness", "Labor prep, movement monitoring."],
        ["Pre-labor Signs", "Contractions, water breaking."],
        ["Hospital Bag", "Checklist for essentials."],
        ["Birth Preferences", "Birth plan info."],
        ["Tips", "Coping strategies, relaxation."]
      ]
    }
  ];

  return (
    <div className="pregnancy-container">
      <h1 className="pregnancy-title">🌿 Your Pregnancy Journey</h1>
      <p className="pregnancy-subtitle">Everything you need to know, trimester by trimester.</p>

      {sections.map((section, idx) => (
        <div className="trimester-card" key={idx}>
          <h2 className="trimester-title">{section.title}</h2>
          <ul className="trimester-list">
            {section.points.map(([label, desc], i) => (
              <li key={i}><strong>{label}:</strong> {desc}</li>
            ))}
          </ul>
        </div>
      ))}

      <div className="extra-links">
        <h2>✨ More Resources</h2>
        <div className="grid-links">
          <a href="/due-date-calculator">🗓️ Due Date Calculator</a>
          <a href="/symptom-tracker">📋 Symptom Tracker</a>
          <a href="/nutrition-during-pregnancy">🥗 Nutrition Guide</a>
          <a href="/mental-health-pregnancy">🧠 Mental Health</a>
        </div>
      </div>
    </div>
  );
}

export default PregnancySection;
