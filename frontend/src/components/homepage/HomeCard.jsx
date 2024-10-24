import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Feed from './Feed';
import { useNavigate } from 'react-router-dom'; // For navigation

const BACKEND_URL = "https://167.99.133.190/api/v1";

const HomeCard = () => {
  const navigate = useNavigate();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token, the user is continuing as a guest
      setIsGuest(true);
      return;
    }

    const checkHealth = async () => {
      try {
        const response = await fetch(BACKEND_URL + "/healthcheck/hc/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch health check data');
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkHealth();
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <Feed isGuest={isGuest}/>
      {isGuest && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Welcome, Guest!</h2>
          <p>Feel free to explore the app, but certain features may require an account.</p>
          <button onClick={() => navigate('/login')}>Sign Up / Login</button>
        </div>
      )}
    </div>
  );
};

export default HomeCard;
