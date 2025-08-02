import React, { useEffect, useState } from "react";
import UserNavbar from "./Usernavbar"; // Top navigation bar for user
import UserSidebar from "./usersidebar"; // Sidebar navigation for user
import ChatModal from "../components/Chat/ChatModal"; // Chat modal component
import { Calendar, Heart, Baby, Droplets, Moon, Weight, Activity, Plus, ChevronRight, Star, Target, Users, BookOpen, ArrowLeft, Brain, Eye, Zap, Scale } from "lucide-react";
import "../cssonly/pregnancydashboard.css";
import { useLocation, useNavigate } from 'react-router-dom';

function getPregnancyWeek(lmc) {
  if (!lmc) return null;
  const lmcDate = new Date(lmc);
  const now = new Date();
  const diff = now - lmcDate;
  const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  
  // Ensure week is within valid pregnancy range (0-42 weeks)
  if (week < 0) return 0;
  if (week > 42) return 42; // Post-term pregnancy
  
  return week;
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

// Comprehensive weekly development data with working YouTube links and uplifting free story books
const weeklyDevelopmentData = {
  4: {
    baby: {
      appearance: "Tiny embryo with basic body shape forming",
      size: "Size of a poppy seed (2-4mm)"
    },
    mother: {
      care: "Start prenatal vitamins, stay hydrated, get rest"
    },
    resources: {
      exercises: [
        {
          title: "Gentle Pregnancy Yoga for Beginners",
          url: "https://www.youtube.com/watch?v=8U4sWPqK0hY",
          duration: "15 min",
          type: "Prenatal Yoga",
          channel: "Yoga with Adriene"
        },
        {
          title: "10 Minute First Trimester Pregnancy Workout",
          url: "https://www.youtube.com/watch?v=VGqQ0g_TQPQ",
          duration: "10 min",
          type: "Safe Cardio",
          channel: "MadFit"
        }
      ],
      books: [
        {
          title: "The Little Prince - Free Online Reading",
          author: "Antoine de Saint-Exupéry",
          url: "https://www.gutenberg.org/files/525/525-h/525-h.htm",
          description: "A beautiful, uplifting story about love, friendship, and seeing the world with wonder - perfect for expecting mothers"
        },
        {
          title: "Anne of Green Gables - Free Online Novel",
          author: "L.M. Montgomery",
          url: "https://www.gutenberg.org/files/45/45-h/45-h.htm",
          description: "Heartwarming story of hope, dreams, and new beginnings that will lift your spirits during pregnancy"
        }
      ],
      nutrition: [
        {
          title: "Essential Folic Acid",
          content: "Take 400-800mcg daily to prevent neural tube defects",
          source: "CDC Guidelines"
        },
        {
          title: "Morning Sickness Relief",
          content: "Ginger tea, small frequent meals, avoid empty stomach",
          source: "Mayo Clinic"
        }
      ],
      symptoms: [
        "Missed period - primary early sign",
        "Breast tenderness and enlargement",
        "Fatigue and drowsiness",
        "Mild nausea may begin"
      ],
      tips: [
        "Start taking 400-800mcg folic acid daily immediately",
        "Eliminate alcohol, smoking, and illicit drugs completely",
        "Begin tracking symptoms in a pregnancy journal",
        "Schedule appointment with healthcare provider",
        "Start eating smaller, more frequent meals",
        "Avoid raw or undercooked foods, deli meats, soft cheeses"
      ]
    }
  },
  5: {
    baby: {
      appearance: "Heart begins beating, arm and leg buds appear",
      size: "Size of a sesame seed (4-6mm)"
    },
    mother: {
      care: "Eat small frequent meals, avoid strong odors"
    },
    resources: {
      exercises: [
        {
          title: "5 Minute Morning Pregnancy Stretches",
          url: "https://www.youtube.com/watch?v=sTANio_2E0Q",
          duration: "5 min",
          type: "Morning Stretches",
          channel: "Prenatal Yoga Center"
        },
        {
          title: "Pregnancy Workout - First Trimester",
          url: "https://www.youtube.com/watch?v=WLEH0QE9PuU",
          duration: "20 min",
          type: "Full Body Workout",
          channel: "Jessica Smith TV"
        }
      ],
      books: [
        {
          title: "Pride and Prejudice - Free Online Reading",
          author: "Jane Austen",
          url: "https://www.gutenberg.org/files/1342/1342-h/1342-h.htm",
          description: "A delightful romance that will keep you entertained and smiling throughout your pregnancy journey"
        },
        {
          title: "The Secret Garden - Free Online Story",
          author: "Frances Hodgson Burnett",
          url: "https://www.gutenberg.org/files/113/113-h/113-h.htm",
          description: "An inspiring tale of growth, healing, and new life - perfect for expecting mothers"
        }
      ],
      nutrition: [
        {
          title: "Combat Morning Sickness",
          content: "Eat crackers before getting up, avoid empty stomach, try ginger supplements",
          source: "American Pregnancy Association"
        },
        {
          title: "Hydration Focus",
          content: "Drink 8-10 glasses water daily, add lemon for nausea relief",
          source: "ACOG Guidelines"
        }
      ],
      symptoms: [
        "Morning sickness may intensify",
        "Increased urination frequency",
        "Food aversions developing",
        "Heightened sense of smell"
      ],
      tips: [
        "Keep crackers by bedside for morning nausea",
        "Eat protein snacks every 2-3 hours",
        "Avoid cooking smells that trigger nausea",
        "Get 8-9 hours of sleep nightly",
        "Consider vitamin B6 for nausea (consult doctor first)",
        "Start documenting symptoms for first prenatal visit"
      ]
    }
  },
  8: {
    baby: {
      appearance: "Fingers and toes forming, more human-like shape",
      size: "Size of a kidney bean (14-20mm)"
    },
    mother: {
      care: "Eat high-fiber foods, gentle exercise like walking"
    },
    resources: {
      exercises: [
        {
          title: "Prenatal Pilates - 8 Week Safe Workout",
          url: "https://www.youtube.com/watch?v=OadQ4xA9F_c",
          duration: "25 min",
          type: "Prenatal Pilates",
          channel: "Move with Nicole"
        },
        {
          title: "First Trimester Cardio Workout",
          url: "https://www.youtube.com/watch?v=tXlne6rbBHM",
          duration: "15 min",
          type: "Low Impact Cardio",
          channel: "FitnessBlender"
        }
      ],
      books: [
        {
          title: "Little Women - Free Online Classic",
          author: "Louisa May Alcott",
          url: "https://www.gutenberg.org/files/514/514-h/514-h.htm",
          description: "A heartwarming story about family bonds, love, and growing up that will warm your heart"
        },
        {
          title: "Winnie-the-Pooh - Free Online Stories",
          author: "A.A. Milne",
          url: "https://www.gutenberg.org/files/67098/67098-h/67098-h.htm",
          description: "Gentle, whimsical stories that will bring joy and prepare you for reading to your little one"
        }
      ],
      nutrition: [
        {
          title: "Fiber for Digestion",
          content: "Add fruits, vegetables, whole grains to prevent constipation",
          source: "Academy of Nutrition and Dietetics"
        },
        {
          title: "Iron Absorption",
          content: "Combine iron-rich foods with vitamin C sources",
          source: "National Institutes of Health"
        }
      ],
      symptoms: [
        "Constipation may develop",
        "Breast growth continues",
        "Possible mood swings",
        "Clear vaginal discharge normal"
      ],
      tips: [
        "Add 25-35g fiber daily through whole foods",
        "Take gentle walks after meals to aid digestion",
        "Schedule first prenatal appointment (8-10 weeks)",
        "Begin researching health insurance coverage",
        "Start thinking about work maternity leave policies",
        "Consider joining online pregnancy support groups"
      ]
    }
  },
  12: {
    baby: {
      appearance: "Fully formed baby, reflexes developing",
      size: "Size of a plum (5-6cm, 14g)"
    },
    mother: {
      care: "Continue vitamins, start maternity clothes shopping"
    },
    resources: {
      exercises: [
        {
          title: "12 Week Pregnancy Strength Training",
          url: "https://www.youtube.com/watch?v=Y0nO2JWYxtE",
          duration: "30 min",
          type: "Strength Training",
          channel: "Tone and Tighten"
        },
        {
          title: "Second Trimester Prep Yoga Flow",
          url: "https://www.youtube.com/watch?v=usIAGBdvn8c",
          duration: "20 min",
          type: "Prenatal Yoga",
          channel: "Yoga with Adriene"
        }
      ],
      books: [
        {
          title: "Jane Eyre - Free Online Romance",
          author: "Charlotte Brontë",
          url: "https://www.gutenberg.org/files/1260/1260-h/1260-h.htm",
          description: "An inspiring story of independence and love that will captivate and empower you"
        },
        {
          title: "Peter Pan - Free Online Adventure",
          author: "J.M. Barrie",
          url: "https://www.gutenberg.org/files/16/16-h/16-h.htm",
          description: "A magical tale about childhood wonder and imagination - perfect for future mothers"
        }
      ],
      nutrition: [
        {
          title: "Protein Increase",
          content: "Aim for 75-100g protein daily for baby's growth",
          source: "American Dietetic Association"
        },
        {
          title: "Calcium Requirements",
          content: "1000mg daily from dairy, leafy greens, fortified foods",
          source: "National Academy of Sciences"
        }
      ],
      symptoms: [
        "Energy levels may improve",
        "Morning sickness often decreases",
        "Visible belly growth begins",
        "Possible skin changes (darkening)"
      ],
      tips: [
        "Schedule nuchal translucency screening (11-14 weeks)",
        "Start shopping for comfortable, supportive bras",
        "Begin thinking about maternity clothes",
        "Share pregnancy news with close family if desired",
        "Take weekly bump photos for memories",
        "Research prenatal genetic testing options",
        "Start planning for maternity leave from work"
      ]
    }
  },
  16: {
    baby: {
      appearance: "Hair and nails growing, more defined features",
      size: "Size of an avocado (11cm, 100g)"
    },
    mother: {
      care: "Get maternity clothes, use pregnancy pillow"
    },
    resources: {
      exercises: [
        {
          title: "16 Week Prenatal Strength Workout",
          url: "https://www.youtube.com/watch?v=b-eh8TLohJI",
          duration: "25 min",
          type: "Strength Training",
          channel: "Fitness Blender"
        },
        {
          title: "Pelvic Floor Exercises for Pregnancy",
          url: "https://www.youtube.com/watch?v=Uy2ZgOgAL7Q",
          duration: "12 min",
          type: "Pelvic Floor",
          channel: "Physiotherapy"
        }
      ],
      books: [
        {
          title: "Alice's Adventures in Wonderland - Free Online",
          author: "Lewis Carroll",
          url: "https://www.gutenberg.org/files/11/11-h/11-h.htm",
          description: "A whimsical adventure that will spark your imagination and bring smiles during pregnancy"
        },
        {
          title: "Emma - Free Online Romance",
          author: "Jane Austen",
          url: "https://www.gutenberg.org/files/158/158-h/158-h.htm",
          description: "A delightful romantic comedy that will entertain and uplift your spirits"
        }
      ],
      nutrition: [
        {
          title: "DHA for Brain Development",
          content: "200-300mg daily from fish, walnuts, or supplements",
          source: "International Society for the Study of Fatty Acids"
        },
        {
          title: "Balanced Energy",
          content: "Complex carbohydrates for sustained energy throughout day",
          source: "Dietitians of Canada"
        }
      ],
      symptoms: [
        "Possible first baby movements (flutters)",
        "Increased appetite returns",
        "Round ligament pain may begin",
        "Nasal congestion common"
      ],
      tips: [
        "Invest in supportive maternity bras and pregnancy pillow",
        "Begin prenatal massage therapy for comfort",
        "Start researching childcare options early",
        "Schedule anatomy scan ultrasound (18-22 weeks)",
        "Begin baby registry planning and research",
        "Consider maternity support belts for back comfort",
        "Start thinking about baby names and nursery themes"
      ]
    }
  },
  20: {
    baby: {
      appearance: "Protective skin coating, strong bones forming",
      size: "Size of a banana (16cm, 300g)"
    },
    mother: {
      care: "Sleep on side, wear comfortable shoes"
    },
    resources: {
      exercises: [
        {
          title: "20 Week Pregnancy Swimming Exercises",
          url: "https://www.youtube.com/watch?v=w5LmG6c9RsU",
          duration: "30 min",
          type: "Water Exercise",
          channel: "Swimming for Fitness"
        },
        {
          title: "Mid-Pregnancy Strength & Balance",
          url: "https://www.youtube.com/watch?v=Wz6WjQ3e3FA",
          duration: "25 min",
          type: "Balance Training",
          channel: "FitnessBlender"
        }
      ],
      books: [
        {
          title: "The Wonderful Wizard of Oz - Free Online",
          author: "L. Frank Baum",
          url: "https://www.gutenberg.org/files/55/55-h/55-h.htm",
          description: "A magical journey of courage and friendship that will fill you with hope and wonder"
        },
        {
          title: "A Little Princess - Free Online Story",
          author: "Frances Hodgson Burnett",
          url: "https://www.gutenberg.org/files/146/146-h/146-h.htm",
          description: "An inspiring tale of resilience and kindness that will touch your heart"
        }
      ],
      nutrition: [
        {
          title: "Anatomy Scan Preparation",
          content: "Stay well hydrated before ultrasound, eat normally",
          source: "Radiological Society of North America"
        },
        {
          title: "Increased Caloric Needs",
          content: "Add 300-350 healthy calories daily in second trimester",
          source: "Institute of Medicine"
        }
      ],
      symptoms: [
        "Regular baby movements felt",
        "Possible back pain from posture changes",
        "Increased appetite and energy",
        "Possible heartburn begins"
      ],
      tips: [
        "Sleep on left side for optimal blood flow to baby",
        "Wear supportive, comfortable shoes with good arch support",
        "Schedule detailed anatomy scan ultrasound (18-22 weeks)",
        "Start serious baby name discussions and research",
        "Consider professional maternity photography session",
        "Begin researching birthing classes in your area",
        "Start planning nursery layout and baby-proofing needs"
      ]
    }
  },
  24: {
    baby: {
      appearance: "Eyes can respond to light, hearing develops",
      size: "Size of an ear of corn (30cm, 600g)"
    },
    mother: {
      care: "Back pain management, regular movement"
    },
    resources: {
      exercises: [
        {
          title: "24 Week Prenatal Yoga Flow",
          url: "https://www.youtube.com/watch?v=QJJgC7xBKK8",
          duration: "35 min",
          type: "Yoga Practice",
          channel: "Yoga with Adriene"
        },
        {
          title: "Second Trimester Gentle Workout",
          url: "https://www.youtube.com/watch?v=VQBeD1YiuP8",
          duration: "20 min",
          type: "Low Impact",
          channel: "Jessica Smith TV"
        }
      ],
      books: [
        {
          title: "The Secret Garden - Free Uplifting Story",
          author: "Frances Hodgson Burnett",
          url: "https://www.gutenberg.org/files/113/113-h/113-h.htm",
          description: "A beautiful story of healing, growth, and new beginnings perfect for expectant mothers"
        },
        {
          title: "Pollyanna - Free Feel-Good Story",
          author: "Eleanor H. Porter",
          url: "https://www.gutenberg.org/files/1450/1450-h/1450-h.htm",
          description: "An optimistic tale that will fill you with joy and positive thinking"
        }
      ],
      nutrition: [
        {
          title: "Glucose Test Prep",
          content: "Eat normally before test, avoid excessive sugar day before",
          source: "American Diabetes Association"
        },
        {
          title: "Anti-Inflammatory Foods",
          content: "Include berries, leafy greens, fatty fish to reduce swelling",
          source: "Harvard School of Public Health"
        }
      ],
      symptoms: [
        "Possible leg and foot swelling",
        "Shortness of breath with activity",
        "Lower back pain may intensify",
        "Frequent urination returns"
      ],
      tips: [
        "Wear compression socks to reduce swelling",
        "Schedule glucose screening test (24-28 weeks)",
        "Start researching and interviewing pediatricians",
        "Begin serious consideration of maternity photography",
        "Enroll in childbirth education classes",
        "Start preparing older children for new baby",
        "Research and plan for maternity leave details"
      ]
    }
  },
  28: {
    baby: {
      appearance: "Eyes open and close, more chubby appearance",
      size: "Size of an eggplant (35cm, 1kg)"
    },
    mother: {
      care: "Use pregnancy belt, eat frequent small meals"
    },
    resources: {
      exercises: [
        {
          title: "Third Trimester Prenatal Yoga",
          url: "https://www.youtube.com/watch?v=8tUeJdJGWuY",
          duration: "30 min",
          type: "Third Trimester Yoga",
          channel: "Yoga with Adriene"
        },
        {
          title: "Third Trimester Safe Workout",
          url: "https://www.youtube.com/watch?v=OJNcjXTqnLw",
          duration: "25 min",
          type: "Low Impact Exercise",
          channel: "FitnessBlender"
        }
      ],
      books: [
        {
          title: "Heidi - Free Heartwarming Story",
          author: "Johanna Spyri",
          url: "https://www.gutenberg.org/files/1448/1448-h/1448-h.htm",
          description: "A heartwarming tale of love, nature, and healing that will bring you peace"
        },
        {
          title: "Eight Cousins - Free Uplifting Story",
          author: "Louisa May Alcott",
          url: "https://www.gutenberg.org/files/1765/1765-h/1765-h.htm",
          description: "A charming story of family, growth, and happiness perfect for relaxing reading"
        }
      ],
      nutrition: [
        {
          title: "Small Frequent Meals",
          content: "Eat 6 smaller meals to manage heartburn and maintain energy",
          source: "American Pregnancy Association"
        },
        {
          title: "DHA Importance Peaks",
          content: "Ensure 200-300mg DHA daily for rapid brain development",
          source: "International Society for Fat Research"
        }
      ],
      symptoms: [
        "Braxton Hicks contractions begin",
        "Increased heartburn and indigestion",
        "Difficulty finding comfortable sleep positions",
        "Leg cramps, especially at night"
      ],
      tips: [
        "Use pregnancy support belt for back and belly comfort",
        "Eat smaller, more frequent meals to manage heartburn",
        "Start attending regular prenatal classes",
        "Finalize maternity leave plans with employer",
        "Begin preparing nursery and organizing baby items",
        "Practice relaxation and breathing techniques daily",
        "Start thinking about postpartum support system"
      ]
    }
  },
  32: {
    baby: {
      appearance: "Fat layers developing, getting chubbier",
      size: "Size of a large jicama (40cm, 1.7kg)"
    },
    mother: {
      care: "Use multiple pillows for comfort, small portions"
    },
    resources: {
      exercises: [
        {
          title: "32 Week Gentle Prenatal Yoga",
          url: "https://www.youtube.com/watch?v=b5FInF0BKi0",
          duration: "30 min",
          type: "Gentle Yoga",
          channel: "Yoga with Adriene"
        },
        {
          title: "Third Trimester Breathing & Stretches",
          url: "https://www.youtube.com/watch?v=QNz8A8WSeWM",
          duration: "20 min",
          type: "Breathing & Stretching",
          channel: "Move with Nicole"
        }
      ],
      books: [
        {
          title: "What Katy Did - Free Inspiring Story",
          author: "Susan Coolidge",
          url: "https://www.gutenberg.org/files/574/574-h/574-h.htm",
          description: "An inspiring story of resilience and hope that will uplift your spirits"
        },
        {
          title: "Rebecca of Sunnybrook Farm - Free Story",
          author: "Kate Douglas Wiggin",
          url: "https://www.gutenberg.org/files/574/574-h/574-h.htm",
          description: "A cheerful tale of optimism and joy perfect for peaceful reading moments"
        }
      ],
      nutrition: [
        {
          title: "Iron Absorption Optimization",
          content: "Combine iron-rich foods with vitamin C, avoid calcium during iron intake",
          source: "National Institutes of Health"
        },
        {
          title: "Comfort Food Focus",
          content: "Choose easy-to-digest, nutrient-dense foods for comfort",
          source: "Academy of Nutrition and Dietetics"
        }
      ],
      symptoms: [
        "Significant increase in back pain",
        "Shortness of breath from baby's position",
        "Very frequent urination",
        "Possible hemorrhoids developing"
      ],
      tips: [
        "Use multiple pillows for comfortable sleep positioning",
        "Monitor baby's movements daily - track patterns",
        "Start preparing detailed hospital bag checklist",
        "Finalize nursery setup and baby gear organization",
        "Complete interviews and select pediatrician",
        "Discuss birth plan details with healthcare provider",
        "Prepare meals for freezing for postpartum period"
      ]
    }
  },
  36: {
    baby: {
      appearance: "Chubby baby appearance, nearly ready",
      size: "Size of a romaine lettuce (45cm, 2.6kg)"
    },
    mother: {
      care: "Prepare hospital bag, practice relaxation"
    },
    resources: {
      exercises: [
        {
          title: "Late Pregnancy Stretches & Relaxation",
          url: "https://www.youtube.com/watch?v=3nJ6K9l-zlw",
          duration: "25 min",
          type: "Gentle Stretching",
          channel: "Yoga with Adriene"
        },
        {
          title: "36 Week Pregnancy Exercise Routine",
          url: "https://www.youtube.com/watch?v=YA_QE0HlEdc",
          duration: "20 min",
          type: "Gentle Exercise",
          channel: "Jessica Smith TV"
        }
      ],
      books: [
        {
          title: "The Tale of Two Cities - Free Classic",
          author: "Charles Dickens",
          url: "https://www.gutenberg.org/files/98/98-h/98-h.htm",
          description: "A powerful story of love, sacrifice, and hope that will inspire you"
        },
        {
          title: "Persuasion - Free Romance Classic",
          author: "Jane Austen",
          url: "https://www.gutenberg.org/files/105/105-h/105-h.htm",
          description: "A gentle love story perfect for peaceful reading in your final weeks"
        }
      ],
      nutrition: [
        {
          title: "Energy Foods for Labor",
          content: "Stock up on dates, bananas, energy balls for natural labor fuel",
          source: "Evidence Based Birth"
        },
        {
          title: "Final Nutrition Push",
          content: "Maximize nutrient intake for labor strength and recovery",
          source: "International Childbirth Education Association"
        }
      ],
      symptoms: [
        "Baby 'dropping' (lightening) may occur",
        "Increased pelvic pressure and discomfort",
        "Strong nesting instincts emerge",
        "Possible loss of mucus plug"
      ],
      tips: [
        "Pack and recheck hospital bag - keep ready",
        "Practice breathing and relaxation techniques daily",
        "Install car seat and have it professionally inspected",
        "Prepare and freeze postpartum meal plan",
        "Finalize birth plan preferences with healthcare team",
        "Arrange childcare for older children during labor",
        "Complete final work tasks and handover procedures"
      ]
    }
  },
  40: {
    baby: {
      appearance: "Fully developed baby ready for birth",
      size: "Full-term baby (50cm, 3.3kg)"
    },
    mother: {
      care: "Final preparations, stay calm and ready"
    },
    resources: {
      exercises: [
        {
          title: "Final Preparation Birth Positions",
          url: "https://www.youtube.com/watch?v=3nJ6K9l-zlw",
          duration: "15 min",
          type: "Labor Preparation",
          channel: "Yoga with Adriene"
        },
        {
          title: "Full Term Gentle Movement",
          url: "https://www.youtube.com/watch?v=YA_QE0HlEdc",
          duration: "12 min",
          type: "Gentle Movement",
          channel: "Jessica Smith TV"
        }
      ],
      books: [
        {
          title: "Sense and Sensibility - Free Classic",
          author: "Jane Austen",
          url: "https://www.gutenberg.org/files/161/161-h/161-h.htm",
          description: "A beautiful story of love and wisdom to read as you await your baby's arrival"
        },
        {
          title: "Anne of the Island - Free Story",
          author: "L.M. Montgomery",
          url: "https://www.gutenberg.org/files/544/544-h/544-h.htm",
          description: "A heartwarming continuation of Anne's journey, perfect for your final days of pregnancy"
        }
      ],
      nutrition: [
        {
          title: "Labor Energy Snacks",
          content: "Prepare light, easily digestible foods for early labor energy",
          source: "American Pregnancy Association"
        },
        {
          title: "Postpartum Nutrition Prep",
          content: "Stock freezer with nutritious, easy-prep meals for recovery",
          source: "International Lactation Consultant Association"
        }
      ],
      symptoms: [
        "Regular contractions may begin",
        "Water breaking is possible",
        "Bloody show may appear",
        "Intense nesting urges and energy bursts"
      ],
      tips: [
        "Stay calm and trust your body's natural process",
        "Know and watch for true signs of labor onset",
        "Keep emergency contacts and hospital information ready",
        "Prepare mentally and physically for postpartum recovery period",
        "Keep fully packed hospital bag by the door",
        "Ensure all baby gear is assembled and ready",
        "Have support person on standby for labor assistance"
      ]
    }
  }
};

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
  const viewWeek = searchParams.get('week'); // Get week parameter for baby growth section

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
  
  // For baby growth section, use viewWeek if provided, otherwise use calculated week
  let displayWeek = week;
  if (section === 'babygrowth' && viewWeek) {
    displayWeek = parseInt(viewWeek);
  }
  
  let babySize = getBabySize(displayWeek);

  // Calculate trimester based on display week
  let trimester = null;
  if (displayWeek !== null) {
    if (displayWeek < 13) trimester = '1st Trimester';
    else if (displayWeek < 27) trimester = '2nd Trimester';
    else if (displayWeek <= 40) trimester = '3rd Trimester';
    else trimester = 'Post-term'; // Beyond 40 weeks
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

  // Render baby growth section if requested
  if (section === 'babygrowth') {
    // Use the user's actual current week from their LMC
    const currentWeek = week;
    const currentWeekData = weeklyDevelopmentData[currentWeek] || weeklyDevelopmentData[40]; // Fallback to week 40 for post-term

    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
        <UserSidebar 
          week={week} 
          trimester={trimester} 
          activeTab="baby" 
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
                <h1>Baby Growth Development</h1>
                <p className="pregnancy-due-date">Your personalized weekly development tracking</p>
                {currentWeek && (
                  <div className="week-summary-badge">
                    <span className="week-text">Week {currentWeek} of Pregnancy</span>
                    <span className="size-text">Baby is {currentWeekData.baby.size}</span>
                    <span className="trimester-text">{trimester}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="baby-growth-main-section">
            {currentWeek !== null && currentWeek >= 4 && currentWeekData ? (
              <div className="baby-growth-content">
                {/* Hero Section with 3D Visual */}
                <div className="baby-growth-hero">
                  <div className="hero-background">
                    <div className="floating-elements">
                      <div className="floating-heart">💗</div>
                      <div className="floating-star">✨</div>
                      <div className="floating-baby">👶</div>
                    </div>
                  </div>
                  <div className="hero-content">
                    <div className="hero-left">
                      <div className="week-badge">
                        <span className="week-number">{currentWeek}</span>
                        <span className="week-label">WEEKS</span>
                      </div>
                      <h1 className="hero-title">Your Baby This Week</h1>
                      <p className="hero-subtitle">
                        Your baby is the size of a <strong>{currentWeekData.baby.size}</strong>
                      </p>
                      <div className="hero-stats">
                        <div className="hero-stat">
                          <div className="stat-icon">📅</div>
                          <div className="stat-info">
                            <span className="stat-label">Due Date</span>
                            <span className="stat-value">{dueDate}</span>
                          </div>
                        </div>
                        <div className="hero-stat">
                          <div className="stat-icon">⏰</div>
                          <div className="stat-info">
                            <span className="stat-label">Weeks Left</span>
                            <span className="stat-value">{Math.max(0, 40 - currentWeek)}</span>
                          </div>
                        </div>
                        <div className="hero-stat">
                          <div className="stat-icon">🎯</div>
                          <div className="stat-info">
                            <span className="stat-label">Trimester</span>
                            <span className="stat-value">{trimester}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="hero-right">
                      <div className="baby-size-visual">
                        <div className="size-comparison">
                          <div className="size-circle-large">
                            <Baby size={80} className="baby-icon-large" />
                          </div>
                          <div className="size-label-container">
                            <span className="size-current">{currentWeekData.baby.size}</span>
                            <span className="size-description">Current Size</span>
                          </div>
                        </div>
                        <div className="growth-indicator">
                          <div className="progress-ring">
                            <svg className="progress-ring-svg" width="120" height="120">
                              <circle
                                className="progress-ring-background"
                                stroke="#e5e7eb"
                                strokeWidth="8"
                                fill="transparent"
                                r="52"
                                cx="60"
                                cy="60"
                              />
                              <circle
                                className="progress-ring-progress"
                                stroke="url(#gradient)"
                                strokeWidth="8"
                                fill="transparent"
                                r="52"
                                cx="60"
                                cy="60"
                                strokeDasharray="326.726"
                                strokeDashoffset={326.726 - (currentWeek / 40) * 326.726}
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#667eea" />
                                  <stop offset="100%" stopColor="#764ba2" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="progress-text">
                              <span className="progress-percent">{Math.round((currentWeek / 40) * 100)}%</span>
                              <span className="progress-label">Complete</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Baby Development This Week */}
                <div className="development-timeline">
                  <div className="timeline-header">
                    <h2>Your Baby This Week</h2>
                    <p>How your baby looks and what's happening</p>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-item active">
                      <div className="timeline-marker">
                        <Baby size={24} />
                      </div>
                      <div className="timeline-card">
                        <div className="timeline-icon organ-icon">
                          <Baby size={32} />
                        </div>
                        <h3>Baby's Appearance</h3>
                        <p>{currentWeekData.baby.appearance}</p>
                      </div>
                    </div>
                    
                    <div className="timeline-item active">
                      <div className="timeline-marker">
                        <Scale size={24} />
                      </div>
                      <div className="timeline-card">
                        <div className="timeline-icon growth-icon">
                          <Scale size={32} />
                        </div>
                        <h3>Size & Weight</h3>
                        <p>{currentWeekData.baby.size}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mother's Care Tips */}
                <div className="mother-wellness-section">
                  <div className="wellness-header">
                    <div className="header-content">
                      <h2>Essential Care for You</h2>
                      <p>Important things to focus on this week</p>
                    </div>
                    <div className="wellness-avatar">
                      <div className="avatar-circle">
                        <Heart size={40} className="wellness-heart" />
                      </div>
                    </div>
                  </div>

                  <div className="wellness-grid">
                    {/* Care Tips Card */}
                    <div className="wellness-card tips-card full-width">
                      <div className="card-header">
                        <div className="card-icon-wrapper tips-icon">
                          <Star size={24} />
                        </div>
                        <h3>What to Do This Week</h3>
                      </div>
                      <div className="card-body">
                        <p className="tips-main">{currentWeekData.mother.care}</p>
                        
                        {/* Additional Tips */}
                        {currentWeekData.resources?.tips && (
                          <div className="additional-tips">
                            <h4>Week {currentWeek} Essential Tips:</h4>
                            <ul className="tips-list">
                              {currentWeekData.resources.tips.map((tip, index) => (
                                <li key={index} className="tip-item-list">
                                  <span className="tip-bullet">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weekly Resources Section */}
                {currentWeekData.resources && (
                  <div className="weekly-resources-section">
                    <div className="resources-header">
                      <h2>Week {currentWeek} Resources</h2>
                      <p>Curated exercises, books, and guidance for your pregnancy journey</p>
                    </div>

                    <div className="resource-cards-container">
                      {/* Exercise Videos */}
                      {currentWeekData.resources.exercises && (
                        <div className="resource-card exercise-card">
                          <div className="resource-header">
                            <div className="resource-icon exercise-icon">
                              <Activity size={28} />
                            </div>
                            <h4>🏃‍♀️ Safe Exercise Videos</h4>
                            <p>Perfect workouts for week {currentWeek}</p>
                          </div>
                          <div className="resource-content">
                            {currentWeekData.resources.exercises.map((exercise, index) => (
                              <div key={index} className="exercise-item">
                                <h5>{exercise.title}</h5>
                                <div className="exercise-meta">
                                  <span className="meta-tag">{exercise.duration}</span>
                                  <span className="meta-tag">{exercise.type}</span>
                                  <span className="meta-tag">{exercise.channel}</span>
                                </div>
                                <a 
                                  href={exercise.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="exercise-link"
                                >
                                  <span>▶️</span>
                                  Watch Video
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommended Books */}
                      {currentWeekData.resources.books && (
                        <div className="resource-card books-card">
                          <div className="resource-header">
                            <div className="resource-icon books-icon">
                              <BookOpen size={28} />
                            </div>
                            <h4>📚 Uplifting Stories</h4>
                            <p>Free cheerful books to brighten your day</p>
                          </div>
                          <div className="resource-content">
                            {currentWeekData.resources.books.map((book, index) => (
                              <div key={index} className="book-item">
                                <h5>{book.title}</h5>
                                <p className="book-author">by {book.author}</p>
                                <p className="book-description">{book.description}</p>
                                <a 
                                  href={book.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="book-link"
                                >
                                  <span>�</span>
                                  Read Free Online
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            ) : currentWeek < 4 ? (
              <div className="early-pregnancy-info">
                <Baby size={64} className="early-pregnancy-icon" />
                <h3>Early Pregnancy Stage</h3>
                <p>You're in the very early stages of pregnancy (Week {currentWeek || 0}). Detailed development tracking begins from week 4.</p>
                <div className="early-pregnancy-stats">
                  <div className="stat-item">
                    <span className="stat-label">Current Week</span>
                    <span className="stat-value">Week {currentWeek || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Due Date</span>
                    <span className="stat-value">{dueDate || 'Calculating...'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Weeks to Go</span>
                    <span className="stat-value">{40 - (currentWeek || 0)} weeks</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-pregnancy-info">
                <Baby size={64} className="no-info-icon" />
                <h3>Loading Your Pregnancy Information</h3>
                <p>We're calculating your pregnancy week based on your LMC date. Please wait a moment.</p>
                
                {/* Debug information */}
                <div className="pregnancy-debug-info">
                  <p><strong>Debug Information:</strong></p>
                  <p>LMC Date: {pregnancyInfo?.lmc || 'Not provided'}</p>
                  <p>Calculated Week: {week || 'Not calculated'}</p>
                  <p>Current Week: {currentWeek || 'Not set'}</p>
                  <p>Has Week Data: {currentWeekData ? 'Yes' : 'No'}</p>
                  <p>Due Date: {dueDate || 'Not calculated'}</p>
                </div>
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