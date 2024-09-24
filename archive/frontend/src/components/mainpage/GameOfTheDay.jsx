import React,{useState, useEffect} from 'react';
import styles from './GameOfTheDay.module.css';
import tempGame from "../temporaryassets/game.json";
import tempImage from "../temporaryassets/gamePicture.jpeg";
import {useNavigate} from 'react-router-dom';
import { endpoint } from '../common/EndpointContext';
import ComponentLoader from '../common/ComponentLoader/ComponentLoader';
import Card from '../common/Card';

const GameOfTheDay = () => {
  //Todo: avg rating of the gameOfTheDay
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();
  const [gameOfTheDay, setGameOfTheDay] = useState({ ...tempGame });
  const [gameOfTheDayError, setGameOfTheDayError] = useState("")
  async function fetchGameOfTheDay() {
    setLoading(true);
    
    try {
      
      const response = await fetch(endpoint + 'game-of-the-day', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        setGameOfTheDayError("Could not fetch Game Of The Day");
        return;
      }
      const data = await response.json();
      setGameOfTheDayError("");
      setGameOfTheDay(data);
    }
    catch (error) {
      console.error('Error:', error);
      setGameOfTheDayError("Could not fetch Game Of The Day");
    }
    setLoading(false);
  }
  useEffect(() => {
    
    
    fetchGameOfTheDay();
    
  }, []);

  function handleClick() {
    navigator(`/game/${gameOfTheDay["game_slug"]}`);
  }
  

  return (
    <div className={styles.card}>
      
      <h2 className={styles.title}>Game of the Day</h2>
      {loading ? (
        <ComponentLoader /> // Render a loading indicator while data is being fetched
      ) : gameOfTheDayError !== "" ? (
        <div className={styles.content}>
          <h6>{gameOfTheDayError}</h6>
        </div>
      ) : (
        <Card interactive>
        <div onClick={handleClick} className={styles.content}>
          <div className={styles.imageContainer}>
            
            <img src={gameOfTheDay.image || tempImage} alt={gameOfTheDay.gameLabel} className={styles.gameImage} />
          </div>
          <div className={styles.gameDetails}>
            <h2 className={styles.gameName}>{gameOfTheDay.gameLabel}</h2>
            <p className={styles.developer}>{gameOfTheDay.publisherLabel || ""}</p>
            <div className={styles.rating}>
              <span role="img" aria-label="star">&#9733;</span>
              <span role="img" aria-label="star">&#9733;</span>
              <span role="img" aria-label="star">&#9733;</span>
              <span role="img" aria-label="star">&#9733;</span>
              <span role="img" aria-label="star">&#9733;</span>
            </div>
          </div>
        </div>
        </Card> 
      )}
    </div>
  );

};

export default GameOfTheDay;