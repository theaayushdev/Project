import React from 'react';
import './preg.css'; // Import the CSS file

function PregnancySection() {
  return (
    <section id="pregnancy-sections">
      <h2>Pregnancy Journey</h2>

      <div className="trimester-section">
        <h3>First Trimester (Weeks 1-12)</h3>
        <ul>
          <li>
            <strong>What's Happening:</strong>
            Detailed week-by-week breakdown of fetal development (size, milestones).
          </li>
          <li>
            <strong>Body Changes:</strong>
            Information on common early pregnancy symptoms (nausea, fatigue, breast tenderness, frequent urination).
          </li>
          <li>
            <strong>Health &amp; Wellness:</strong>
            Advice on nutrition, hydration, rest, and safe exercise. Information on prenatal vitamins (folic acid).
          </li>
          <li>
            <strong>Important Tests &amp; Screenings:</strong>
            Overview of early ultrasounds, blood tests, and screening options (e.g., NIPT).
          </li>
          <li>
            <strong>Emotional Well-being:</strong>
            Addressing anxiety, mood swings, and the emotional adjustment to pregnancy.
          </li>
          <li>
            <strong>Things to Avoid:</strong>
            Listing substances and activities that can be harmful during the first trimester.
          </li>
          <li>
            <strong>Tips &amp; Advice:</strong>
            Practical tips for managing early symptoms and staying comfortable.
          </li>
        </ul>
      </div>

      <div className="trimester-section">
        <h3>Second Trimester (Weeks 13-27)</h3>
        <ul>
          <li>
            <strong>What's Happening:</strong>
            Continued fetal development, including movement and organ maturation.
          </li>
          <li>
            <strong>Body Changes:</strong>
            Information on the growing bump, backaches, leg cramps, and skin changes.
          </li>
          <li>
            <strong>Health &amp; Wellness:</strong>
            Focus on balanced diet, staying active, and preparing for the later stages.
          </li>
          <li>
            <strong>Important Tests &amp; Screenings:</strong>
            Details about the anatomy scan and gestational diabetes screening.
          </li>
          <li>
            <strong>Baby's Movements:</strong>
            Information on feeling the first kicks and what to expect.
          </li>
          <li>
            <strong>Preparing the Nursery:</strong>
            Ideas and tips for setting up a safe and comfortable space for the baby.
          </li>
          <li>
            <strong>Tips &amp; Advice:</strong>
            Suggestions for comfortable sleeping positions and managing common discomforts.
          </li>
        </ul>
      </div>

      <div className="trimester-section">
        <h3>Third Trimester (Weeks 28-Birth)</h3>
        <ul>
          <li>
            <strong>What's Happening:</strong>
            Final stages of fetal development, including weight gain and positioning for birth.
          </li>
          <li>
            <strong>Body Changes:</strong>
            Information on increased discomfort, swelling, Braxton Hicks contractions, and signs of labor.
          </li>
          <li>
            <strong>Health &amp; Wellness:</strong>
            Advice on monitoring baby's movements, preparing for labor and delivery.
          </li>
          <li>
            <strong>Pre-labor Signs:</strong>
            Explanation of different signs that labor might be approaching.
          </li>
          <li>
            <strong>Packing Your Hospital Bag:</strong>
            A comprehensive checklist of essential items for the hospital stay.
          </li>
          <li>
            <strong>Birth Preferences:</strong>
            Information on different birth options and creating a birth plan.
          </li>
          <li>
            <strong>Tips &amp; Advice:</strong>
            Strategies for managing late-pregnancy discomfort and preparing mentally for labor.
          </li>
        </ul>
      </div>

      <div className="general-info-section">
        <h3>General Pregnancy Information</h3>
        <ul>
          <li><a href="/understanding-conception">Understanding Conception</a></li>
          <li><a href="/early-signs-of-pregnancy">Early Signs of Pregnancy</a></li>
          <li><a href="/prenatal-care">Prenatal Care</a></li>
          <li><a href="/nutrition-during-pregnancy">Nutrition During Pregnancy</a></li>
          <li><a href="/safe-exercise-pregnancy">Safe Exercise During Pregnancy</a></li>
          <li><a href="/common-discomforts-remedies">Common Pregnancy Discomforts and Remedies</a></li>
          <li><a href="/mental-health-pregnancy">Mental Health During Pregnancy</a></li>
          <li><a href="/warning-signs-pregnancy">Warning Signs During Pregnancy</a></li>
          <li><a href="/pregnancy-and-travel">Pregnancy and Travel</a></li>
          <li><a href="/working-while-pregnant">Working While Pregnant</a></li>
          <li><a href="/multiple-pregnancies">Multiple Pregnancies</a></li>
          <li><a href="/pregnancy-loss">Pregnancy Loss</a></li>
        </ul>
      </div>

      <div className="interactive-elements-section">
        <h3>Interactive Elements</h3>
        <ul>
          <li><a href="/due-date-calculator">Due Date Calculator</a></li>
          <li><a href="/symptom-tracker">Symptom Tracker</a></li>
          <li><a href="/weight-gain-tracker">Weight Gain Tracker</a></li>
          <li><a href="/kick-counter">Kick Counter</a></li>
          <li><a href="/qa-section">Q&amp;A Section</a></li>
        </ul>
      </div>

      <div className="important-notes">
        <h3>Important Notes</h3>
        <ul>
          <li>Use clear and easy-to-understand language. Avoid excessive medical jargon.</li>
          <li>Provide accurate and up-to-date information. Cite reliable sources if possible.</li>
          <li className="important">
            <strong>Emphasize the importance of consulting with healthcare professionals. Your website should be a resource, not a replacement for medical advice.</strong>
          </li>
          <li>Consider adding visuals like illustrations and diagrams to make the information more engaging.</li>
          <li>Organize the information logically so users can easily find what they need.</li>
          <li>Ensure the tone is supportive, encouraging, and empathetic.</li>
        </ul>
      </div>
    </section>
  );
}

export default PregnancySection;