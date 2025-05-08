import React, { useState } from 'react';
import '../cssonly/babysection.css'; 
const BabySection = () => {
  const babyBoyNames = [
    'Aarav', 'Abhinab', 'Ayush', 'Hari', 'Bishal', 'Vicky', 'Vihaan', 
    'Arjun', 'Ishaan', 'Devansh', 'Krishna', 'Sai', 'Reyansh', 'Ayaan', 
    'Aditya', 'Vivaan', 'Kabir', 'Ojas',  'Tanish', 'Shaan', 
    'Nirav', 'Samarth', 'Aryan', 'Yash'
  ];
  
   const babyGirlNames = [
    'Sweta', 'Alisha', 'Ashreeya', 'Ananya', 'Riya', 'Aria', 'Isha', 'Pallavi', 
    'Kaira', 'Aditi', 'Anaya', 'Meera', 'Saanvi', 'Shivani', 'Aishwarya', 
    'Sanya', 'Alisha', 'Shrinkhala', 'Prisha', 'Ankita', 
    'Siddhi', 'Radhika', 'Jia'
  ];
  


  const genderNeutralNames = [   'Anu', 'Apurva',  'Asmi', 'Bhavya',  'Kamal'];
  
  const babyFacts = [
    "👂 At 16 weeks, your baby can start to hear your voice!",
    "💓 Your baby's heart pumps about 25 quarts of blood each day.",
    "👣 They're developing unique fingerprints now!",
    "😴 Baby can yawn, stretch, and even make faces!",
    "🧠 By week 18, your baby's brain is developing specialized areas for smell, taste, hearing, vision, and touch.",
    "🌈 Your baby can see light through your belly starting around week 22.",
    "👅 Taste buds begin forming at 8 weeks, and by week 15, baby can taste amniotic fluid!",
    "🖐 Baby starts moving their hands and feet between weeks 7–9, though you might not feel it yet.",
    "🎧 By week 25, baby may respond to loud sounds with a jump!",
    "💤 Babies can start having REM sleep — possibly dreaming — by the third trimester.",
    "💪 Muscles begin to strengthen around week 14 as baby stretches and flexes.",
    "🍼 Around week 20, baby begins to swallow and digest amniotic fluid.",
    "👀 Eyes are fully formed by week 28, and baby may begin blinking.",
    "🐾 Baby’s skin is covered in a protective layer called vernix caseosa.",
    "🧠 The brain triples in weight during the last 13 weeks of pregnancy.",
    "🐣 Baby begins producing meconium (their first poop) by week 12.",
    "👂 Baby's ears reach final position by week 18 and start functioning soon after.",
    "🫁 Lungs begin producing surfactant around week 26 — vital for breathing after birth.",
    "🌬 Baby starts practicing breathing movements even before birth.",
    "👃 Nostrils open around week 28 so baby can 'practice' breathing amniotic fluid.",
    "💅 Fingernails and toenails start forming by week 11.",
    "🧬 Baby's DNA determines hair and eye color from the start.",
    "💗 A baby's heartbeat can be heard via Doppler by week 10–12.",
    "🧸 Baby starts to grasp the umbilical cord or their own body by week 16.",
    "🎨 Baby’s skin goes from transparent to opaque as fat develops.",
    "🧦 Babies develop a layer of soft hair called lanugo around week 14–20.",
    "🧊 Baby can distinguish sweet from bitter in the womb.",
    "📈 Baby gains most of their weight in the last 8 weeks of pregnancy.",
    "🎯 Reflexes like sucking and rooting start forming by week 28.",
    "💬 Baby may begin to recognize familiar voices by the third trimester.",
    "🎵 Playing music? Baby may respond with increased movement!",
    "📅 Full-term pregnancy is considered 37 to 42 weeks.",
    "🧸 Baby has sleep-wake cycles even before being born.",
    "🧱 Bones begin hardening from cartilage in the second trimester.",
    "👃 Baby can smell different scents from mom's diet through the amniotic fluid.",
    "💓 A baby's heartbeat is much faster than an adult's — about 120–160 bpm.",
    "🎭 Babies can show facial expressions like frowning and smiling in the womb.",
    "👀 Baby’s eyes may be blue at birth and can change color in the first year.",
    "🧠 By week 24, baby’s brain starts building billions of neurons.",
    "🚶‍♀️ Baby’s position may change frequently during the third trimester.",
    "🧵 Umbilical cord is about 22 inches long by full term.",
    "💧 Amniotic fluid replaces itself every few hours.",
    "🌍 Twins can start interacting with each other in the womb as early as week 14.",
    "🛌 Some babies find a favorite sleeping position — even before birth!",
    "🧡 Baby starts developing emotions as the limbic system matures.",
    "👓 Baby can open their eyes for the first time around week 28.",
    "🧪 Hormones produced by the baby help maintain pregnancy.",
    "🥁 Kicks and punches become more coordinated around week 30.",
    "🫶 Baby begins to recognize and be soothed by their parent’s touch on the belly.",
    "🌟 Every baby develops at their own pace — these milestones are general!"
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
  
  const growthStages = [
    { week: 12, size: "a lime 🍋", length: "2.5 inches" },
    { week: 16, size: "an avocado 🥑", length: "4.6 inches" },
    { week: 20, size: "a banana 🍌", length: "6.5 inches" },
    { week: 24, size: "an ear of corn 🌽", length: "11.8 inches" },
    { week: 28, size: "an eggplant 🍆", length: "14.8 inches" },
    { week: 32, size: "a squash 🎃", length: "16.7 inches" },
    { week: 36, size: "a head of romaine lettuce 🥬", length: "18.7 inches" },
    { week: 40, size: "a small pumpkin 🎃", length: "20 inches" }
  ];
  
  const [randomName, setRandomName] = useState([...babyBoyNames, ...babyGirlNames][Math.floor(Math.random() * [...babyBoyNames, ...babyGirlNames].length)]);
  const [randomFact, setRandomFact] = useState(babyFacts[Math.floor(Math.random() * babyFacts.length)]);
  const [currentWeek, setCurrentWeek] = useState(16);
  const [favoriteNames, setFavoriteNames] = useState([]);
  const [checkedItems, setCheckedItems] = useState(Array(babyCareChecklist.length).fill(false));
  const [activeTab, setActiveTab] = useState('names');
  
  const handleNewName = () => {
    let newName;
    do {
      newName = allBabyNames[Math.floor(Math.random() * allBabyNames.length)];
    } while (newName === randomName);
    setRandomName(newName);
  };
  
  const handleBoyName = () => {
    let newName;
    do {
      newName = babyBoyNames[Math.floor(Math.random() * babyBoyNames.length)];
    } while (newName === randomName);
    setRandomName(newName);
  };
  
  const handleGirlName = () => {
    let newName;
    do {
      newName = babyGirlNames[Math.floor(Math.random() * babyGirlNames.length)];
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
  
  const addToFavorites = () => {
    if (!favoriteNames.includes(randomName)) {
      setFavoriteNames([...favoriteNames, randomName]);
    }
  };
  
  const removeFromFavorites = (name) => {
    setFavoriteNames(favoriteNames.filter(item => item !== name));
  };
  
  const handleCheckItem = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };
  
  const changeWeek = (change) => {
    let newWeek = currentWeek + change;
    if (newWeek < 1) newWeek = 1;
    if (newWeek > 42) newWeek = 42;
    setCurrentWeek(newWeek);
  };
  
  const getCurrentGrowthStage = () => {
    for (let i = growthStages.length - 1; i >= 0; i--) {
      if (currentWeek >= growthStages[i].week) {
        return growthStages[i];
      }
    }
    return { week: 8, size: "a kidney bean 🫘", length: "0.6 inches" };
  };
  
  const growthStage = getCurrentGrowthStage();
  
  return (
    <div className="baby1-container">
      <div className="baby1-header">
        <h2 className="baby1-title">👶 Baby Bliss</h2>
        <p className="baby1-subtitle">Helping you prepare for your little one's arrival</p>
      </div>
      
      <div className="baby1-tabs">
        <button 
          className={`baby1-tab ${activeTab === 'names' ? 'baby1-tab-active' : ''}`} 
          onClick={() => setActiveTab('names')}
        >
          📛 Names
        </button>
        <button 
          className={`baby1-tab ${activeTab === 'growth' ? 'baby1-tab-active' : ''}`} 
          onClick={() => setActiveTab('growth')}
        >
          📏 Growth
        </button>
        <button 
          className={`baby1-tab ${activeTab === 'facts' ? 'baby1-tab-active' : ''}`} 
          onClick={() => setActiveTab('facts')}
        >
          💡 Facts
        </button>
        <button 
          className={`baby1-tab ${activeTab === 'checklist' ? 'baby1-tab-active' : ''}`} 
          onClick={() => setActiveTab('checklist')}
        >
          ✅ Checklist
        </button>
      </div>
      
      {activeTab === 'names' && (
        <div className="baby1-content">
          <div className="baby1-card baby1-name-card">
            <h3 className="baby1-card-title">Name Generator</h3>
            <div className="baby1-name-display">
              <span className="baby1-highlight-name">{randomName}</span>
            </div>
            <div className="baby1-button-group">
        
<button className="baby1-button baby1-primary" onClick={handleBoyName}>
  Boy's Name
</button>
<button className="baby1-button baby1-primary" onClick={handleGirlName}>
 Girl's Name
</button>

              <button className="baby1-button baby1-secondary" onClick={addToFavorites}>
                ❤️ Favorite
              </button>
            </div>
          </div>
          
          <div className="baby1-card">
            <h3 className="baby1-card-title">Gender-Neutral Names</h3>
            <div className="baby1-neutral-names">
              {genderNeutralNames.map((name, index) => (
                <span key={index} className="baby1-neutral-name">
                  {name}
                </span>
              ))}
            </div>
          </div>
          
          {favoriteNames.length > 0 && (
            <div className="baby1-card">
              <h3 className="baby1-card-title">Your Favorite Names</h3>
              <div className="baby1-favorites-list">
                {favoriteNames.map((name, index) => (
                  <div key={index} className="baby1-favorite-item">
                    <span>{name}</span>
                    <button 
                      className="baby1-remove-button" 
                      onClick={() => removeFromFavorites(name)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'growth' && (
        <div className="baby1-content">
          <div className="baby1-card baby1-growth-card">
            <h3 className="baby1-card-title">Baby Growth Tracker</h3>
            <div className="baby1-week-selector">
              <button 
                className="baby1-week-button" 
                onClick={() => changeWeek(-1)}
                disabled={currentWeek <= 1}
              >
                -
              </button>
              <span className="baby1-current-week">Week {currentWeek}</span>
              <button 
                className="baby1-week-button" 
                onClick={() => changeWeek(1)}
                disabled={currentWeek >= 42}
              >
                +
              </button>
            </div>
            <div className="baby1-growth-info">
              <p className="baby1-growth-text">
                At week {currentWeek}, your baby is about the size of {growthStage.size}
              </p>
              <p className="baby1-growth-length">
                Approximately {growthStage.length} long
              </p>
              <div className="baby1-progress-container">
                <div 
                  className="baby1-progress-bar" 
                  style={{ width: `${Math.min(100, (currentWeek / 40) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'facts' && (
        <div className="baby1-content">
          <div className="baby1-card baby1-fact-card">
            <h3 className="baby1-card-title">Baby Development Facts</h3>
            <div className="baby1-fact-display">
              <p className="baby1-fact-text">{randomFact}</p>
            </div>
            <button className="baby1-button baby1-primary" onClick={handleNewFact}>
              💡 Show Another Fact
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'checklist' && (
        <div className="baby1-content">
          <div className="baby1-card baby1-checklist-card">
            <h3 className="baby1-card-title">Baby Care Checklist</h3>
            <div className="baby1-checklist">
              {babyCareChecklist.map((item, index) => (
                <div key={index} className="baby1-checklist-item">
                  <label className="baby1-checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={checkedItems[index]} 
                      onChange={() => handleCheckItem(index)}
                      className="baby1-checkbox"
                    />
                    <span className={`baby1-checkmark ${checkedItems[index] ? 'baby1-checked' : ''}`}></span>
                    <span className={`baby1-checklist-text ${checkedItems[index] ? 'baby1-checked-text' : ''}`}>
                      {item}
                    </span>
                  </label>
                </div>
              ))}
            </div>
            <div className="baby1-checklist-progress">
              <span>Progress: {checkedItems.filter(Boolean).length}/{checkedItems.length}</span>
            </div>
          </div>
        </div>
      )
      };
      <style jsx>{`
        .baby1-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Nunito', sans-serif;
          color: #4a5568;
          background-color: #faf7fc;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .baby1-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .baby1-title {
          color: #805ad5;
          font-size: 2.5rem;
          margin: 0;
          font-weight: 700;
        }
        
        .baby1-subtitle {
          color: #718096;
          font-size: 1.1rem;
          margin-top: 0.5rem;
        }
        
        .baby1-tabs {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        
        .baby1-tab {
          padding: 0.75rem 1.25rem;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          color: #718096;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .baby1-tab:hover {
          background-color: #f7fafc;
          color: #805ad5;
        }
        
        .baby1-tab-active {
          background-color: #805ad5;
          color: white;
          border-color: #805ad5;
        }
        
        .baby1-tab-active:hover {
          background-color: #6b46c1;
          color: white;
        }
        
        .baby1-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .baby1-card {
          background-color: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease;
        }
        
        .baby1-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .baby1-card-title {
          font-size: 1.25rem;
          color: #4a5568;
          margin-top: 0;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        
        .baby1-name-card {
          text-align: center;
        }
        
        .baby1-name-display {
          margin: 1.5rem 0;
        }
        
        .baby1-highlight-name {
          font-size: 2.5rem;
          font-weight: 700;
          color: #805ad5;
          display: block;
          animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .baby1-button-group {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .baby1-button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .baby1-primary {
          background-color:rgb(55, 104, 167);
          color: white;
        }
        
        .baby1-primary:hover {
          background-color:rgb(48, 127, 172);
        }
        
        .baby1-secondary {
          background-color: #fed7e2;
          color:rgb(164, 50, 116);
        }
        
        .baby1-secondary:hover {
          background-color: #fbb6ce;
        }
        
        .baby1-neutral-names {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .baby1-neutral-name {
          background-color: #e9d8fd;
          color:rgb(47, 98, 145);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
        }
        
        .baby1-favorites-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .baby1-favorite-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background-color: #f7fafc;
          border-radius: 0.5rem;
          font-weight: 500;
        }
        
        .baby1-remove-button {
          background-color: #fed7e2;
          color: #b83280;
          border: none;
          border-radius: 0.25rem;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s ease;
        }
        
        .baby1-remove-button:hover {
          background-color: #fbb6ce;
        }
        
        .baby1-week-selector {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .baby1-week-button {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background-color: #e9d8fd;
          color:rgb(66, 113, 170);
          font-weight: bold;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .baby1-week-button:hover:not(:disabled) {
          background-color: #d6bcfa;
        }
        
        .baby1-week-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .baby1-current-week {
          font-size: 1.25rem;
          font-weight: 700;
          color: #4a5568;
          min-width: 6rem;
          text-align: center;
        }
        
        .baby1-growth-info {
          text-align: center;
        }
        
        .baby1-growth-text {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        
        .baby1-growth-length {
          color: #718096;
          margin-bottom: 1.5rem;
        }
        
        .baby1-progress-container {
          height: 0.75rem;
          background-color: #e2e8f0;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .baby1-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #805ad5, #d53f8c);
          border-radius: 0.5rem;
          transition: width 0.3s ease;
        }
        
        .baby1-fact-display {
          background-color: #f7fafc;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          min-height: 6rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .baby1-fact-text {
          font-size: 1.25rem;
          line-height: 1.5;
          margin: 0;
          text-align: center;
          animation: fadeIn 0.5s ease;
        }
        
        .baby1-checklist {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        
        .baby1-checklist-item {
          position: relative;
        }
        
        .baby1-checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }
        
        .baby1-checkbox-label:hover {
          background-color: #f7fafc;
        }
        
        .baby1-checkbox {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }
        
        .baby1-checkmark {
          height: 1.5rem;
          width: 1.5rem;
          background-color: #fff;
          border: 2px solid #e2e8f0;
          border-radius: 0.25rem;
          margin-right: 0.75rem;
          position: relative;
          transition: all 0.2s ease;
        }
        
        .baby1-checkbox:checked ~ .baby1-checkmark {
          background-color:rgb(53, 74, 17);
          border-color: #805ad5;
        }
        
        .baby1-checkmark:after {
          content: "";
          position: absolute;
          display: none;
          left: 0.45rem;
          top: 0.2rem;
          width: 0.25rem;
          height: 0.75rem;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        
        .baby1-checkbox:checked ~ .baby1-checkmark:after {
          display: block;
        }
        
        .baby1-checklist-text {
          font-size: 1.1rem;
          transition: all 0.2s ease;
        }
        
        .baby1-checked-text {
          text-decoration: line-through;
          color: #a0aec0;
        }
        
        .baby1-checklist-progress {
          text-align: right;
          font-size: 0.875rem;
          color: #718096;
          font-weight: 500;
        }
        
        /* Responsive Styles */
        @media (max-width: 640px) {
          .baby1-container {
            padding: 1.5rem 1rem;
          }
          
          .baby1-title {
            font-size: 2rem;
          }
          
          .baby1-tabs {
            gap: 0.25rem;
          }
          
          .baby1-tab {
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
          }
          
          .baby1-highlight-name {
            font-size: 2rem;
          }
          
          .baby1-button-group {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .baby1-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BabySection;