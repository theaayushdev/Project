import React, { useState } from "react";
import "../cssonly/moodtracker.css"


function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState("");
  const [journalEntry, setJournalEntry] = useState("");

  const moodOptions = ["Happy 😊", "Anxious 😟", "Tired 😴", "Excited 🤩", "Calm 😌"];

  return (
    <div className="mood-tracker-container">
      <h2>Today's Mood</h2>
      <p>Select how you're feeling today:</p>
      
      <div className="mood-options">
        {moodOptions.map((mood, index) => (
          <button key={index} onClick={() => setSelectedMood(mood)} className={selectedMood === mood ? "selected" : ""}>
            {mood}
          </button>
        ))}
      </div>

      <textarea
        placeholder="Write a short journal entry..."
        value={journalEntry}
        onChange={(e) => setJournalEntry(e.target.value)}
      />

      <button className="save-mood-btn">Save Mood Entry</button>
      
      {selectedMood && (
        <div className="mood-summary">
          <h3>Mood Logged: {selectedMood}</h3>
          <p>{journalEntry ? `Your note: "${journalEntry}"` : "No notes added"}</p>
        </div>
      )}
    </div>
  );
}

export default MoodTracker;
