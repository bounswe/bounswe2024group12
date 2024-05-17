import React from 'react';
import { useState, useEffect } from 'react';
import styles from './GameInfo.module.css';
import tempGame from "../temporaryassets/game.json";
import tempImage from "../temporaryassets/gamePicture.jpeg";
import { endpoint } from '../common/EndpointContext';
import Card from '../common/Card';




const GameInfo = ({ game = { ...tempGame } }) => {


  return (
    <div className={styles.card}>
      <Card>
      
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img src={game.image || game.logo } alt={game?.gameLabel} className={styles.gameImage} />
        </div>
        <div className={styles.gameDetails}>
          <h2 className={styles.gameName}>{game?.gameLabel}</h2>
          
          <p className={styles.developer}>{game?.publisherLabel}</p>
          {/* <div className={styles.rating}>
            {game.averageRating+"/5"}
          </div> */}
        </div>
      </div>
      </Card>
      {/* right aligned game properties */}
    </div>
  );
};

export default GameInfo;
