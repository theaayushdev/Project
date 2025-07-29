import React, { useState } from 'react';
import UserNavbar from './Usernavbar';
import UserSidebar from './usersidebar';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just keep files in state. Backend upload can be added later.
    alert('Files ready to be uploaded! (Backend not implemented yet)');
  };

  return (
    <div className="dashboard-container">
      <UserNavbar />
      <div className="dashboard-layout">
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="dashboard-content">
          <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 10, padding: 32, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            <h2 style={{ textAlign: 'center', color: '#2c5282', marginBottom: 16 }}>Upload Report</h2>
            <form onSubmit={handleSubmit}>
              <label style={{ fontWeight: 'bold', color: '#4a5568', marginBottom: 8, display: 'block' }}>
                Select Photos or Videos:
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'block', marginTop: 8 }}
                />
              </label>
              {selectedFiles.length > 0 && (
                <div style={{ margin: '16px 0' }}>
                  <h4>Preview:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} style={{ width: 120, textAlign: 'center' }}>
                        {file.type.startsWith('image') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6 }}
                          />
                        ) : file.type.startsWith('video') ? (
                          <video width={120} height={80} controls style={{ borderRadius: 6 }}>
                            <source src={URL.createObjectURL(file)} type={file.type} />
                            Your browser does not support the video tag.
                          </video>
                        ) : null}
                        <div style={{ fontSize: 12, marginTop: 4 }}>{file.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#3182ce',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: 16
                }}
                disabled={selectedFiles.length === 0}
              >
                Upload Report
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage; 