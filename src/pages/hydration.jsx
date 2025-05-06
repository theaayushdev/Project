import React, { useState } from "react";
import "../cssonly/hydration.css";

function HydrationTracker() {
  const [glasses, setGlasses] = useState(0);
  const goal = 8; // Ideal daily goal

  const handleIncrease = () => {
    if (glasses < goal) setGlasses(glasses + 1);
  };

  const handleDecrease = () => {
    if (glasses > 0) setGlasses(glasses - 1);
  };

  return (
    <div className="hydration-container">
      <h2>Daily Hydration Tracker</h2>
      <p>Goal: {goal} glasses | Current: {glasses}/{goal}</p>

      <div className={`hydration-circle ${glasses === goal ? "rotate" : ""}`}>
        💧 {/* Can replace with bottle or animation */}
      </div>

      <div className="hydration-buttons">
        <button onClick={handleDecrease}>-</button>
        <button onClick={handleIncrease}>+</button>
      </div>

      {glasses === goal && <p className="goal-message">You've reached your hydration goal! 🎉</p>}
    </div>
  );
}

export default HydrationTracker;
