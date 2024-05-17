// MainPageComponents.jsx

import React, { useState, useEffect } from 'react';
import Menu from '../common/Menu';
import GameOfTheDay from './GameOfTheDay';
import MainPageGameLists from "./MainPageGameLists"
import { useNavigate } from 'react-router-dom';
import MainPageReviewList from './MainPageReviewList';
import styles from './MainPageComponents.module.css'; 

export default function MainPageComponents(){
  const [loggedIn, setLoggedIn] = useState(true); //TODO check logged in
  return (
    <>
      <Menu/>
      <GameOfTheDay/>
      <MainPageGameLists title ="Popular Games" type={"popular"}/>
      <MainPageGameLists title ="New Games" type={"new"}/>
      <div className={styles.reviewList}> 
        <MainPageReviewList className={styles.reviewItem} title="Recent Reviews" type={"recent"}/>
        <MainPageReviewList className={styles.reviewItem} title="Popular Reviews" type={"popular"}/>
      </div>
      {/* <MainPageGameLists title ="More Games"/> */}
    </>
  );
};
