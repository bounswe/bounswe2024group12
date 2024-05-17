// MainPageComponents.jsx

import React, { useState, useEffect } from 'react';
import Menu from '../common/Menu';
import styles from './GamePageComponents.module.css'; 
import GameInfo from './GameInfo';
import TabComponent from "./TabComponent";

export default function GamePageComponents({game}){
  //todo fill here when isil returns
  const [loggedIn, setLoggedIn] = useState(true);
  return (
    <>
      <Menu/>
      <GameInfo game={game}/>
      <TabComponent game={game}/>
    </>
  );
};
