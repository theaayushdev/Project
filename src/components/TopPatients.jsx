import React, { useEffect, useState } from 'react';

const TopPatients = ({ doctorId }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`http://127.0.0.1:5000/doctor/patients/${doctorId}`);
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          throw new Error('Failed to fetch patients');
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [doctorId]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <div className="w-6 h-6 bg-gray-200 rounded mr-3 animate-pulse"></div>
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
                <div className="w-full h-2 bg-gray-200 rounded"></div>
              </div>
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Patients</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getRandomProgress = () => Math.floor(Math.random() * 40) + 60; // 60-100%

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-xl">👥</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top Patients</h3>
            <p className="text-sm text-gray-500">Most active patients</p>
          </div>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {patients.length} patients
        </span>
      </div>
      
      {patients.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600 mb-4">Start by booking appointments</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Patient
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {patients.slice(0, 4).map((patient, index) => {
            const progress = getRandomProgress();
            return (
              <div key={patient.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  {patient.firstname?.[0]}{patient.lastname?.[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      {patient.firstname} {patient.lastname}
                    </p>
                    <span className="text-sm font-semibold text-blue-600">{progress}%</span>
                  </div>
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="text-sm text-gray-500">{patient.age || 'N/A'} yrs</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">Pregnancy</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {patients.length > 4 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
            View all {patients.length} patients
          </button>
        </div>
      )}
    </div>
  );
};

export default TopPatients;