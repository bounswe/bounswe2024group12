import React, { useState } from 'react';
import styles from './TabComponent.module.css';

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState('Game');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabButtons}>
        <button
          className={`${styles.tabButton} ${activeTab === 'Game' && styles.active}`}
          onClick={() => handleTabClick('Game')}
        >
          Game
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'Characters' && styles.active}`}
          onClick={() => handleTabClick('Characters')}
        >
          Characters
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'Credits' && styles.active}`}
          onClick={() => handleTabClick('Credits')}
        >
          Credits
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'Reviews' && styles.active}`}
          onClick={() => handleTabClick('Reviews')}
        >
          Reviews
        </button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === 'Game' && <GameComponent />}
        {activeTab === 'Characters' && <CharactersComponent />}
        {activeTab === 'Credits' && <CreditsComponent />}
        {activeTab === 'Reviews' && <ReviewsComponent />}
      </div>
    </div>
  );
};

const GameComponent = () => {
  return <div>Game Component</div>;
};

const CharactersComponent = () => {
  return <div>Characters Component</div>;
};

const CreditsComponent = () => {
  return <div>Credits Component</div>;
};

const ReviewsComponent = () => {
  return <div>Reviews Component</div>;
};

export default TabComponent;
