import React from "react";
import "./parenting.css";

import { MdChildFriendly, MdLocalDining, MdFavorite, MdTimeline, MdPsychology, MdOutlineLocalLibrary, MdGroups } from "react-icons/md";

const Parenting = () => {
  return (
    <div className="parenting-container">
      <h1 style={{ color: "red" }}>Parenting Page Loaded!</h1>
      <h2>Parenting Features</h2>
      <p>Support and resources for every step of your parenting journey.</p>

      <div className="features-grid">
      <div className="feature-card">
  <MdOutlineLocalLibrary className="icon" />
  <h4>Parenting Guidelines</h4>
  <p>Easy-to-follow daily routines, bonding activities, and expert advice for all stages of your child’s growth.</p>
</div>

        <div className="feature-card">
          <MdChildFriendly className="icon" />
          <h4>Sleep Tips</h4>
          <p>Help your baby get better sleep with expert-backed routines.</p>
        </div>

        <div className="feature-card">
          <MdLocalDining className="icon" />
          <h4>Baby Nutrition</h4>
          <p>From breastfeeding to solids — what to feed and when.</p>
        </div>

        <div className="feature-card">
          <MdFavorite className="icon" />
          <h4>Parenting Styles</h4>
          <p>Explore gentle parenting, mindful discipline, and more.</p>
        </div>

        <div className="feature-card">
          <MdTimeline className="icon" />
          <h4>Milestone Tracker</h4>
          <p>Track your baby’s development month by month.</p>
        </div>

        <div className="feature-card">
          <MdPsychology className="icon" />
          <h4>Parent Mental Health</h4>
          <p>Resources to help you stay strong and supported.</p>
        </div>

        <div className="feature-card">
          <MdOutlineLocalLibrary className="icon" />
          <h4>Parenting Guides</h4>
          <p>Download helpful PDFs and ebooks for new parents.</p>
        </div>

        <div className="feature-card">
          <MdGroups className="icon" />
          <h4>Community Support</h4>
          <p>Join parenting groups and share experiences with others.</p>
        </div>
      </div>
      <div className="guidelines-section">
  <h3>Parenting Guidelines</h3>
  <ul>
    <li>💡 Maintain consistent routines for meals, sleep, and playtime.</li>
    <li>🗣️ Encourage open communication and active listening.</li>
    <li>📚 Spend quality time reading and engaging in learning activities.</li>
    <li>🌱 Promote positive discipline with patience and love.</li>
    <li>💖 Take care of your own mental health to be the best for your child.</li>
  </ul>
</div>

    </div>
  );
};

export default Parenting;

