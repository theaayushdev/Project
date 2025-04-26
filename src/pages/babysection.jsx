import React, { useState } from 'react';
import '../cssonly/babysection.css';

const babyNames = ['Aarav', 'Abhinab', 'Ayush', 'Sweta', 'Zara', 'Hari', 'Ezra', 'Sky', 'Ashreeya', 'Aanya', 'Riya', 'Aria', 'Isha', 'Nia', 'Kaira', 'Aarvi', 'Anaya', 'Riyaan', 'Vihaan'];
const genderNeutralNames = ['Alex', 'Riley', 'Jordan', 'Taylor', 'Casey', 'Rowan'];

const babyFacts = 
[
  "👂 At 16 weeks, your baby can start to hear your voice!",
  "💓 Your baby’s heart pumps about 25 quarts of blood each day.",
  "👣 They’re developing unique fingerprints now!",
  "😴 Baby can yawn, stretch, and even make faces!"
];

const babyCareChecklist = 
[
  "Soft baby clothes",
  "Diapers and wipes",
  "Mild baby soap and shampoo",
  "Baby crib or bassinet",
  "Burp cloths",
  "Feeding bottles",
  "Nail clippers",
  "Swaddle blankets"
];

const BabySection = () => {
  const [randomName, setRandomName] = useState(babyNames[Math.floor(Math.random() * babyNames.length)]);
  const [randomFact, setRandomFact] = useState(babyFacts[Math.floor(Math.random() * babyFacts.length)]);

  const handleNewName = () => {
    let newName;
    do {
      newName = babyNames[Math.floor(Math.random() * babyNames.length)];
    } while (newName === randomName);
    setRandomName(newName);
  };

  const handleNewFact = () => {
    let newFact;
    do {
      newFact = babyFacts[Math.floor(Math.random() * babyFacts.length)];
    } while (newFact === randomFact);
    setRandomFact(newFact);
  };

  return (
    <div className="baby-container">
      <h2 className="baby-title">👶 Baby Bliss Section</h2>
      <p className="baby-subtitle">Explore names, facts, and helpful mom tips!</p>

      <div className="baby-card">
        <h3>📛 Random Baby Name</h3>
        <p className="highlight-name">{randomName}</p>
        <button onClick={handleNewName}>🔄 New Name</button>
      </div>

      <div className="baby-card">
        <h3>📏 Baby Growth Tracker</h3>
        <p>Week 16: Your baby is the size of an avocado 🥑!</p>
      </div>

      <div className="baby-card">
        <h3>🧠 Cute Baby Fact</h3>
        <p>{randomFact}</p>
        <button onClick={handleNewFact}>💡 New Fact</button>
      </div>

      <div className="baby-card">
        <h3>🍼 Gender-Neutral Name Suggestions</h3>
        <ul>
          {genderNeutralNames.map((name, index) => (
            <li key={index}>⭐ {name}</li>
          ))}
        </ul>
      </div>

      <div className="baby-card">
        <h3>✅ Baby Care Checklist for New Moms</h3>
        <ul>
          {babyCareChecklist.map((item, index) => (
            <li key={index}>🍼 {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BabySection;
