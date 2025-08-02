import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, RefreshCw, Filter, Search } from 'lucide-react';

const BabyNameGenerator = () => {
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [generatedNames, setGeneratedNames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const namesDatabase = {
    boys: {
      traditional: [
        { nepali: 'राम', english: 'Ram', meaning: 'Lord Rama, beloved one' },
        { nepali: 'श्याम', english: 'Shyam', meaning: 'Dark complexioned, Krishna' },
        { nepali: 'हरि', english: 'Hari', meaning: 'Lord Vishnu, remover of sins' },
        { nepali: 'गोविन्द', english: 'Govind', meaning: 'Protector of cows, Krishna' },
        { nepali: 'रमेश', english: 'Ramesh', meaning: 'Lord of Rama, God' },
        { nepali: 'सुरेश', english: 'Suresh', meaning: 'Ruler of gods, Lord Indra' },
        { nepali: 'महेश', english: 'Mahesh', meaning: 'Great Lord, Lord Shiva' },
        { nepali: 'गणेश', english: 'Ganesh', meaning: 'Lord of hosts, elephant god' },
        { nepali: 'कृष्ण', english: 'Krishna', meaning: 'Dark, black, Lord Krishna' },
        { nepali: 'शिव', english: 'Shiva', meaning: 'Auspicious one, Lord Shiva' }
      ],
      modern: [
        { nepali: 'आर्यन', english: 'Aryan', meaning: 'Noble, honorable, superior' },
        { nepali: 'आदित्य', english: 'Aditya', meaning: 'Sun god, bright' },
        { nepali: 'अभिषेक', english: 'Abhishek', meaning: 'Anointing, blessing, coronation' },
        { nepali: 'प्रकाश', english: 'Prakash', meaning: 'Light, illumination, brightness' },
        { nepali: 'अनिल', english: 'Anil', meaning: 'Wind, air, breeze' },
        { nepali: 'अरुण', english: 'Arun', meaning: 'Dawn, reddish brown, sun' },
        { nepali: 'समीर', english: 'Sameer', meaning: 'Breeze, wind, air' },
        { nepali: 'राहुल', english: 'Rahul', meaning: 'Efficient, capable, Buddhas son' },
        { nepali: 'रोहित', english: 'Rohit', meaning: 'Red colored, ascending' },
        { nepali: 'विनोद', english: 'Vinod', meaning: 'Entertainment, pleasure, joy' }
      ],
      nature: [
        { nepali: 'आकाश', english: 'Akash', meaning: 'Sky, space, ether' },
        { nepali: 'पवन', english: 'Pawan', meaning: 'Wind, air, sacred' },
        { nepali: 'सागर', english: 'Sagar', meaning: 'Ocean, sea, vast' },
        { nepali: 'पर्वत', english: 'Parvat', meaning: 'Mountain, hill' },
        { nepali: 'वन', english: 'Van', meaning: 'Forest, woods' },
        { nepali: 'सूर्य', english: 'Surya', meaning: 'Sun, solar deity' },
        { nepali: 'चन्द्र', english: 'Chandra', meaning: 'Moon, bright, shining' },
        { nepali: 'मेघ', english: 'Megh', meaning: 'Cloud, rain bearer' },
        { nepali: 'हिमाल', english: 'Himal', meaning: 'Snow mountain, Himalaya' },
        { nepali: 'चन्दन', english: 'Chandan', meaning: 'Sandalwood, fragrant' }
      ],
      spiritual: [
        { nepali: 'देव', english: 'Dev', meaning: 'God, divine, deity' },
        { nepali: 'देवेश', english: 'Devesh', meaning: 'Lord of gods' },
        { nepali: 'ईश्वर', english: 'Ishwar', meaning: 'Supreme God, lord' },
        { nepali: 'प्रभु', english: 'Prabhu', meaning: 'Master, lord, God' },
        { nepali: 'गुरु', english: 'Guru', meaning: 'Teacher, spiritual guide' },
        { nepali: 'ऋषि', english: 'Rishi', meaning: 'Sage, seer, saint' },
        { nepali: 'मुनि', english: 'Muni', meaning: 'Sage, ascetic, silent one' },
        { nepali: 'योगी', english: 'Yogi', meaning: 'Practitioner of yoga' },
        { nepali: 'धर्म', english: 'Dharma', meaning: 'Righteousness, duty' },
        { nepali: 'कर्म', english: 'Karma', meaning: 'Action, work, fate' }
      ]
    },
    girls: {
      traditional: [
        { nepali: 'सीता', english: 'Sita', meaning: 'Goddess Sita, furrow, earth' },
        { nepali: 'गीता', english: 'Gita', meaning: 'Sacred song, Bhagavad Gita' },
        { nepali: 'राधा', english: 'Radha', meaning: 'Prosperity, Krishnas beloved' },
        { nepali: 'लक्ष्मी', english: 'Lakshmi', meaning: 'Goddess of wealth, fortune' },
        { nepali: 'सरस्वती', english: 'Saraswati', meaning: 'Goddess of knowledge, learning' },
        { nepali: 'पार्वती', english: 'Parvati', meaning: 'Daughter of mountain, Shivas wife' },
        { nepali: 'शान्ति', english: 'Shanti', meaning: 'Peace, tranquility, calm' },
        { nepali: 'भक्ति', english: 'Bhakti', meaning: 'Devotion, faith, worship' },
        { nepali: 'दुर्गा', english: 'Durga', meaning: 'Invincible goddess, protector' },
        { nepali: 'ज्योति', english: 'Jyoti', meaning: 'Light, flame, radiance' }
      ],
      modern: [
        { nepali: 'प्रिया', english: 'Priya', meaning: 'Beloved, dear, loved one' },
        { nepali: 'अनिता', english: 'Anita', meaning: 'Grace, mercy, led' },
        { nepali: 'सुनिता', english: 'Sunita', meaning: 'Well conducted, good policy' },
        { nepali: 'कविता', english: 'Kavita', meaning: 'Poetry, poem, verse' },
        { nepali: 'संगीता', english: 'Sangita', meaning: 'Music, musical, melodious' },
        { nepali: 'अर्चना', english: 'Archana', meaning: 'Worship, honor, devotion' },
        { nepali: 'वन्दना', english: 'Vandana', meaning: 'Salutation, worship, prayer' },
        { nepali: 'मालती', english: 'Malati', meaning: 'Jasmine flower, fragrant' },
        { nepali: 'सुष्मा', english: 'Sushma', meaning: 'Good looks, beauty, charm' },
        { nepali: 'कल्पना', english: 'Kalpana', meaning: 'Imagination, creativity, idea' }
      ],
      nature: [
        { nepali: 'फूल', english: 'Phool', meaning: 'Flower, blossom, bloom' },
        { nepali: 'चम्पा', english: 'Champa', meaning: 'Magnolia flower, fragrant' },
        { nepali: 'कमल', english: 'Kamal', meaning: 'Lotus flower, pure' },
        { nepali: 'गुलाब', english: 'Gulab', meaning: 'Rose, beautiful flower' },
        { nepali: 'तुलसी', english: 'Tulsi', meaning: 'Holy basil, sacred plant' },
        { nepali: 'चन्द्रिका', english: 'Chandrika', meaning: 'Moonlight, bright' },
        { nepali: 'उषा', english: 'Usha', meaning: 'Dawn, morning, sunrise' },
        { nepali: 'रश्मि', english: 'Rashmi', meaning: 'Ray of light, beam' },
        { nepali: 'प्रकृति', english: 'Prakriti', meaning: 'Nature, creation' },
        { nepali: 'तारा', english: 'Tara', meaning: 'Star, bright, shining' }
      ],
      spiritual: [
        { nepali: 'देवी', english: 'Devi', meaning: 'Goddess, divine feminine' },
        { nepali: 'देविका', english: 'Devika', meaning: 'Little goddess, divine' },
        { nepali: 'श्रद्धा', english: 'Shraddha', meaning: 'Faith, devotion, respect' },
        { nepali: 'आस्था', english: 'Astha', meaning: 'Faith, belief, hope' },
        { nepali: 'भावना', english: 'Bhavana', meaning: 'Feeling, emotion, meditation' },
        { nepali: 'चेतना', english: 'Chetana', meaning: 'Consciousness, awareness' },
        { nepali: 'विद्या', english: 'Vidya', meaning: 'Knowledge, learning, education' },
        { nepali: 'मेधा', english: 'Medha', meaning: 'Intelligence, wisdom, talent' },
        { nepali: 'प्रज्ञा', english: 'Pragya', meaning: 'Wisdom, intelligence, knowledge' },
        { nepali: 'साधना', english: 'Sadhana', meaning: 'Practice, worship, effort' }
      ]
    },
    unisex: {
      modern: [
        { nepali: 'अमन', english: 'Aman', meaning: 'Peace, safety, protection' },
        { nepali: 'प्रेम', english: 'Prem', meaning: 'Love, affection, devotion' },
        { nepali: 'आनन्द', english: 'Anand', meaning: 'Joy, happiness, bliss' },
        { nepali: 'सुख', english: 'Sukh', meaning: 'Happiness, comfort, pleasure' },
        { nepali: 'शुभ', english: 'Shubh', meaning: 'Auspicious, good, beneficial' },
        { nepali: 'विकास', english: 'Vikas', meaning: 'Development, progress, growth' },
        { nepali: 'प्रगति', english: 'Pragati', meaning: 'Progress, advancement, development' },
        { nepali: 'विजय', english: 'Vijay', meaning: 'Victory, triumph, success' },
        { nepali: 'यश', english: 'Yash', meaning: 'Fame, glory, success' },
        { nepali: 'गौरव', english: 'Gaurav', meaning: 'Pride, honor, respect' }
      ],
      nature: [
        { nepali: 'जल', english: 'Jal', meaning: 'Water, pure, life-giving' },
        { nepali: 'वायु', english: 'Vayu', meaning: 'Air, wind, breath' },
        { nepali: 'अग्नि', english: 'Agni', meaning: 'Fire, pure, bright' },
        { nepali: 'पृथ्वी', english: 'Prithvi', meaning: 'Earth, land, world' },
        { nepali: 'गगन', english: 'Gagan', meaning: 'Sky, heaven, space' },
        { nepali: 'उपवन', english: 'Upvan', meaning: 'Garden, grove, paradise' },
        { nepali: 'निकुञ्ज', english: 'Nikunj', meaning: 'Grove, bower, secluded place' },
        { nepali: 'कुञ्ज', english: 'Kunj', meaning: 'Grove, arbor, shaded place' },
        { nepali: 'कुसुम', english: 'Kusum', meaning: 'Flower, blossom, beautiful' },
        { nepali: 'सुमन', english: 'Suman', meaning: 'Good flower, beautiful mind' }
      ],
      spiritual: [
        { nepali: 'सत्य', english: 'Satya', meaning: 'Truth, reality, honesty' },
        { nepali: 'धर्म', english: 'Dharma', meaning: 'Righteousness, duty, virtue' },
        { nepali: 'कर्म', english: 'Karma', meaning: 'Action, work, destiny' },
        { nepali: 'योग', english: 'Yoga', meaning: 'Union, meditation, practice' },
        { nepali: 'ध्यान', english: 'Dhyan', meaning: 'Meditation, concentration, focus' },
        { nepali: 'शान्ति', english: 'Shanti', meaning: 'Peace, tranquility, calm' },
        { nepali: 'आत्मा', english: 'Atma', meaning: 'Soul, spirit, self' },
        { nepali: 'ज्योति', english: 'Jyoti', meaning: 'Light, flame, divine light' },
        { nepali: 'तेज', english: 'Tej', meaning: 'Brilliance, light, energy' },
        { nepali: 'चैतन्य', english: 'Chaitanya', meaning: 'Consciousness, awareness, spirit' }
      ]
    }
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'traditional', label: 'Traditional' },
    { id: 'modern', label: 'Modern' },
    { id: 'nature', label: 'Nature' },
    { id: 'spiritual', label: 'Spiritual' }
  ];

  const genders = [
    { id: 'all', label: 'All' },
    { id: 'boys', label: 'Boys' },
    { id: 'girls', label: 'Girls' },
    { id: 'unisex', label: 'Unisex' }
  ];

  const generateRandomNames = () => {
    let availableNames = [];
    
    if (selectedGender === 'all') {
      Object.keys(namesDatabase).forEach(gender => {
        if (selectedCategory === 'all') {
          Object.keys(namesDatabase[gender]).forEach(category => {
            availableNames = [...availableNames, ...namesDatabase[gender][category]];
          });
        } else {
          if (namesDatabase[gender][selectedCategory]) {
            availableNames = [...availableNames, ...namesDatabase[gender][selectedCategory]];
          }
        }
      });
    } else {
      if (selectedCategory === 'all') {
        Object.keys(namesDatabase[selectedGender]).forEach(category => {
          availableNames = [...availableNames, ...namesDatabase[selectedGender][category]];
        });
      } else {
        if (namesDatabase[selectedGender] && namesDatabase[selectedGender][selectedCategory]) {
          availableNames = [...availableNames, ...namesDatabase[selectedGender][selectedCategory]];
        }
      }
    }

    const shuffled = availableNames.sort(() => 0.5 - Math.random());
    setGeneratedNames(shuffled.slice(0, 6));
  };

  const toggleFavorite = (name) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.english === name.english);
      if (exists) {
        return prev.filter(fav => fav.english !== name.english);
      } else {
        return [...prev, name];
      }
    });
  };

  const isFavorite = (name) => {
    return favorites.some(fav => fav.english === name.english);
  };

  useEffect(() => {
    generateRandomNames();
  }, [selectedGender, selectedCategory]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('babyNameFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('babyNameFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const filteredFavorites = favorites.filter(name => 
    name.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    name.nepali.includes(searchTerm)
  );

  return (
    <div className="baby-name-generator-modern">
      <div className="generator-header">
        <div className="header-content">
          <h3>Baby Name Generator</h3>
          <p>Discover beautiful Nepali and Sanskrit names for your little one</p>
        </div>
        <div className="header-actions">
          <button 
            className={`view-toggle ${!showFavorites ? 'active' : ''}`}
            onClick={() => setShowFavorites(false)}
          >
            <Sparkles size={16} />
            Generate
          </button>
          <button 
            className={`view-toggle ${showFavorites ? 'active' : ''}`}
            onClick={() => setShowFavorites(true)}
          >
            <Heart size={16} />
            Favorites ({favorites.length})
          </button>
        </div>
      </div>

      {!showFavorites ? (
        <>
          <div className="filter-controls">
            <div className="filter-group">
              <label className="filter-label">
                <Filter size={14} />
                Gender
              </label>
              <div className="filter-buttons">
                {genders.map(gender => (
                  <button
                    key={gender.id}
                    className={`filter-btn ${selectedGender === gender.id ? 'active' : ''}`}
                    onClick={() => setSelectedGender(gender.id)}
                  >
                    {gender.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <Sparkles size={14} />
                Category
              </label>
              <div className="filter-buttons">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="generate-section">
            <button className="generate-btn" onClick={generateRandomNames}>
              <RefreshCw size={18} />
              Generate New Names
            </button>
          </div>

          <div className="names-grid">
            {generatedNames.map((name, index) => (
              <div key={index} className="name-card">
                <div className="name-card-header">
                  <div className="name-main">
                    <span className="name-nepali">{name.nepali}</span>
                    <span className="name-english">{name.english}</span>
                  </div>
                  <button 
                    className={`favorite-btn ${isFavorite(name) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(name)}
                  >
                    <Heart size={16} fill={isFavorite(name) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="name-meaning">
                  <span className="meaning-label">Meaning:</span>
                  <span className="meaning-text">{name.meaning}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="favorites-search">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search your favorite names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="favorites-section">
            {filteredFavorites.length > 0 ? (
              <div className="names-grid">
                {filteredFavorites.map((name, index) => (
                  <div key={index} className="name-card favorite-card">
                    <div className="name-card-header">
                      <div className="name-main">
                        <span className="name-nepali">{name.nepali}</span>
                        <span className="name-english">{name.english}</span>
                      </div>
                      <button 
                        className="favorite-btn active"
                        onClick={() => toggleFavorite(name)}
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>
                    </div>
                    <div className="name-meaning">
                      <span className="meaning-label">Meaning:</span>
                      <span className="meaning-text">{name.meaning}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-favorites">
                <Heart size={48} className="empty-icon" />
                <h4>No Favorite Names Yet</h4>
                <p>Start generating names and add your favorites!</p>
                <button 
                  className="start-generating-btn"
                  onClick={() => setShowFavorites(false)}
                >
                  <Sparkles size={16} />
                  Start Generating Names
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BabyNameGenerator;
