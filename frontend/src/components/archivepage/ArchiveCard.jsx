import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import GameScreen from './GameScreen';
import { Box, Typography } from '@mui/material';

const BACKEND_URL = process.env.REACT_APP_API_URL;

const ArchiveCard = () => {
  const [isGuest, setIsGuest] = useState(false);

  // Example moves for the game
  const exampleMoves = [
    "start", // Initial board setup
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1", // After 1. e4
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", // After 1... e5
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", // After 2. Nf3
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3" // After 2... Nc6
  ];

  // Example game title
  const gameTitle = "Chess Match - October 15, 2023";

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
  }, []);

  return (
    <div>
      <Navbar />
      <Box sx={{ p: 3, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 2, mb: 2 }}>
        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          {gameTitle}
        </Typography>
      </Box>
      <GameScreen moves={exampleMoves} />
    </div>
  );
};

export default ArchiveCard;
