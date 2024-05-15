import React, { useEffect, useState } from 'react';
import styles from './TabComponent.module.css';
import MainPageReviewLists from '../mainpage/MainPageReviewList';
import styles2 from '../mainpage/MainPageComponents.module.css'; 
import { useAuth } from '../common/UserContext';

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

const ReviewsComponent = ({ id }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  const createReview = async () => {
    try {
      const response = await fetch('http://localhost:8000/createReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ game_id: id, rating, text, user_id: user.username }),
        credentials: 'include'
      });

      if (!response.ok) {
        setError("Failed to create the review");
        return;
      }
      console.log("Review created successfully");
    } catch (error) {
      console.error('Error:', error);
      setError("Failed to create the review");
    }
  };

  return (
    <>
      <div>Reviews</div>
      <div className={styles.Form}>
        <h2>Create Review</h2>
        <div>
          <label htmlFor="rating">Rating:</label>
          <input type="number" id="rating" value={rating} onChange={(e) => setRating(parseInt(e.target.value))} />
        </div>
        <div>
          <label htmlFor="text">Review:</label>
          <textarea id="text" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <button onClick={createReview}>Submit Review</button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
      <div className={styles2.reviewList}>
        <MainPageReviewLists className={styles2.reviewItem} title="Recent Reviews" id={id} type={"recent"} />
        <MainPageReviewLists className={styles2.reviewItem} title="Popular Reviews" id={id} type={"popular"} />
      </div>

    </>
  );
};


export default TabComponent;
