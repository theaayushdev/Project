import { useState } from "react";
import { Droplet, CheckCircle, AlertCircle, Plus, RotateCcw, ChevronUp, ChevronDown, Award } from "lucide-react";

export default function HydrationTracker() {
  const [waterIntake, setWaterIntake] = useState(6);
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
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Hydration Tracker</h2>
      
      {/* Progress Visualization */}
      <div className="mb-8">
        <div className="relative w-full h-64 mx-auto mb-4">
          {/* Water bottle outline */}
          <div className="absolute inset-0 mx-auto w-32 h-64 border-4 border-blue-300 rounded-b-3xl rounded-t-lg overflow-hidden">
            {/* Water fill level */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-500 ease-out"
              style={{ height: `${percentage}%` }}
            ></div>
            
            {/* Measurement lines */}
            <div className="absolute inset-0">
              {[0, 25, 50, 75].map((level) => (
                <div 
                  key={level}
                  className="absolute w-6 h-1 bg-blue-200 left-0"
                  style={{ bottom: `${level}%` }}
                ></div>
              ))}
            </div>
            
            {/* Water measurement text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white drop-shadow-md">{waterIntake}/{goalIntake}</span>
              <span className="text-white font-medium drop-shadow-md">glasses</span>
            </div>
          </div>
        </div>
        
        {/* Droplet indicators */}
        <div className="flex justify-center space-x-2 mb-4">
          {Array.from({ length: goalIntake }).map((_, i) => (
            <button 
              key={i}
              onClick={() => setWaterIntake(i + 1)}
              className="transition-all duration-300 hover:scale-110 focus:outline-none"
            >
              {i < waterIntake ? (
                <Droplet className="w-8 h-8 text-blue-500" fill="currentColor" />
              ) : (
                <Droplet className="w-8 h-8 text-blue-200" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Daily Water Cycle */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-indigo-700 mb-4">Daily Water Cycle</h3>
        <div className="relative">
          {/* Timeline connector */}
          <div className="absolute left-4 top-6 w-1 h-3/4 bg-blue-200"></div>
          
          {/* Cycle steps */}
          <div className="space-y-6">
            {waterCycleSteps.map((step) => (
              <div 
                key={step.id}
                className="flex items-center cursor-pointer group"
                onClick={() => toggleCycleStep(step.id)}
              >
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${
                  step.complete ? 'bg-green-500' : 'bg-gray-200 group-hover:bg-blue-100'
                }`}>
                  {step.complete ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Droplet className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                
                <div className="ml-4">
                  <p className="font-medium text-gray-800">{step.label}</p>
                  <p className="text-sm text-gray-500">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex gap-3 mb-6">
        {!showAddWater ? (
          <button 
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            onClick={() => setShowAddWater(true)}
          >
            <Plus className="w-5 h-5" />
            <span>Log Water Intake</span>
          </button>
        ) : (
          <div className="w-full bg-blue-50 p-4 rounded-lg">
            <div className="flex mb-3 gap-2">
              {["150", "250", "350"].map(amount => (
                <button 
                  key={amount}
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    newAmount === amount ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-300 hover:bg-blue-100'
                  }`}
                  onClick={() => setNewAmount(amount)}
                >
                  {amount}ml
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button 
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-md text-gray-700 transition-colors"
                onClick={() => setShowAddWater(false)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 bg-blue-500 hover:bg-blue-600 py-2 rounded-md text-white transition-colors"
                onClick={addWater}
              >
                Add
              </button>
            </div>
          </div>
        )}
        
        <button 
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg flex items-center justify-center transition-colors"
          onClick={resetWater}
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
      
      {/* Water Log */}
      <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
        <div 
          className="flex items-center justify-between px-4 py-3 bg-gray-100 cursor-pointer"
          onClick={() => setShowLog(!showLog)}
        >
          <h3 className="font-medium text-gray-800">Water Log</h3>
          {showLog ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
        
        {showLog && (
          <div className="p-4">
            {waterLog.length > 0 ? (
              <div className="max-h-48 overflow-auto">
                <table className="w-full">
                  <thead className="text-left text-gray-600 text-sm">
                    <tr>
                      <th className="pb-2">Time</th>
                      <th className="pb-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waterLog.map(entry => (
                      <tr key={entry.id} className="border-t border-gray-200">
                        <td className="py-2 text-gray-800">{entry.time}</td>
                        <td className="py-2 text-gray-800">{entry.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No water intake logged yet</p>
            )}
          </div>
        )}
      </div>
      
      {/* Hydration Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-center text-blue-800 mb-2">Staying hydrated is essential for you and your baby!</p>
        
        <div className="flex items-center justify-center">
          {percentage < 50 && (
            <div className="flex items-center text-amber-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>You're behind on your water intake today.</span>
            </div>
          )}
          
          {percentage >= 50 && percentage < 100 && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>You're doing well! Keep drinking.</span>
            </div>
          )}
          
          {percentage >= 100 && (
            <div className="flex items-center text-indigo-600">
              <Award className="w-5 h-5 mr-2" />
              <span>Great job! You've reached your daily goal.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}