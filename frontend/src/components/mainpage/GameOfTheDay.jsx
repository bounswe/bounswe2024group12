import React,{useState, useEffect} from 'react';
import styles from './GameOfTheDay.module.css';
import tempGame from "../temporaryassets/game.json";
import tempImage from "../temporaryassets/gamePicture.jpeg";
import {useNavigate} from 'react-router-dom';

const GameOfTheDay = () => {
  //Todo: avg rating of the gameOfTheDay
  const navigator = useNavigate();
  const [gameOfTheDay, setGameOfTheDay] = useState({ ...tempGame });
  const [gameOfTheDayError, setGameOfTheDayError] = useState("")
  async function fetchGameOfTheDay(event) {
    try {
      const response = await fetch('http://localhost:8000/game-of-the-day', {
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
  }
  useEffect(() => {
    fetchGameOfTheDay();
  }, []);

  function handleClick() {
    navigator(`/game/${gameOfTheDay["game-slug"]}`);
  }


  return (
    <>
      {gameOfTheDayError!=="" ? (
                <div className={styles.card}>
        <h6>{gameOfTheDayError}</h6></div>
      ) : (
        <div className={styles.card}>
          <h2 className={styles.title}>Game of the Day</h2>
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
        </div>
      )}
    </>
  );
  
};

export default GameOfTheDay;
