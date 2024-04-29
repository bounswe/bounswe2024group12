import React, { createContext, useState } from 'react';

// Create the context
export const ProfileContext = createContext();

// Create the provider component
export const ProfileProvider = ({ children }) => {
    // State to store the logged-in user
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);
    const [isGuest, setIsGuest] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const loginHandler = async ({ username, password }) => {
        //TODO:
        //Send username and password to server
        //If successful, navigate to the home page
        //If not, show an error message
        //Send a dummy success response for now
        const response = {
            status: 200,
            token: 'your_token_here'
        }

        const { token } = response;

        if (response.status === 200 && token) {
            setToken(token)
            setUsername(username)
            setIsGuest(false)
            setIsLoggedIn(true)
        } else {
            alert('Invalid username or password')
            throw new Error('Invalid username or password');
        }
    }

    const logoutHandler = () => {
        setToken(null)
        setUsername(null)
        setIsGuest(null)
        setIsLoggedIn(false)
    }

    const guestHandler = () => {
        setToken(null)
        setUsername(null)
        setIsGuest(true)
        setIsLoggedIn(true)
    }
    // Function to set the logged-in user


    // Value object to be passed to consumers
    const value = {
        token,
        username,
        isGuest,
        isLoggedIn,
        loginHandler,
        logoutHandler,
        guestHandler,
    };

    // Return the provider component with the value object
    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};