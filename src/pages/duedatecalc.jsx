import { useState } from 'react';
import '../cssonly/duedatecalc.css'; 

function DueDateCalculator() {
  const [lmp, setLmp] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [gestationalAge, setGestationalAge] = useState('');
  const [trimester, setTrimester] = useState('');

  const calculateDueDate = () => {
    if (!lmp) return;

    const lmpDate = new Date(lmp);
    const today = new Date();
    const due = new Date(lmpDate);
    due.setDate(due.getDate() + 280); // Add 280 days (40 weeks)

    const diffTime = today.getTime() - lmpDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;

    let tri = '';
    if (weeks < 13) tri = 'First Trimester';
    else if (weeks < 27) tri = 'Second Trimester';
    else if (weeks <= 40) tri = 'Third Trimester';
    else tri = 'Post-term';

    setDueDate(due.toISOString().split('T')[0]);
    setGestationalAge(`${weeks} weeks and ${days} days`);
    setTrimester(tri);
  };

  return (
    <div className="calculator-container">
      <h2>Pregnancy Due Date Calculator : </h2>

      <label>Last Menstrual Period (LMP):</label>
      <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} />

      <button onClick={calculateDueDate}>Calculate Due Date</button>

      {dueDate && (
        <div className="result">
          <p><strong>Estimated Due Date:</strong> {dueDate}</p>
          <p><strong>Gestational Age:</strong> {gestationalAge}</p>
          <p><strong>Current Trimester:</strong> {trimester}</p>
        </div>
      )}
    </div>
  );
}

export default DueDateCalculator;
