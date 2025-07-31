import React, { useState } from 'react';

const DoctorProfile = ({ doctor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: doctor?.firstname || '',
    lastname: doctor?.lastname || '',
    email: doctor?.email || '',
    phone_number: doctor?.phone_number || '',
    specialty: doctor?.specialty || '',
    department: doctor?.department || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Here you would typically make an API call to update the doctor's profile
      console.log('Saving profile:', formData);
      setIsEditing(false);
      // You could add a success notification here
    } catch (error) {
      console.error('Error saving profile:', error);
      // You could add an error notification here
    }
  };

  const handleCancel = () => {
    setFormData({
      firstname: doctor?.firstname || '',
      lastname: doctor?.lastname || '',
      email: doctor?.email || '',
      phone_number: doctor?.phone_number || '',
      specialty: doctor?.specialty || '',
      department: doctor?.department || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {doctor?.firstname?.[0]}{doctor?.lastname?.[0]}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">
            Dr. {doctor?.firstname} {doctor?.lastname}
          </h3>
          <p className="text-gray-600">{doctor?.specialty}</p>
          <p className="text-gray-500">{doctor?.department}</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{doctor?.firstname}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{doctor?.lastname}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{doctor?.email}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{doctor?.phone_number}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialty
            </label>
            {isEditing ? (
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{doctor?.specialty}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            {isEditing ? (
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{doctor?.department}</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      {!isEditing && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h4>
          <div className="space-y-4">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Change Password
            </button>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Notification Preferences
            </button>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Privacy Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile; 