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
        // Call the login API
        try {
            console.log(process.env.EXPO_PUBLIC_URL);
            const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/login`, {
                method: 'POST',
                body: JSON.stringify({ email: username, password }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Parse the response
            // const responseJson = await response.json();
            const responseData = response.data;
            console.log(response)

            // Get the token from the response


            const { token } = response;

            if (response.status === 200) {
                setToken(token)
                setUsername(username)
                setIsGuest(false)
                setIsLoggedIn(true)
            } else {
                alert('Invalid username or password')
                throw new Error('Invalid username or password');
            }
        } catch (e) {
            console.error(e);
            throw e;
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