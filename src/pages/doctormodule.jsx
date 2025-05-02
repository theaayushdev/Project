import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/add-doctor');
    }, 3000); // redirect after 3 seconds

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div>
      <h1>Welcome Doctor 👨‍⚕️</h1>
      <p>Greetings from Pregnify!</p>
    </div>
  );
};

export default DoctorPage;
