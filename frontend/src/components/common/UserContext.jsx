import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export default function UserProvider({ children }){
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({ username: ''});

  const handleLogin = (username) => {;
    localStorage.setItem('username', username);
    setUser({ username: username });
    setLoggedIn(true);
  };

  const handleLogout = () => {
    document.cookie = 'token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('username');
    setUser({ username: 'Guest' });
    setLoggedIn(false);
  };

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const username = localStorage.getItem('username');
    console.log('Username:', username);
  
    if (username) {
      setUser( { username: username });
      setLoggedIn(true);
    }
    else {
      setUser( { username: 'Guest' });
      setLoggedIn(false);
    }
  
    console.log('LoggedIn:', loggedIn);
    console.log('Final Username:', user.username);
  }, [loggedIn]);

  return (
    <UserContext.Provider value={{ loggedIn, handleLogin, handleLogout, user}}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
