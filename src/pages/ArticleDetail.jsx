import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserNavbar from "./Usernavbar";
import UserSidebar from "./usersidebar";
import { ArrowLeft, Calendar, Clock, User, Tag, Heart, Share2, Bookmark } from "lucide-react";
import "../cssonly/pregnancydashboard.css";

function ArticleDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const articleId = searchParams.get('id');

  // Pregnancy articles data (same as in dashboard)
  const pregnancyArticles = [
    {
      id: 1,
      title: "Nutrition During Pregnancy: Essential Foods for You and Your Baby",
      category: "Nutrition",
      readTime: "8 min read",
      date: "Jan 28, 2025",
      author: "Dr. Sarah Mitchell, MD",
      excerpt: "Discover the most important nutrients and foods to include in your pregnancy diet for optimal health and development.",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=400&fit=crop",
      content: `
        <h2>Why Nutrition Matters During Pregnancy</h2>
        <p>Proper nutrition during pregnancy is crucial for both maternal health and fetal development. The foods you eat are your baby's main source of nourishment, so it's important to choose foods that are rich in the nutrients your baby needs to grow and develop.</p>
        
        <h3>Essential Nutrients for Pregnancy</h3>
        <h4>1. Folic Acid (Folate)</h4>
        <p><strong>Why it's important:</strong> Helps prevent neural tube defects such as spina bifida and anencephaly.</p>
        <p><strong>Daily requirement:</strong> 400-800 micrograms</p>
        <p><strong>Best sources:</strong> Leafy green vegetables, citrus fruits, beans, fortified cereals, and prenatal vitamins.</p>
        
        <h4>2. Iron</h4>
        <p><strong>Why it's important:</strong> Supports the increased blood volume during pregnancy and prevents iron-deficiency anemia.</p>
        <p><strong>Daily requirement:</strong> 27 milligrams</p>
        <p><strong>Best sources:</strong> Lean red meat, poultry, fish, dried beans, peas, and iron-fortified cereals.</p>
        
        <h4>3. Calcium</h4>
        <p><strong>Why it's important:</strong> Builds strong bones and teeth for your baby and maintains your bone strength.</p>
        <p><strong>Daily requirement:</strong> 1,000 milligrams</p>
        <p><strong>Best sources:</strong> Dairy products, canned fish with bones, fortified foods, and dark green vegetables.</p>
        
        <h4>4. Protein</h4>
        <p><strong>Why it's important:</strong> Supports the growth of fetal tissue, including the brain, and increases blood supply.</p>
        <p><strong>Daily requirement:</strong> 71 grams</p>
        <p><strong>Best sources:</strong> Lean meat, poultry, seafood, eggs, beans, peas, nuts, seeds, and soy products.</p>
        
        <h3>Foods to Include in Your Pregnancy Diet</h3>
        <ul>
          <li><strong>Fruits and vegetables:</strong> Aim for at least 5 servings per day</li>
          <li><strong>Whole grains:</strong> Brown rice, whole wheat bread, oatmeal</li>
          <li><strong>Lean proteins:</strong> Fish, poultry, lean meats, eggs, beans</li>
          <li><strong>Dairy products:</strong> Milk, cheese, yogurt (pasteurized)</li>
          <li><strong>Healthy fats:</strong> Avocados, nuts, olive oil</li>
        </ul>
        
        <h3>Foods to Avoid During Pregnancy</h3>
        <ul>
          <li><strong>Raw or undercooked seafood:</strong> Sushi, raw oysters</li>
          <li><strong>High-mercury fish:</strong> Shark, swordfish, king mackerel</li>
          <li><strong>Raw or undercooked eggs:</strong> Homemade mayonnaise, cookie dough</li>
          <li><strong>Unpasteurized foods:</strong> Soft cheeses, unpasteurized milk</li>
          <li><strong>Alcohol:</strong> No amount is considered safe during pregnancy</li>
          <li><strong>High caffeine:</strong> Limit to 200mg per day (about 1 cup of coffee)</li>
        </ul>
        
        <h3>Sample Daily Meal Plan</h3>
        <h4>Breakfast</h4>
        <p>Whole grain cereal with milk and sliced banana, plus a glass of orange juice.</p>
        
        <h4>Lunch</h4>
        <p>Grilled chicken salad with mixed greens, tomatoes, and whole grain roll.</p>
        
        <h4>Dinner</h4>
        <p>Baked salmon, steamed broccoli, and sweet potato.</p>
        
        <h4>Snacks</h4>
        <p>Greek yogurt with berries, nuts, or whole grain crackers with cheese.</p>
        
        <h3>Tips for Healthy Eating During Pregnancy</h3>
        <ol>
          <li>Take prenatal vitamins as recommended by your healthcare provider</li>
          <li>Eat small, frequent meals to help with nausea</li>
          <li>Stay hydrated by drinking plenty of water</li>
          <li>Listen to your body's hunger and fullness cues</li>
          <li>Don't diet during pregnancy - focus on eating nutritious foods</li>
        </ol>
        
        <p><em>Remember to always consult with your healthcare provider about your specific nutritional needs during pregnancy. Every pregnancy is different, and your doctor can provide personalized recommendations based on your health history and current condition.</em></p>
      `,
      tags: ["nutrition", "health", "diet", "prenatal"],
      featured: true
    },
    {
      id: 2,
      title: "First Trimester: What to Expect and How to Cope",
      category: "Pregnancy Stages",
      readTime: "6 min read",
      date: "Jan 26, 2025",
      author: "Dr. Emily Rodriguez, OB-GYN",
      excerpt: "Navigate the first trimester with confidence. Learn about common symptoms and helpful coping strategies.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
      content: `
        <h2>Welcome to Your First Trimester</h2>
        <p>The first trimester spans from conception to 12 weeks of pregnancy. This is an exciting and sometimes overwhelming time as your body begins to change and adapt to support your growing baby.</p>
        
        <h3>What's Happening to Your Baby</h3>
        <h4>Weeks 1-4: Conception and Implantation</h4>
        <ul>
          <li>Fertilization occurs</li>
          <li>The embryo implants in the uterine wall</li>
          <li>Basic structures begin to form</li>
        </ul>
        
        <h4>Weeks 5-8: Organ Development</h4>
        <ul>
          <li>Heart begins to beat (around week 6)</li>
          <li>Brain and nervous system develop</li>
          <li>Arms and legs begin to form</li>
          <li>Major organs start developing</li>
        </ul>
        
        <h4>Weeks 9-12: Rapid Growth</h4>
        <ul>
          <li>Baby is now called a fetus</li>
          <li>All major organs are formed</li>
          <li>Fingers and toes develop</li>
          <li>Baby's length doubles</li>
        </ul>
        
        <h3>Common First Trimester Symptoms</h3>
        <h4>Morning Sickness</h4>
        <p><strong>What it is:</strong> Nausea and vomiting, often worse in the morning but can occur any time.</p>
        <p><strong>When it occurs:</strong> Usually starts around week 6 and improves by week 12-14.</p>
        <p><strong>Coping strategies:</strong></p>
        <ul>
          <li>Eat small, frequent meals</li>
          <li>Keep crackers by your bedside</li>
          <li>Try ginger tea or ginger supplements</li>
          <li>Avoid triggers like strong smells</li>
        </ul>
        
        <h4>Fatigue</h4>
        <p><strong>What it is:</strong> Overwhelming tiredness and need for sleep.</p>
        <p><strong>Why it happens:</strong> Rising progesterone levels and increased metabolic demands.</p>
        <p><strong>Coping strategies:</strong></p>
        <ul>
          <li>Get plenty of rest - aim for 8-9 hours of sleep</li>
          <li>Take short naps when possible</li>
          <li>Maintain a regular sleep schedule</li>
          <li>Light exercise can boost energy</li>
        </ul>
        
        <h4>Breast Changes</h4>
        <p><strong>What to expect:</strong> Tenderness, swelling, and darkening of nipples.</p>
        <p><strong>Coping strategies:</strong></p>
        <ul>
          <li>Wear a supportive, well-fitting bra</li>
          <li>Consider a sports bra for sleeping</li>
          <li>Use cold compresses for tenderness</li>
        </ul>
        
        <h4>Frequent Urination</h4>
        <p><strong>Why it happens:</strong> Increased blood flow to kidneys and pressure on bladder.</p>
        <p><strong>Coping strategies:</strong></p>
        <ul>
          <li>Don't reduce fluid intake</li>
          <li>Lean forward when urinating to empty bladder completely</li>
          <li>Avoid caffeine, which can increase urination</li>
        </ul>
        
        <h3>Emotional Changes</h3>
        <p>It's normal to experience a wide range of emotions during the first trimester:</p>
        <ul>
          <li><strong>Mood swings:</strong> Due to hormonal changes</li>
          <li><strong>Anxiety:</strong> About the pregnancy and upcoming changes</li>
          <li><strong>Excitement:</strong> About becoming a parent</li>
          <li><strong>Worry:</strong> About the baby's health and development</li>
        </ul>
        
        <h3>Important First Trimester Milestones</h3>
        <h4>Prenatal Appointments</h4>
        <ul>
          <li><strong>First appointment:</strong> Usually around 8-10 weeks</li>
          <li><strong>What to expect:</strong> Medical history, physical exam, blood tests, urine tests</li>
          <li><strong>Ultrasound:</strong> May be done to confirm pregnancy and due date</li>
        </ul>
        
        <h4>Prenatal Screening Tests</h4>
        <ul>
          <li><strong>First trimester screening:</strong> Blood test and ultrasound (weeks 11-14)</li>
          <li><strong>Chorionic villus sampling (CVS):</strong> Optional genetic test (weeks 10-13)</li>
        </ul>
        
        <h3>Self-Care Tips for the First Trimester</h3>
        <ol>
          <li><strong>Start prenatal vitamins:</strong> Especially folic acid</li>
          <li><strong>Eat well:</strong> Focus on nutritious foods even if appetite is poor</li>
          <li><strong>Stay hydrated:</strong> Drink plenty of water</li>
          <li><strong>Get regular exercise:</strong> As approved by your doctor</li>
          <li><strong>Avoid harmful substances:</strong> Alcohol, smoking, illegal drugs</li>
          <li><strong>Manage stress:</strong> Practice relaxation techniques</li>
          <li><strong>Get support:</strong> Talk to family, friends, or join pregnancy groups</li>
        </ol>
        
        <h3>When to Call Your Doctor</h3>
        <p>Contact your healthcare provider if you experience:</p>
        <ul>
          <li>Heavy bleeding or cramping</li>
          <li>Severe nausea and vomiting that prevents eating or drinking</li>
          <li>High fever (over 101°F)</li>
          <li>Severe abdominal pain</li>
          <li>Persistent headaches</li>
          <li>Vision changes</li>
        </ul>
        
        <p><em>Remember, every pregnancy is unique. What's normal for one person may not be normal for another. Always consult with your healthcare provider about any concerns or questions you may have.</em></p>
      `,
      tags: ["first trimester", "symptoms", "development"],
      featured: true
    },
    {
      id: 3,
      title: "Exercise and Fitness During Pregnancy: Safe Practices",
      category: "Fitness",
      readTime: "7 min read",
      date: "Jan 24, 2025",
      author: "Lisa Thompson, Certified Prenatal Fitness Instructor",
      excerpt: "Stay active safely during pregnancy with these expert-recommended exercises and guidelines.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
      content: `
        <h2>Benefits of Exercise During Pregnancy</h2>
        <p>Regular physical activity during pregnancy offers numerous benefits for both you and your baby. Staying active can help you feel better, prepare your body for labor, and reduce the risk of certain pregnancy complications.</p>
        
        <h3>Benefits for Mom</h3>
        <ul>
          <li>Improved mood and energy levels</li>
          <li>Better sleep quality</li>
          <li>Reduced back pain and discomfort</li>
          <li>Decreased risk of gestational diabetes</li>
          <li>Lower risk of excessive weight gain</li>
          <li>Reduced risk of preeclampsia</li>
          <li>Shorter labor and delivery</li>
          <li>Faster postpartum recovery</li>
        </ul>
        
        <h3>Benefits for Baby</h3>
        <ul>
          <li>Improved brain development</li>
          <li>Better cardiovascular health</li>
          <li>Reduced risk of childhood obesity</li>
          <li>Enhanced motor skills development</li>
        </ul>
        
        <h3>Safe Exercises During Pregnancy</h3>
        <h4>Low-Impact Cardio Activities</h4>
        <p><strong>Walking:</strong> One of the safest exercises throughout pregnancy.</p>
        <ul>
          <li>Start with 10-15 minutes and gradually increase</li>
          <li>Aim for 30 minutes most days of the week</li>
          <li>Wear supportive shoes and stay hydrated</li>
        </ul>
        
        <p><strong>Swimming:</strong> Excellent full-body workout with minimal joint stress.</p>
        <ul>
          <li>Provides natural support for your growing belly</li>
          <li>Reduces swelling and joint pain</li>
          <li>Avoid diving and jumping into the pool</li>
        </ul>
        
        <p><strong>Stationary Cycling:</strong> Safe alternative to outdoor biking.</p>
        <ul>
          <li>Lower risk of falling compared to regular cycling</li>
          <li>Adjust seat height as belly grows</li>
          <li>Monitor intensity - you should be able to hold a conversation</li>
        </ul>
        
        <h4>Strength Training</h4>
        <p><strong>Benefits:</strong> Maintains muscle tone, supports posture, and prepares body for labor.</p>
        <p><strong>Guidelines:</strong></p>
        <ul>
          <li>Use lighter weights with more repetitions</li>
          <li>Avoid lying flat on your back after the first trimester</li>
          <li>Focus on proper form over heavy lifting</li>
          <li>Include exercises for core, back, and pelvic floor</li>
        </ul>
        
        <h4>Prenatal Yoga</h4>
        <p><strong>Benefits:</strong> Improves flexibility, reduces stress, and teaches breathing techniques.</p>
        <p><strong>Safe poses include:</strong></p>
        <ul>
          <li>Cat-cow stretches</li>
          <li>Modified child's pose</li>
          <li>Side-lying poses</li>
          <li>Gentle twists</li>
        </ul>
        
        <p><strong>Poses to avoid:</strong></p>
        <ul>
          <li>Deep backbends</li>
          <li>Poses lying on your back (after first trimester)</li>
          <li>Hot yoga or Bikram yoga</li>
          <li>Deep twists</li>
        </ul>
        
        <h3>Exercise Guidelines by Trimester</h3>
        <h4>First Trimester (Weeks 1-12)</h4>
        <ul>
          <li>Continue your regular exercise routine if you were active before pregnancy</li>
          <li>Start slowly if you're new to exercise</li>
          <li>Listen to your body - fatigue is common</li>
          <li>Avoid overheating and stay hydrated</li>
        </ul>
        
        <h4>Second Trimester (Weeks 13-26)</h4>
        <ul>
          <li>Often the best time for exercise - energy returns</li>
          <li>Modify exercises to accommodate growing belly</li>
          <li>Avoid lying flat on your back</li>
          <li>Focus on posture and balance</li>
        </ul>
        
        <h4>Third Trimester (Weeks 27-40)</h4>
        <ul>
          <li>Reduce intensity as needed</li>
          <li>Focus on comfort and safety</li>
          <li>Prepare for labor with pelvic floor exercises</li>
          <li>Continue with walking and gentle stretching</li>
        </ul>
        
        <h3>Exercises to Avoid During Pregnancy</h3>
        <h4>High-Risk Activities</h4>
        <ul>
          <li><strong>Contact sports:</strong> Soccer, basketball, hockey</li>
          <li><strong>Activities with fall risk:</strong> Skiing, horseback riding, gymnastics</li>
          <li><strong>Scuba diving:</strong> Risk of decompression sickness</li>
          <li><strong>High-altitude activities:</strong> Above 6,000 feet</li>
        </ul>
        
        <h4>Specific Movements to Avoid</h4>
        <ul>
          <li>Exercises lying flat on your back (after first trimester)</li>
          <li>Heavy lifting or straining</li>
          <li>Jumping or bouncing movements</li>
          <li>Deep knee bends or full sit-ups</li>
          <li>Activities requiring sudden direction changes</li>
        </ul>
        
        <h3>Warning Signs to Stop Exercising</h3>
        <p>Stop exercising immediately and contact your doctor if you experience:</p>
        <ul>
          <li>Vaginal bleeding</li>
          <li>Chest pain or trouble breathing</li>
          <li>Dizziness or fainting</li>
          <li>Severe headache</li>
          <li>Calf pain or swelling</li>
          <li>Regular painful contractions</li>
          <li>Fluid leaking from the vagina</li>
        </ul>
        
        <h3>Sample Pregnancy Workout Routine</h3>
        <h4>Warm-up (5 minutes)</h4>
        <ul>
          <li>Gentle marching in place</li>
          <li>Arm circles</li>
          <li>Shoulder rolls</li>
        </ul>
        
        <h4>Cardio (15-20 minutes)</h4>
        <ul>
          <li>Walking or stationary cycling</li>
          <li>Low-impact dance</li>
          <li>Swimming</li>
        </ul>
        
        <h4>Strength Training (10-15 minutes)</h4>
        <ul>
          <li>Modified push-ups against wall</li>
          <li>Seated rows with resistance band</li>
          <li>Squats with chair support</li>
          <li>Pelvic tilts</li>
        </ul>
        
        <h4>Cool-down and Stretching (5-10 minutes)</h4>
        <ul>
          <li>Gentle yoga poses</li>
          <li>Deep breathing exercises</li>
          <li>Calf and hamstring stretches</li>
        </ul>
        
        <h3>Tips for Safe Exercise</h3>
        <ol>
          <li><strong>Get doctor's approval:</strong> Always consult your healthcare provider before starting any exercise program</li>
          <li><strong>Start gradually:</strong> Begin with 10-15 minutes and slowly increase</li>
          <li><strong>Stay hydrated:</strong> Drink water before, during, and after exercise</li>
          <li><strong>Avoid overheating:</strong> Exercise in cool, well-ventilated areas</li>
          <li><strong>Eat adequately:</strong> Don't exercise on an empty stomach</li>
          <li><strong>Listen to your body:</strong> Rest when you need to</li>
          <li><strong>Modify as needed:</strong> Adjust exercises as your body changes</li>
        </ol>
        
        <p><em>Remember, the goal of exercise during pregnancy is to maintain fitness and prepare for labor, not to achieve peak performance. Always prioritize safety and comfort, and don't hesitate to modify or stop activities that don't feel right for your body.</em></p>
      `,
      tags: ["exercise", "fitness", "prenatal yoga", "health"],
      featured: false
    },
    {
      id: 4,
      title: "Prenatal Vitamins: A Complete Guide",
      category: "Health",
      readTime: "5 min read",
      date: "Jan 22, 2025",
      author: "Dr. Michael Chen, Nutritionist",
      excerpt: "Everything you need to know about prenatal vitamins and their importance for a healthy pregnancy.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=400&fit=crop",
      content: `
        <h2>Why Prenatal Vitamins Are Essential</h2>
        <p>Prenatal vitamins are specially formulated supplements designed to support the increased nutritional needs during pregnancy. Even with a healthy diet, it can be challenging to get all the nutrients you and your baby need from food alone.</p>
        
        <h3>Key Nutrients in Prenatal Vitamins</h3>
        <h4>Folic Acid (Folate)</h4>
        <p><strong>Recommended amount:</strong> 400-800 mcg daily</p>
        <p><strong>Benefits:</strong> Prevents neural tube defects, supports brain and spinal cord development</p>
        <p><strong>Best time to start:</strong> At least one month before conception</p>
        
        <h4>Iron</h4>
        <p><strong>Recommended amount:</strong> 27 mg daily</p>
        <p><strong>Benefits:</strong> Prevents anemia, supports increased blood volume, delivers oxygen to baby</p>
        <p><strong>Tip:</strong> Take with vitamin C to improve absorption</p>
        
        <h4>Calcium</h4>
        <p><strong>Recommended amount:</strong> 1,000 mg daily</p>
        <p><strong>Benefits:</strong> Builds baby's bones and teeth, maintains maternal bone health</p>
        <p><strong>Note:</strong> Some prenatal vitamins may not contain the full amount</p>
        
        <h4>Vitamin D</h4>
        <p><strong>Recommended amount:</strong> 600 IU daily</p>
        <p><strong>Benefits:</strong> Supports bone development, immune function</p>
        <p><strong>Sources:</strong> Sunlight, fortified foods, supplements</p>
        
        <h4>DHA (Docosahexaenoic Acid)</h4>
        <p><strong>Recommended amount:</strong> 200-300 mg daily</p>
        <p><strong>Benefits:</strong> Crucial for brain and eye development</p>
        <p><strong>Sources:</strong> Fish oil, algae-based supplements</p>
        
        <h3>When to Start Taking Prenatal Vitamins</h3>
        <ul>
          <li><strong>Ideally:</strong> Start 1-3 months before trying to conceive</li>
          <li><strong>At minimum:</strong> As soon as you know you're pregnant</li>
          <li><strong>Continue:</strong> Throughout pregnancy and while breastfeeding</li>
        </ul>
        
        <h3>How to Choose the Right Prenatal Vitamin</h3>
        <h4>Look for these key ingredients:</h4>
        <ul>
          <li>400-800 mcg folic acid</li>
          <li>27 mg iron</li>
          <li>1,000 mg calcium</li>
          <li>600 IU vitamin D</li>
          <li>200-300 mg DHA</li>
          <li>15 mg zinc</li>
          <li>1.9 mg vitamin B6</li>
          <li>2.6 mcg vitamin B12</li>
        </ul>
        
        <h4>Consider your needs:</h4>
        <ul>
          <li><strong>If you're vegetarian/vegan:</strong> Look for B12, iron, and algae-based DHA</li>
          <li><strong>If you have morning sickness:</strong> Try gummy vitamins or smaller doses</li>
          <li><strong>If you have allergies:</strong> Check for allergen-free options</li>
        </ul>
        
        <h3>Tips for Taking Prenatal Vitamins</h3>
        <h4>Timing</h4>
        <ul>
          <li>Take with food to reduce nausea</li>
          <li>Take with a full glass of water</li>
          <li>Consider taking at bedtime if they cause nausea</li>
          <li>Split doses if recommended by your doctor</li>
        </ul>
        
        <h4>Managing Side Effects</h4>
        <p><strong>Nausea:</strong></p>
        <ul>
          <li>Take with food or before bed</li>
          <li>Try a different brand or formulation</li>
          <li>Consider gummy vitamins</li>
        </ul>
        
        <p><strong>Constipation (from iron):</strong></p>
        <ul>
          <li>Increase fiber intake</li>
          <li>Drink more water</li>
          <li>Exercise regularly</li>
          <li>Talk to your doctor about stool softeners</li>
        </ul>
        
        <h3>Foods vs. Supplements</h3>
        <p>While prenatal vitamins are important, they should supplement, not replace, a healthy diet. Focus on getting nutrients from food sources when possible:</p>
        
        <h4>Folate-rich foods:</h4>
        <ul>
          <li>Leafy green vegetables</li>
          <li>Citrus fruits</li>
          <li>Beans and legumes</li>
          <li>Fortified cereals</li>
        </ul>
        
        <h4>Iron-rich foods:</h4>
        <ul>
          <li>Lean red meat</li>
          <li>Poultry</li>
          <li>Fish</li>
          <li>Spinach</li>
          <li>Beans</li>
        </ul>
        
        <h4>Calcium-rich foods:</h4>
        <ul>
          <li>Dairy products</li>
          <li>Canned fish with bones</li>
          <li>Dark leafy greens</li>
          <li>Fortified plant milks</li>
        </ul>
        
        <h3>Special Considerations</h3>
        <h4>Multiple Pregnancies</h4>
        <p>If you're carrying twins or multiples, you may need higher doses of certain nutrients. Consult your healthcare provider for personalized recommendations.</p>
        
        <h4>Medical Conditions</h4>
        <p>Certain conditions may require specialized prenatal vitamins:</p>
        <ul>
          <li><strong>Anemia:</strong> Higher iron content</li>
          <li><strong>Neural tube defect history:</strong> Higher folic acid (4mg)</li>
          <li><strong>Vegetarian diet:</strong> B12, iron, and DHA supplementation</li>
        </ul>
        
        <h3>Common Myths About Prenatal Vitamins</h3>
        <p><strong>Myth:</strong> "If I eat a healthy diet, I don't need prenatal vitamins."</p>
        <p><strong>Truth:</strong> Even healthy diets may not provide adequate amounts of all nutrients needed during pregnancy.</p>
        
        <p><strong>Myth:</strong> "More is always better."</p>
        <p><strong>Truth:</strong> Some vitamins can be harmful in large doses. Stick to recommended amounts.</p>
        
        <p><strong>Myth:</strong> "All prenatal vitamins are the same."</p>
        <p><strong>Truth:</strong> Formulations vary significantly between brands and types.</p>
        
        <p><em>Always consult with your healthcare provider before starting any supplement regimen. They can recommend the best prenatal vitamin based on your individual needs, diet, and health history.</em></p>
      `,
      tags: ["prenatal vitamins", "supplements", "health", "nutrition"],
      featured: false
    },
    {
      id: 5,
      title: "Second Trimester: The Golden Period of Pregnancy",
      category: "Pregnancy Stages",
      readTime: "7 min read",
      date: "Jan 20, 2025",
      author: "Dr. Jennifer Walsh, Maternal-Fetal Medicine",
      excerpt: "Discover why the second trimester is often considered the most enjoyable phase of pregnancy.",
      image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=400&fit=crop",
      content: `
        <h2>Welcome to the Second Trimester</h2>
        <p>The second trimester, spanning from weeks 13 to 26, is often called the "golden period" of pregnancy. Many women find this the most enjoyable phase as early pregnancy symptoms typically subside and energy levels return.</p>
        
        <h3>What's Happening to Your Baby</h3>
        <h4>Weeks 13-16: Major Development</h4>
        <ul>
          <li>Baby's sex can be determined on ultrasound</li>
          <li>Facial features become more defined</li>
          <li>Baby can make facial expressions</li>
          <li>Limbs are fully formed and functional</li>
          <li>Baby begins to hear sounds</li>
        </ul>
        
        <h4>Weeks 17-20: The Anatomy Scan</h4>
        <ul>
          <li>Major organs continue to develop</li>
          <li>Baby's movements become stronger</li>
          <li>Detailed ultrasound checks for abnormalities</li>
          <li>Baby's skin develops protective coating (vernix)</li>
          <li>Hair and nails begin to grow</li>
        </ul>
        
        <h4>Weeks 21-24: Rapid Growth</h4>
        <ul>
          <li>Baby's hearing is fully developed</li>
          <li>Baby responds to sounds and music</li>
          <li>Lung development continues</li>
          <li>Baby's movements are clearly felt</li>
          <li>Sleep-wake cycles begin</li>
        </ul>
        
        <h4>Weeks 25-26: Preparing for Viability</h4>
        <ul>
          <li>Baby's eyes begin to open</li>
          <li>Brain development accelerates</li>
          <li>Baby reaches viability milestone</li>
          <li>Stronger, more coordinated movements</li>
          <li>Baby may respond to touch</li>
        </ul>
        
        <h3>Changes in Your Body</h3>
        <h4>Physical Changes</h4>
        <p><strong>Growing Belly:</strong> Your baby bump becomes more noticeable as your uterus expands.</p>
        <p><strong>Weight Gain:</strong> Steady weight gain of about 1-2 pounds per week.</p>
        <p><strong>Breast Changes:</strong> Continued growth and darkening of areolas.</p>
        <p><strong>Skin Changes:</strong> Possible appearance of pregnancy "glow" and darkening of certain areas.</p>
        
        <h4>Symptoms You Might Experience</h4>
        <p><strong>Round Ligament Pain:</strong> Sharp pains in lower abdomen as ligaments stretch.</p>
        <ul>
          <li>Usually occurs when changing positions quickly</li>
          <li>More common on the right side</li>
          <li>Rest and gentle stretching can help</li>
        </ul>
        
        <p><strong>Back Pain:</strong> As your center of gravity shifts and posture changes.</p>
        <ul>
          <li>Use proper posture and supportive shoes</li>
          <li>Sleep with pillows for support</li>
          <li>Consider prenatal massage</li>
        </ul>
        
        <p><strong>Heartburn:</strong> As your growing uterus puts pressure on your stomach.</p>
        <ul>
          <li>Eat smaller, more frequent meals</li>
          <li>Avoid spicy and acidic foods</li>
          <li>Don't lie down immediately after eating</li>
        </ul>
        
        <p><strong>Leg Cramps:</strong> Often occurring at night, especially in calves.</p>
        <ul>
          <li>Stretch before bed</li>
          <li>Stay hydrated</li>
          <li>Ensure adequate calcium and magnesium intake</li>
        </ul>
        
        <h3>Feeling Your Baby Move</h3>
        <h4>First Movements (Quickening)</h4>
        <p><strong>When:</strong> Usually between 16-20 weeks (earlier for second pregnancies)</p>
        <p><strong>What it feels like:</strong> Flutter, bubbles, or gentle tapping sensations</p>
        <p><strong>Frequency:</strong> Initially sporadic, becoming more regular over time</p>
        
        <h4>Tracking Movement</h4>
        <ul>
          <li>Pay attention to your baby's activity patterns</li>
          <li>Note when baby is most active (often after meals)</li>
          <li>Contact your doctor if movements decrease significantly</li>
          <li>Formal kick counts usually start in third trimester</li>
        </ul>
        
        <h3>Important Second Trimester Tests</h3>
        <h4>Anatomy Scan (18-22 weeks)</h4>
        <p><strong>Purpose:</strong> Detailed examination of baby's organs and development</p>
        <p><strong>What's checked:</strong></p>
        <ul>
          <li>Brain and spine development</li>
          <li>Heart structure and function</li>
          <li>Kidney and bladder function</li>
          <li>Limb development</li>
          <li>Placenta position</li>
          <li>Amniotic fluid levels</li>
        </ul>
        
        <h4>Glucose Screening (24-28 weeks)</h4>
        <p><strong>Purpose:</strong> Screen for gestational diabetes</p>
        <p><strong>Process:</strong> Drink glucose solution and have blood drawn after one hour</p>
        <p><strong>Follow-up:</strong> If elevated, a longer glucose tolerance test may be needed</p>
        
        <h4>Optional Tests</h4>
        <ul>
          <li><strong>Amniocentesis (15-20 weeks):</strong> Genetic testing if indicated</li>
          <li><strong>Fetal echocardiogram:</strong> Detailed heart examination if needed</li>
          <li><strong>Cervical length check:</strong> If at risk for preterm birth</li>
        </ul>
        
        <h3>Lifestyle and Self-Care</h3>
        <h4>Exercise Recommendations</h4>
        <ul>
          <li>Continue regular exercise as tolerated</li>
          <li>Focus on low-impact activities</li>
          <li>Avoid contact sports and activities with fall risk</li>
          <li>Stay hydrated and avoid overheating</li>
          <li>Listen to your body and rest when needed</li>
        </ul>
        
        <h4>Nutrition Guidelines</h4>
        <ul>
          <li>Increase caloric intake by about 300-500 calories</li>
          <li>Focus on nutrient-dense foods</li>
          <li>Continue prenatal vitamins</li>
          <li>Stay hydrated with 8-10 glasses of water daily</li>
          <li>Limit caffeine to 200mg per day</li>
        </ul>
        
        <h4>Sleep and Comfort</h4>
        <ul>
          <li>Use pregnancy pillows for support</li>
          <li>Sleep on your side (preferably left)</li>
          <li>Elevate your head if experiencing heartburn</li>
          <li>Maintain a consistent bedtime routine</li>
        </ul>
        
        <h3>Preparing for Baby</h3>
        <h4>Second Trimester To-Do List</h4>
        <ul>
          <li>Start planning your nursery</li>
          <li>Research pediatricians</li>
          <li>Consider childbirth education classes</li>
          <li>Update your birth plan preferences</li>
          <li>Start thinking about baby names</li>
          <li>Plan your maternity leave</li>
          <li>Consider life insurance updates</li>
        </ul>
        
        <h4>Shopping Considerations</h4>
        <ul>
          <li>Maternity clothes for your growing belly</li>
          <li>Supportive maternity bras</li>
          <li>Comfortable, supportive shoes</li>
          <li>Pregnancy pillow for better sleep</li>
          <li>Beginning baby registry research</li>
        </ul>
        
        <h3>When to Call Your Doctor</h3>
        <p>Contact your healthcare provider if you experience:</p>
        <ul>
          <li>Persistent severe headaches</li>
          <li>Vision changes or spots</li>
          <li>Severe swelling of hands or face</li>
          <li>Persistent vomiting</li>
          <li>Signs of urinary tract infection</li>
          <li>Decreased fetal movement after 20 weeks</li>
          <li>Bleeding or spotting</li>
          <li>Severe abdominal pain</li>
          <li>Signs of preterm labor</li>
        </ul>
        
        <h3>Emotional Well-being</h3>
        <p>The second trimester often brings emotional stability, but it's normal to experience:</p>
        <ul>
          <li><strong>Excitement:</strong> About feeling baby move and upcoming ultrasounds</li>
          <li><strong>Anxiety:</strong> About test results and baby's health</li>
          <li><strong>Body image concerns:</strong> As your body continues to change</li>
          <li><strong>Relationship adjustments:</strong> As you and your partner prepare for parenthood</li>
        </ul>
        
        <p><em>The second trimester is an ideal time to enjoy your pregnancy, bond with your baby, and prepare for the exciting journey ahead. Take advantage of your increased energy to accomplish important tasks while also taking time to rest and enjoy this special time.</em></p>
      `,
      tags: ["second trimester", "development", "energy", "movements"],
      featured: true
    }
    // Continue with more articles...
  ];

  const article = pregnancyArticles.find(a => a.id === parseInt(articleId));

  if (!article) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
        <UserSidebar activeTab="articles" />
        <div style={{ flex: 1, marginLeft: 240, padding: "32px 40px" }}>
          <UserNavbar />
          <div className="article-not-found">
            <h1>Article Not Found</h1>
            <p>The article you're looking for doesn't exist.</p>
            <button 
              onClick={() => navigate('/pregnancydashboard?section=articles')}
              className="articles-read-more"
            >
              Back to Articles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <UserSidebar activeTab="articles" />
      <div style={{ flex: 1, marginLeft: 240, padding: "32px 40px" }}>
        <UserNavbar />
        
        {/* Navigation Header */}
        <div className="article-detail-header">
          <button 
            onClick={() => navigate('/pregnancydashboard?section=articles')}
            className="article-back-btn"
          >
            <ArrowLeft size={16} />
            Back to Articles
          </button>
        </div>

        {/* Article Content */}
        <article className="article-detail-container">
          {/* Article Header */}
          <header className="article-detail-header-content">
            <div className="article-detail-meta">
              <span className="article-detail-category">{article.category}</span>
              <span className="article-detail-date">
                <Calendar size={14} />
                {article.date}
              </span>
              <span className="article-detail-read-time">
                <Clock size={14} />
                {article.readTime}
              </span>
            </div>
            
            <h1 className="article-detail-title">{article.title}</h1>
            
            <div className="article-detail-author">
              <User size={16} />
              <span>By {article.author}</span>
            </div>
            
            <div className="article-detail-excerpt">
              {article.excerpt}
            </div>
            
            {/* Article Actions */}
            <div className="article-detail-actions">
              <button className="article-action-btn">
                <Heart size={16} />
                Like
              </button>
              <button className="article-action-btn">
                <Bookmark size={16} />
                Save
              </button>
              <button className="article-action-btn">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </header>

          {/* Article Image */}
          <div className="article-detail-image">
            <img src={article.image} alt={article.title} />
          </div>

          {/* Article Body */}
          <div 
            className="article-detail-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Tags */}
          <div className="article-detail-tags">
            <div className="article-tags-label">
              <Tag size={16} />
              Tags:
            </div>
            <div className="article-tags-list">
              {article.tags.map(tag => (
                <span key={tag} className="article-detail-tag">#{tag}</span>
              ))}
            </div>
          </div>

          {/* Navigation to other articles */}
          <div className="article-detail-navigation">
            <button 
              onClick={() => navigate('/pregnancydashboard?section=articles')}
              className="articles-read-more"
            >
              View All Articles
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

export default ArticleDetail;
