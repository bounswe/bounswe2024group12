import React, { useState, useEffect } from 'react';
import styles from './MainPageReviewBox.module.css';
import tempImage from "../temporaryassets/gamePicture.jpeg";
import tempReview from "../temporaryassets/review.json";
import { useAuth } from '../common/UserContext';
import { endpoint } from '../common/EndpointContext';

const MainPageReviewBox = ({ review = tempReview }) => {
  const [game, setGame] = useState({});
  const [error, setError] = useState("");
  const [likes, setLikes] = useState(review.likes);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(review.text);
  const { user } = useAuth();
  const [deleted, setDeleted] =useState(false)
  async function fetchGame(id) {
    try {
      const response = await fetch(endpoint + 'game-info/' + id +"/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        setError("Could not fetch the game");
        return;
      }
      const data = await response.json();
      setError("");
      setGame(data);
    } catch (error) {
      console.error('Error:', error);
      setError("Could not fetch the game");
    }
  }

  useEffect(() => {
    if (review && review.game_slug) {
      fetchGame(review.game_slug)
    }
  }, [review]);

  const likeReview = async () => {
    try {
      const response = await fetch(endpoint + 'like-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review: review.id, user: user.username }),
        credentials: 'include'
      });

      if (!response.ok) {
        setError("Failed to like the review");
        return;
      }

      setLikes(likes + 1);
      setLiked(true);
    } catch (error) {
      console.error('Error:', error);
      setError("Failed to like the review");
    }
  };

  const unlikeReview = async () => {
    try {
      const response = await fetch(endpoint + 'unlike-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review: review.id, user: user.username }),
        credentials: 'include'
      });

      if (!response.ok) {
        setError("Failed to unlike the review");
        return;
      }

      setLikes(likes - 1);
      setLiked(false);
    } catch (error) {
      console.error('Error:', error);
      setError("Failed to unlike the review");
    }
  };

  const editReview = async () => {
    try {
      const response = await fetch(endpoint + 'edit-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review: review.id, rating: review.rating, text: editedText }),
        credentials: 'include'
      });

      if (!response.ok) {
        setError("Failed to edit the review");
        return;
      }
      setEditedText(editedText); // Update edited text with the new text
      setIsEditing(false);

      console.log("Review edited successfully");
    } catch (error) {
      console.error('Error:', error);
      setError("Failed to edit the review");
    }
  };

  const deleteReview = async () => {
    try {
      const response = await fetch(endpoint + 'delete-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review: review.id }),
        credentials: 'include'
      });

      if (!response.ok) {
        setError("Failed to delete the review");
        return;
      }

      setDeleted(true)
      console.log("Review deleted successfully");
    } catch (error) {
      console.error('Error:', error);
      setError("Failed to delete the review");
    }
  };

  return (<>{deleted ? <></>: (
    <div className={styles.card}>
      <h3 className={styles.title}>{game.name || ""}</h3>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img src={game.image || tempImage} alt={game.name || ""} className={styles.gameImage} />
        </div>
        <div className={styles.reviewDetails}>
          <h2 className={styles.username}>User: {review.user}</h2>
          <div className={styles.likeRatingContainer}>
            <div>
            <p className={styles.likeCount}>{review.rating}/5 rating</p>

            </div>
            <div>
            <p className={styles.likeCount}>{likes} likes</p>

            </div>
          </div >
          {user && user.username && (
              <div >
                <button onClick={liked ? unlikeReview : likeReview}>{liked ? 'Unlike' : 'Like'}</button>
                {user.username === review.user && (
                  <>
                    <button style={{marginLeft:'10px'}} onClick={() => setIsEditing(!isEditing)}>Edit</button>
                    <button style={{marginLeft:'10px'}} onClick={deleteReview}>Delete</button>
                  </>
                )}
              </div>
            )}
          {isEditing ? (
            <div>
              <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} />
              <button onClick={editReview}>Save</button>
            </div>
          ) : (
            <p className={styles.review}>{editedText}</p>
          )}
        </div>
      </div>
    </div>)}</>
  );
};

export default MainPageReviewBox;
