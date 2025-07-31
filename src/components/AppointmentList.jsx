import React, { useEffect, useState } from 'react';

const AppointmentList = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`http://127.0.0.1:5000/doctor-appointments/${doctorId}`);
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          throw new Error('Failed to fetch appointments');
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded"></div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Appointments</h3>
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-xl">📅</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <p className="text-sm text-gray-500">Today's schedule</p>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <span>+</span>
          <span>New</span>
        </button>
      </div>
      
      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments scheduled</h3>
          <p className="text-gray-600 mb-4">All clear for now!</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Schedule Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.slice(0, 5).map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  {appointment.user?.firstname?.[0]}{appointment.user?.lastname?.[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {appointment.user?.firstname} {appointment.user?.lastname}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{formatDate(appointment.appointment_date)}</span>
                    <span>•</span>
                    <span>{formatTime(appointment.appointment_date)}</span>
                  </div>
                  {appointment.purpose && (
                    <p className="text-xs text-gray-400 mt-1">{appointment.purpose}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {appointments.length > 5 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
            View all {appointments.length} appointments
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;