import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check for token in local storage to determine if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleArchiveClick = () => {
    navigate('/archive');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    // Remove token from local storage to log out
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5" color="text.secondary" style={{ flexGrow: 1, fontFamily: "Helvetica", justifyContent: 'center', fontWeight: "bold" }}>
          Chess Social
        </Typography>
        <Button color="inherit" onClick={handleHomeClick}>Home</Button>
        <Button color="inherit" onClick={handleArchiveClick}>Archive</Button>
        {!isLoggedIn && <Button color="inherit" onClick={handleLoginClick}>Login</Button>}
        {isLoggedIn && <Button color="inherit" onClick={handleProfileClick}>Profile</Button>}
        {isLoggedIn && <Button color="inherit" onClick={handleLogoutClick}>Logout</Button>}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
