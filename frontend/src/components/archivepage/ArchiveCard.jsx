import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import GameScreen from './GameScreen';
import { useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

const BACKEND_URL = process.env.REACT_APP_API_URL;

const ArchiveCard = () => {
  const navigate = useNavigate();
  const [isGuest, setIsGuest] = useState(false);

  const exampleMoves = [
    "start",
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
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

  const gameTitle = "Chess Match - November 14, 2024";

  return (
    <div>
      <Navbar />
      <Box sx={{ p: 3, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 0, mb: 2 }}>
        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          {gameTitle}
        </Typography>
      </Box>
      <GameScreen moves={exampleMoves} />
    </div>
  );
};

export default ArchiveCard;
