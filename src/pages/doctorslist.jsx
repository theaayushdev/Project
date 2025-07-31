import React, { useEffect, useState } from 'react';

const staticDoctors = [
    {
        id: 1,
        name: 'Dr. John Doe',
        age: 45,
        experience: 20,
        type: 'Cardiologist',
        photo: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
        id: 2,
        name: 'Dr. Jane Smith',
        age: 38,
        experience: 12,
        type: 'Dermatologist',
        photo: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
    // Add more static doctors as needed
];

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        // Replace with API call when backend is ready
        setDoctors(staticDoctors);
    }, []);

    return (
        <div>
            <h2>Doctors</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {doctors.map((doctor) => (
                    <div key={doctor.id} style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '16px',
                        width: '220px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <img
                            src={doctor.photo}
                            alt={doctor.name}
                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' }}
                        />
                        <h3 style={{ margin: '0 0 8px 0' }}>{doctor.name}</h3>
                        <p style={{ margin: '4px 0' }}>Age: {doctor.age}</p>
                        <p style={{ margin: '4px 0' }}>Experience: {doctor.experience} years</p>
                        <p style={{ margin: '4px 0' }}>Type: {doctor.type}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorsList;