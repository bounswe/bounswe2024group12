import React from 'react';
import styles from './GameOfTheDay.module.css';
import tempGame from "../temporaryassets/game.json";
import tempImage from "../temporaryassets/gamePicture.jpeg";

const GameOfTheDay = ({ game = { ...tempGame } }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Game of the Day</h2>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img src={game.image || tempImage} alt={game.name} className={styles.gameImage} />
        </div>
        <div className={styles.gameDetails}>
          <h2 className={styles.gameName}>{game.name}</h2>
          <p className={styles.developer}>{game.developer}</p>
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
  );
};

export default GameOfTheDay;