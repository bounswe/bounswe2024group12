import React from 'react';
import styles from './MainPageReviewBox.module.css';
import tempGame from "./temporaryassets/game.json";
import tempImage from "./temporaryassets/gamePicture.jpeg";
import tempReview from "./temporaryassets/review.json";

const MainPageReviewBox = ({ game = { ...tempGame }, review=tempReview }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{game.name}</h3>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img src={game.image || tempImage} alt={game.name} className={styles.gameImage} />
        </div>
        <div className={styles.reviewDetails}>
  <h2 className={styles.username}>{review.username}</h2>
  <div className={styles.likeRatingContainer}>
  <p className={styles.likeCount}>{review.rating +"/5 rating"}</p>

    <p className={styles.likeCount}>{review.likeCount + " likes"}</p>
  </div>
  <p className={styles.review}>{review.description}</p>
</div>
      </div>
    </div>
  );
};

export default MainPageReviewBox;
