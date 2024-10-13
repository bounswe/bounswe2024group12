import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
    const login = true;
    const navigate = useNavigate();
    const handleHomeClick = () => {
        navigate('/');
    }
    const handleLoginClick = () => {
        navigate('/login');
    }
    return (
        <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
            Chess Social
            </Typography>
            <Button color="inherit" onClick={handleHomeClick}>Home</Button>
            <Button color="inherit">Archive</Button>
            {!login && <Button color="inherit" onClick={handleLoginClick}>Login</Button>}
            {login && <Button color="inherit">Profile</Button>}
            {login && <Button color="inherit">Logout</Button>}
        </Toolbar>
        </AppBar>
    );
};

export default Navbar;
