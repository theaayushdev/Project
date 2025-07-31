import React, { useEffect, useState } from 'react';

const StatsCards = ({ doctorId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`http://127.0.0.1:5000/doctor/stats/${doctorId}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          throw new Error('Failed to fetch statistics');
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [doctorId]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
              <div className="w-32 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Statistics</h3>
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

  // Default stats if no data
  const defaultStats = {
    total_patients: 0,
    today_appointments: 0,
    pending_appointments: 0,
    unread_messages: 0
  };

  const currentStats = stats || defaultStats;

  const statCards = [
    {
      title: 'Total Patients',
      value: currentStats.total_patients || 0,
      change: '+12%',
      changeType: 'positive',
      icon: '👥',
      color: 'blue',
      description: 'Active patients'
    },
    {
      title: "Today's Appointments",
      value: currentStats.today_appointments || 0,
      change: `${currentStats.pending_appointments || 0} pending`,
      changeType: 'neutral',
      icon: '📅',
      color: 'green',
      description: 'Scheduled today'
    },
    {
      title: 'New Messages',
      value: currentStats.unread_messages || 0,
      change: '5 unread',
      changeType: 'positive',
      icon: '💬',
      color: 'purple',
      description: 'Unread messages'
    },
    {
      title: 'Active Cases',
      value: currentStats.total_patients || 0, // Reusing total_patients for active cases
      change: '+3 this week',
      changeType: 'positive',
      icon: '📊',
      color: 'orange',
      description: 'Ongoing cases'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[color] || colors.blue;
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl border ${getColorClasses(stat.color)}`}>
              {stat.icon}
            </div>
            <span className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
              {stat.change}
            </span>
          </div>
          
          <div className="space-y-1">
            <p className="text-3xl font-bold text-gray-900">
              {stat.value.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {stat.title}
            </p>
            <p className="text-xs text-gray-500">
              {stat.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;