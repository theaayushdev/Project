import React, { useState } from "react";
import { Droplet, CheckCircle, AlertCircle, Plus, RotateCcw, ChevronUp, ChevronDown, Award } from "lucide-react";

function HydrationTracker() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterLog, setWaterLog] = useState([
    { id: 1, time: "8:00 AM", amount: "250ml" },
    { id: 2, time: "10:30 AM", amount: "250ml" },
    { id: 3, time: "12:45 PM", amount: "350ml" },
    { id: 4, time: "2:15 PM", amount: "250ml" },
    { id: 5, time: "4:00 PM", amount: "250ml" },
    { id: 6, time: "5:30 PM", amount: "250ml" }
  ]);
  const [showLog, setShowLog] = useState(false);
  const [showAddWater, setShowAddWater] = useState(false);
  const [newAmount, setNewAmount] = useState("250");
  
  const goalIntake = 8;
  const percentage = (waterIntake / goalIntake) * 100;

  // Water cycle states
  const [waterCycleSteps, setWaterCycleSteps] = useState([
    { id: 1, label: "Morning", time: "6-10 AM", complete: true },
    { id: 2, label: "Mid-day", time: "10-2 PM", complete: true },
    { id: 3, label: "Afternoon", time: "2-6 PM", complete: true },
    { id: 4, label: "Evening", time: "6-10 PM", complete: false }
  ]);

  const addWater = () => {
    if (waterIntake < goalIntake) {
      setWaterIntake(waterIntake + 1);
      
      // Add to log
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setWaterLog([
        ...waterLog,
        {
          id: waterLog.length + 1,
          time: timeString,
          amount: `${newAmount}ml`
        }
      ]);
      
      setShowAddWater(false);
    }
  };

  const resetWater = () => {
    setWaterIntake(0);
    setWaterLog([]);
    setWaterCycleSteps(waterCycleSteps.map(step => ({...step, complete: false})));
  };

  // Function to toggle water cycle step completion
  const toggleCycleStep = (id) => {
    setWaterCycleSteps(waterCycleSteps.map(step => {
      if (step.id === id) {
        const newComplete = !step.complete;
        
        // If we're marking it complete and it wasn't before, add water
        if (newComplete && waterIntake < goalIntake) {
          setWaterIntake(prev => prev + 1);
        } 
        // If we're marking it incomplete and it was complete before, reduce water
        else if (!newComplete && waterIntake > 0) {
          setWaterIntake(prev => prev - 1);
        }
        
        return {...step, complete: newComplete};
      }
      return step;
    }));
  };

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "24px",
      maxWidth: "500px",
      margin: "0 auto"
    }}>
      <h2 style={{
        fontSize: "24px",
        fontWeight: "bold",
        color: "#4338ca",
        marginBottom: "24px",
        textAlign: "center"
      }}>Hydration Tracker</h2>
      
      {/* Progress Visualization */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ position: "relative", width: "100%", height: "256px", marginBottom: "16px" }}>
          {/* Water bottle outline */}
          <div style={{
            position: "absolute",
            top: "0",
            right: "0",
            bottom: "0",
            left: "0",
            margin: "0 auto",
            width: "128px",
            height: "256px",
            border: "4px solid #93c5fd",
            borderBottomLeftRadius: "24px",
            borderBottomRightRadius: "24px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            overflow: "hidden"
          }}>
            {/* Water fill level */}
            <div style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              background: "linear-gradient(to top, #3b82f6, #60a5fa)",
              height: `${percentage}%`,
              transition: "height 0.5s ease-out"
            }}></div>
            
            {/* Measurement lines */}
            <div style={{ position: "absolute", top: "0", right: "0", bottom: "0", left: "0" }}>
              {[0, 25, 50, 75].map((level) => (
                <div 
                  key={level}
                  style={{
                    position: "absolute",
                    width: "24px",
                    height: "4px",
                    backgroundColor: "#bfdbfe",
                    left: "0",
                    bottom: `${level}%`
                  }}
                ></div>
              ))}
            </div>
            
            {/* Water measurement text */}
            <div style={{
              position: "absolute",
              top: "0",
              right: "0",
              bottom: "0",
              left: "0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <span style={{ fontSize: "30px", fontWeight: "bold", color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
                {waterIntake}/{goalIntake}
              </span>
              <span style={{ color: "white", fontWeight: "500", textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
                glasses
              </span>
            </div>
          </div>
        </div>
        
        {/* Droplet indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
          {Array.from({ length: goalIntake }).map((_, i) => (
            <button 
              key={i}
              onClick={() => setWaterIntake(i + 1)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.3s",
                padding: "4px"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <Droplet 
                size={32} 
                color={i < waterIntake ? "#3b82f6" : "#bfdbfe"} 
                fill={i < waterIntake ? "#3b82f6" : "none"} 
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Daily Water Cycle */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#4338ca", marginBottom: "16px" }}>
          Daily Water Cycle
        </h3>
        <div style={{ position: "relative" }}>
          {/* Timeline connector */}
          <div style={{
            position: "absolute",
            left: "16px",
            top: "24px",
            width: "4px",
            height: "75%",
            backgroundColor: "#bfdbfe"
          }}></div>
          
          {/* Cycle steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {waterCycleSteps.map((step) => (
              <div 
                key={step.id}
                style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                onClick={() => toggleCycleStep(step.id)}
                onMouseOver={(e) => {
                  if (!step.complete) {
                    e.currentTarget.querySelector('.step-circle').style.backgroundColor = "#dbeafe";
                  }
                }}
                onMouseOut={(e) => {
                  if (!step.complete) {
                    e.currentTarget.querySelector('.step-circle').style.backgroundColor = "#e5e7eb";
                  }
                }}
              >
                <div 
                  className="step-circle"
                  style={{
                    position: "relative",
                    zIndex: "10",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: step.complete ? "#10b981" : "#e5e7eb",
                    transition: "background-color 0.3s"
                  }}
                >
                  {step.complete ? (
                    <CheckCircle size={24} color="white" />
                  ) : (
                    <Droplet size={20} color="#60a5fa" />
                  )}
                </div>
                
                <div style={{ marginLeft: "16px" }}>
                  <p style={{ fontWeight: "500", color: "#1f2937" }}>{step.label}</p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        {!showAddWater ? (
          <button 
            style={{
              flex: "1",
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onClick={() => setShowAddWater(true)}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
          >
            <Plus size={20} />
            <span>Log Water Intake</span>
          </button>
        ) : (
          <div style={{
            width: "100%",
            backgroundColor: "#eff6ff",
            padding: "16px",
            borderRadius: "8px"
          }}>
            <div style={{ display: "flex", marginBottom: "12px", gap: "8px" }}>
              {["150", "250", "350"].map(amount => (
                <button 
                  key={amount}
                  style={{
                    flex: "1",
                    padding: "8px",
                    borderRadius: "6px",
                    border: newAmount === amount ? "none" : "1px solid #93c5fd",
                    backgroundColor: newAmount === amount ? "#3b82f6" : "white",
                    color: newAmount === amount ? "white" : "#3b82f6",
                    cursor: "pointer",
                    transition: "background-color 0.3s"
                  }}
                  onClick={() => setNewAmount(amount)}
                  onMouseOver={(e) => {
                    if (newAmount !== amount) {
                      e.currentTarget.style.backgroundColor = "#dbeafe";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (newAmount !== amount) {
                      e.currentTarget.style.backgroundColor = "white";
                    }
                  }}
                >
                  {amount}ml
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                style={{
                  flex: "1",
                  backgroundColor: "#e5e7eb",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "none",
                  color: "#4b5563",
                  cursor: "pointer",
                  transition: "background-color 0.3s"
                }}
                onClick={() => setShowAddWater(false)}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#d1d5db"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
              >
                Cancel
              </button>
              <button 
                style={{
                  flex: "1",
                  backgroundColor: "#3b82f6",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  transition: "background-color 0.3s"
                }}
                onClick={addWater}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
              >
                Add
              </button>
            </div>
          </div>
        )}
        
        <button 
          style={{
            backgroundColor: "#f3f4f6",
            color: "#4b5563",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 0.3s"
          }}
          onClick={resetWater}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
        >
          <RotateCcw size={20} />
        </button>
      </div>
      
      {/* Water Log */}
      <div style={{
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "24px"
      }}>
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            backgroundColor: "#f3f4f6",
            cursor: "pointer"
          }}
          onClick={() => setShowLog(!showLog)}
        >
          <h3 style={{ fontWeight: "500", color: "#1f2937" }}>Water Log</h3>
          {showLog ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {showLog && (
          <div style={{ padding: "16px" }}>
            {waterLog.length > 0 ? (
              <div style={{ maxHeight: "192px", overflow: "auto" }}>
                <table style={{ width: "100%" }}>
                  <thead style={{ textAlign: "left", color: "#4b5563", fontSize: "14px" }}>
                    <tr>
                      <th style={{ paddingBottom: "8px" }}>Time</th>
                      <th style={{ paddingBottom: "8px" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waterLog.map(entry => (
                      <tr key={entry.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "8px 0", color: "#1f2937" }}>{entry.time}</td>
                        <td style={{ padding: "8px 0", color: "#1f2937" }}>{entry.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: "#6b7280", textAlign: "center", padding: "16px 0" }}>
                No water intake logged yet
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Hydration Tips */}
      <div style={{
        backgroundColor: "#eff6ff",
        borderRadius: "8px",
        padding: "16px"
      }}>
        <p style={{ textAlign: "center", color: "#1e40af", marginBottom: "8px" }}>
          Staying hydrated is essential for you and your baby!
        </p>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {percentage < 50 && (
            <div style={{ display: "flex", alignItems: "center", color: "#d97706" }}>
              <AlertCircle size={20} style={{ marginRight: "8px" }} />
              <span>You're behind on your water intake today.</span>
            </div>
          )}
          
          {percentage >= 50 && percentage < 100 && (
            <div style={{ display: "flex", alignItems: "center", color: "#16a34a" }}>
              <CheckCircle size={20} style={{ marginRight: "8px" }} />
              <span>You're doing well! Keep drinking.</span>
            </div>
          )}
          
          {percentage >= 100 && (
            <div style={{ display: "flex", alignItems: "center", color: "#4f46e5" }}>
              <Award size={20} style={{ marginRight: "8px" }} />
              <span>Great job! You've reached your daily goal.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HydrationTracker;