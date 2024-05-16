import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './GameInfo.module.css';

const GameDetails = () => {
  const location = useLocation();
  const { gameData } = location.state;
  const tempImage = '/path/to/default/image.jpg';  // Placeholder image

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <h4 style={{ color: 'var(--highlight-color)', margin: '0px' }}>Genres:</h4>
          <div>
            {gameData.genres && gameData.genres.map((genre, index) => (
              <span key={index} className={styles.platform}>{genre}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <h4 style={{ color: 'var(--highlight-color)', margin: '0px' }}>Platforms:</h4>
          <div>
            {gameData.platforms && gameData.platforms.map((platform, index) => (
              <span key={index} className={styles.platform}>{platform}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <h4 style={{ color: 'var(--highlight-color)', margin: '0px' }}>Composers:</h4>
          <div>
            {gameData.composers && gameData.composers.map((composer, index) => (
              <span key={index} className={styles.platform}>{composer}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <h4 style={{ color: 'var(--highlight-color)', margin: '0px' }}>Screenwriters:</h4>
          <div>
            {gameData.screenwriters && gameData.screenwriters.map((screenWriter, index) => (
              <span key={index} className={styles.platform}>{screenWriter}</span>
            ))}
          </div>
        </div>
      </div>
  );
};

export default GameDetails;
