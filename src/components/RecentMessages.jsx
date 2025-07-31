import React, { useEffect, useState } from 'react';

const RecentMessages = ({ doctorId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`http://127.0.0.1:5000/doctor/recent-messages/${doctorId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          throw new Error('Failed to fetch messages');
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
                <div className="w-full h-3 bg-gray-200 rounded"></div>
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
              </div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Messages</h3>
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

  const formatTime = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return '';
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-xl">💬</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            <p className="text-sm text-gray-500">Latest conversations</p>
          </div>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {messages.length} messages
        </span>
      </div>
      
      {messages.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">💬</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-600 mb-4">Start a conversation with your patients</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Start Chat
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.slice(0, 4).map((message) => (
            <div key={message.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                {message.sender?.firstname?.[0]}{message.sender?.lastname?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900 truncate">
                    {message.sender?.firstname} {message.sender?.lastname}
                  </p>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {truncateMessage(message.content)}
                </p>
                {!message.is_read && (
                  <div className="flex items-center mt-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-xs text-blue-600 font-medium">New</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {messages.length > 4 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
            View all {messages.length} messages
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentMessages;