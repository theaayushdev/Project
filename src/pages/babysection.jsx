import React, { useState } from 'react';

const babyNames = ['Aarav', 'Mia', 'Noah', 'Liam', 'Zara', 'hari', 'Ezra', 'Sky','Ashreeya', 'Aanya', 'Riya', 'Aria', 'Zara', 'Isha', 'Nia', 'Kaira', 'Aarvi', 'Anaya', 'Riyaan', 'Vihaan'];
const genderNeutralNames = ['Alex', 'Riley', 'Jordan', 'Taylor', 'Casey', 'Rowan'];

const babyFacts = [
  "At 16 weeks, your baby can start to hear your voice!",
  "Your baby’s heart pumps about 25 quarts of blood each day.",
  "They’re developing unique fingerprints now!",
  "Baby can yawn, stretch, and even make faces!"
];

const babyCareChecklist = [
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
    const newName = babyNames[Math.floor(Math.random() * babyNames.length)];
    setRandomName(newName);
  };

  const handleNewFact = () => {
    const newFact = babyFacts[Math.floor(Math.random() * babyFacts.length)];
    setRandomFact(newFact);
  };

  return (
    <div className="baby-section p-6 rounded-2xl shadow-md bg-pink-50 max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">👶 Baby Section</h2>

      <div className="mb-4">
        <h3 className="font-semibold text-lg">Random Baby Name:</h3>
        <p className="text-pink-700 text-xl">{randomName}</p>
        <button onClick={handleNewName} className="mt-2 bg-pink-300 px-3 py-1 rounded hover:bg-pink-400">Get Another</button>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-lg">📏 Baby Growth Tracker</h3>
        <p>Week 16: Your baby is the size of an avocado 🥑!</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-lg">🧠 Cute Baby Fact</h3>
        <p>{randomFact}</p>
        <button onClick={handleNewFact} className="mt-2 bg-pink-300 px-3 py-1 rounded hover:bg-pink-400">New Fact</button>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-lg">🍼 Gender-Neutral Name Suggestions:</h3>
        <ul className="list-disc ml-5">
          {genderNeutralNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg">✅ Baby Care Checklist for New Moms:</h3>
        <ul className="list-check ml-5">
          {babyCareChecklist.map((item, index) => (
            <li key={index}>🍼 {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BabySection;

