import React, { useEffect, useState } from 'react';

const CalendarWidget = ({ doctorId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate] = useState(new Date());

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`http://127.0.0.1:5000/doctor/calendar-events/${doctorId}`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          throw new Error('Failed to fetch calendar events');
        }
      } catch (err) {
        console.error('Error fetching calendar events:', err);
        setError('Failed to load calendar events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [doctorId]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    return events.filter(event => {
      const eventDate = new Date(event.appointment_date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <div className="w-6 h-6 bg-gray-200 rounded mr-3 animate-pulse"></div>
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-7 gap-1 animate-pulse">
          {Array.from({ length: 42 }, (_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Calendar</h3>
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

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-xl">📅</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Appointment Calendar</h3>
            <p className="text-sm text-gray-500">Monthly overview</p>
          </div>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;
          
          return (
            <div
              key={index}
              className={`h-10 flex items-center justify-center text-sm border border-gray-100 rounded-lg relative transition-colors ${
                day === currentDate.getDate() 
                  ? 'bg-blue-50 text-blue-700 font-semibold border-blue-200' 
                  : day 
                    ? 'text-gray-900 hover:bg-gray-50 cursor-pointer' 
                    : 'text-gray-300'
              }`}
            >
              {day}
              {hasEvents && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Today's Events */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Today's Events</h4>
        {getEventsForDay(currentDate.getDate()).length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No appointments today</p>
          </div>
        ) : (
          <div className="space-y-2">
            {getEventsForDay(currentDate.getDate()).slice(0, 3).map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {event.user?.firstname} {event.user?.lastname}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.appointment_date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                  event.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                  event.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarWidget;