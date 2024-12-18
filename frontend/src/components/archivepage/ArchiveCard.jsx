import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import GameScreen from './GameScreen';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const BACKEND_URL = process.env.REACT_APP_API_URL;

const ArchiveCard = () => {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('username'));
  const [filters, setFilters] = useState({
    year: '',
    player: '',
    site: '',
    event: '',
    result: ''
  });
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = async () => {
    setHasSearched(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${BACKEND_URL}/games/filter/?${queryParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to fetch filtered games');
      const data = await response.json();
      setGames(data.games);
    } catch (error) {
      console.error('Error fetching games:', error.message);
    }
  };

  const handleGameClick = (game) => {
    console.log(game.pgn);
    console.log(game);  
    setSelectedGame(game);
  };

  const handleReturnToSearch = () => {
    setSelectedGame(null);
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const handleMetadataClick = (filterType, value) => {
    const newFilters = {
      year: '',
      player: '',
      site: '',
      event: '',
      result: ''
    };
    newFilters[filterType] = value;
    
    setFilters(newFilters);
    
    const queryParams = new URLSearchParams(newFilters).toString();
    fetch(`${BACKEND_URL}/games/filter/?${queryParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch filtered games');
        return response.json();
      })
      .then(data => {
        setGames(data.games);
        setHasSearched(true);
        setSelectedGame(null);
      })
      .catch(error => {
        console.error('Error fetching games:', error.message);
      });  
    };

  return (
    <div>
      <Navbar />
      {!selectedGame ? (
        <>
          {/* Search Filters */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Advanced Game Search</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              <TextField fullWidth label="Year" name="year" value={filters.year} onChange={handleInputChange} />
              <TextField fullWidth label="Player" name="player" value={filters.player} onChange={handleInputChange} />
              <TextField fullWidth label="Site" name="site" value={filters.site} onChange={handleInputChange} />
              <TextField fullWidth label="Event" name="event" value={filters.event} onChange={handleInputChange} />
              <TextField fullWidth label="Result" name="result" value={filters.result} onChange={handleInputChange} placeholder="e.g., 1-0, 0-1" />
            </Box>
            <Button variant="contained" onClick={handleSearch}>Search</Button>
          </Box>

          {/* Display Games */}
          <Box sx={{ mt: 3 }}>
            {!hasSearched ? (
              <Typography>Use the search form above to find games.</Typography>
            ) : games.length > 0 ? (
              <List>
                {games.map((game, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleGameClick(game)}
                    sx={{ border: '1px solid #ccc', borderRadius: 2, mb: 1 }}
                  >
                    <ListItemText
                      primary={`${game.white} vs ${game.black}`}
                      secondary={`${game.event} | ${game.year} | Result: ${game.result}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No games found. Try refining your search criteria.</Typography>
            )}
          </Box>
        </>
      ) : (
        <>
          {/* Game Details */}
          <Box sx={{ p: 3 }}>
            <Button variant="outlined" onClick={handleReturnToSearch} sx={{ mb: 2 }}>
              Return to Search
            </Button>
            <GameScreen 
              game={selectedGame} 
              currentUser={currentUser}
              onGameSelect={handleGameSelect}
              onMetadataClick={handleMetadataClick}
            />
          </Box>
        </>
      )}
    </div>
  );
};

export default ArchiveCard;
