import React from 'react';
import styles from './GameInfo.module.css';
import tempGame from "../temporaryassets/game.json";
import tempImage from "../temporaryassets/gamePicture.jpeg";

retrieveInfo();
async function retrieveInfo() {
  try {
    const response = await fetch('http://127.0.0.1:8000/game-of-day', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ }),
    });

    if (!response.ok) {
      console.log(response.statusText);
      return;
    }
    const data = await response.json();
    console.log(data);
    return 

  }
  catch (error) {
    console.error('Error:', error);
  }
}

const GameInfo = ({ game = { ...tempGame } }) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img src={game.image || tempImage} alt={game.name} className={styles.gameImage} />
        </div>
        <div className={styles.gameDetails}>
          <h2 className={styles.gameName}>{game.name}</h2>
          <p className={styles.developer}>{game.developer}</p>
          <div className={styles.rating}>
            {game.averageRating+"/5"}
          </div>
        </div>
      </div>
      <div>
        {game.info}
      </div>
    </div>
  );
};

export default GameInfo;
