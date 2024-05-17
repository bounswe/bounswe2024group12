import React from 'react';
import { useState, useEffect } from 'react';
import styles from './GameInfo.module.css';
import tempGame from "../temporaryassets/game.json";
import tempImage from "../temporaryassets/gamePicture.jpeg";
import { endpoint } from '../common/EndpointContext';




const GameInfo = ({ game = { ...tempGame } }) => {


  return (
    <div className={styles.card}>
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
      {/* right aligned game properties */}
      <div style={{display:'flex', flexDirection:'column'}}>
{game?.genreLabel && (        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
        <h4 style={{color: 'var(--highlight-color)' ,margin:'0px'}}>Genres:</h4>

<span className={styles.platform}>{game?.genreLabel}</span>
         
        </div>)}
{game?.platformLabel &&(        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <h4 style={{color: 'var(--highlight-color)' ,margin:'0px'}}>Platforms:</h4>
          
<span className={styles.platform}>{game?.platformLabel}</span>

        </div>)}
        {game?.composerLabel &&(<div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <h4 style={{color: 'var(--highlight-color)' ,margin:'0px'}}>Composers:</h4>

<span className={styles.platform}>{game?.composerLabel}</span>

          </div>)}
{game?.screenwriterLabel &&(        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <h4 style={{color: 'var(--highlight-color)' ,margin:'0px'}}>ScreenWriters:</h4>

 <span className={styles.platform}>{game?.screenwriterLabel}</span>

          
        </div>)}
      </div>
    </div>
  );
};

export default GameInfo;
