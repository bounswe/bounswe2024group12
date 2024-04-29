// MainPageComponents.jsx

import React, { useState, useEffect } from 'react';
import Menu from '../common/Menu';
import GameOfTheDay from './GameOfTheDay';
import MainPageGameLists from "./MainPageGameLists"
import { useNavigate } from 'react-router-dom';
import MainPageReviewList from './MainPageReviewList';
import styles from './MainPageComponents.module.css'; 

export default function MainPageComponents(){
  const [loggedIn, setLoggedIn] = useState(true);
  const [gameOfTheDay, setGameOfTheDay] = useState();

  const fetchGameOfTheDay = () => {
    const game = {};
    //setGameOfTheDay(game);
  };

  useEffect(() => {
    fetchGameOfTheDay();
  }, []);

  return (
    <>
      <Menu/>
      <GameOfTheDay game={gameOfTheDay}/>
      <MainPageGameLists title ="Popular Games"/>
      <MainPageGameLists title ="New Games"/>
      <div className={styles.reviewList}> 
        <MainPageReviewList className={styles.reviewItem} title="Recent Reviews"/>
        {loggedIn && <MainPageReviewList className={styles.reviewItem} title="Friends Reviews"/>}
      </div>
      <MainPageGameLists title ="More Games"/>
    </>
  );
};
