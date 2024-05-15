import React from 'react';
import { useState, useEffect } from 'react';
import styles from './GameInfo.module.css';
import tempGame from "../temporaryassets/game.json";
import tempImage from "../temporaryassets/gamePicture.jpeg";
import { endpoint } from '../common/EndpointContext';




const GameInfo = ({ game = { ...tempGame } }) => {

  const [gameData, setGameData] = useState({ ...tempGame });


  async function retrieveInfo() {
    try {
      const response = await fetch(endpoint + 'game-of-day', {
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
      setGameData({...gameData, ...data});
     
      return 
  
    }
    catch (error) {
      console.error('Error:', error);
    }


  
  
  }
  useEffect(() => {
    retrieveInfo();
    
  }, []);

  // game search api call 
  const gameName = 'Minecraft';
  async function searchGame() {
    try {
      const response = await fetch('http://127.0.0.1:8000/search-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ game_name: gameName }),
      });

      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      const data = await response.json();
      console.log(data);
      setGameData({...gameData, ...data});
      console.log("Game Data: ", gameData)
      return

    }
    catch (error) {
      console.error('Error:', error);
    }

  }
  useEffect(() => {
    searchGame();

  }, []);


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
      {/* right aligned game properties */}
      <div style={{display:'flex', flexDirection:'column'}}>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
        <h4 style={{color: 'var(--highlight-color)' ,margin:'0px'}}>Genres:</h4>
      {gameData.genres && gameData.genres.map((genre) => {
            return <span className={styles.platform}>{genre}</span>
          })}
        </div>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <h4 style={{color: 'var(--highlight-color)' ,margin:'0px'}}>Platforms:</h4>
          {gameData.platforms && gameData.platforms.map((platform) => {
            return <span className={styles.platform}>{platform}</span>
          })}
        </div>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <h4 style={{color: 'var(--highlight-color)' ,margin:'0px'}}>Composers:</h4>
          {gameData.composers && gameData.composers.map((composer) => {
            return <span className={styles.platform}>{composer}</span>
          })}
          </div>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <h4 style={{color: 'var(--highlight-color)' ,margin:'0px'}}>ScreenWriters:</h4>
          {gameData.screenwriters && gameData.screenwriters.map((screenWriter) => {
            return <span className={styles.platform}>{screenWriter}</span>
          })}
          
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
