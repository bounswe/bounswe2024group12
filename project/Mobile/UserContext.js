import React from 'react';

export const UserContext = React.createContext({
  username: '',
  setUsername: () => {},
});