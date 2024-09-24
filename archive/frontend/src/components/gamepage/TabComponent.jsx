import React, { useEffect, useState } from 'react';
import styles from './TabComponent.module.css';
import MainPageReviewLists from '../mainpage/MainPageReviewList';
import styles2 from '../mainpage/MainPageComponents.module.css'; 
import { useAuth } from '../common/UserContext';
import { endpoint } from '../common/EndpointContext';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';


const TabComponent = ({game}) => {
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
          className={`${styles.tabButton} ${activeTab === 'Reviews' && styles.active}`}
          onClick={() => handleTabClick('Reviews')}
        >
          Reviews
        </button>
      </div>
      <div className={styles.tabContent}>
        {game && activeTab === 'Game' && <GameComponent game={game} />}
        {game && activeTab === 'Characters' && <CharactersComponent game={game} />}
        {game && activeTab === 'Reviews' && <ReviewsComponent game={game}/>}
      </div>
    </div>
  );
};




const GameComponent = ({ game }) => {
  const navigate = useNavigate();

  const navigateToProperty = (property_type, property_name) => {
    console.log(property_type, property_name)
    navigate('/property', { state: { property_type, property_name } });
  };

  return (
    <div style={{ border: '1px solid var(--highlight-color)', borderRadius: '8px', padding: '16px', width: '60%', margin: '16px auto', fontFamily: 'Arial, sans-serif', display:'flex',"align-items":"center", "flex-direction":"column" }}>
      <Card>
      <h2>{game.gameLabel || 'Game Title Unavailable'}</h2>
      </Card>
      
      {game.logo && (
        <img src={game.logo} alt={`${game.gameLabel} logo`} style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }} />
      )}
      
      {game.image!=null ? (
        <img src={game.image} alt={`${game.gameLabel} screenshot`} style={{ width: '100%', borderRadius: '8px' }} />
      ) : (
        <div>
          
        </div>
      )}

      {game.gameDescription && (
        <p>
          <strong>Description:</strong> {game.gameDescription}
        </p>
      )}
      {game.publication_date && (
        <p>
          <strong>Publication Date:</strong> {new Date(game.publication_date).toLocaleDateString()}
        </p>
      )}
      
      {game.genreLabel && (
        <p>
          <strong>Genre:</strong> {game.genreLabel && <span onClick={() => navigateToProperty('genre', game.genreLabel)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{game.genreLabel}</span>}
        </p>
      )}
      {game.publisherLabel && (
        <p>
          <strong>Publisher:</strong> {game.publisherLabel && <span onClick={() => navigateToProperty('publisher', game.publisherLabel)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{game.publisherLabel}</span>}
        </p>
      )}
      
      {game.platformLabel && (
        <p>
          <strong>Platform:</strong> <span onClick={() => navigateToProperty('platform', game.platformLabel)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{game.platformLabel}</span>
        </p>
      )}
      {game.countryLabel && (
        <p>
          <strong>Country:</strong> <span onClick={() => navigateToProperty('country', game.countryLabel)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{game.countryLabel}</span>
        </p>
      )}
      {game.composerLabel && (
        <p>
          <strong>Composer:</strong> <span onClick={() => navigateToProperty('composer', game.composerLabel)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{game.composerLabel}</span>
        </p>
      )}
      {game.screenwriterLabel && (
        <p>
          <strong>Screenwriter:</strong> <span onClick={() => navigateToProperty('screenwriter', game.screenwriterLabel)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{game.screenwriterLabel}</span>
        </p>
      )}
      
      {/* 
      <a href={`http://example.com/games/${game.game_slug}`} style={{ display: 'inline-block', marginTop: '8px', padding: '8px 16px', backgroundColor: '#007BFF', color: '#FFF', textDecoration: 'none', borderRadius: '4px' }}>
        More about this game
      </a> 
      */}
    </div>
  );
};





const CharactersComponent = ({ game }) => {
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState("");
  const { game_slug } = game;

  useEffect(() => {
    async function fetchGame() {
      if (game_slug) {
        try {
          const response = await fetch(endpoint + 'game-characters/' + game_slug + "/", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok) {
            setError("Could not fetch the game");
            return;
          }

          const data = await response.json();
          setError("");
          setCharacters(data.characters);
        } catch (error) {
          console.error('Error:', error);
          setError("Could not fetch the game");
        }
      }
    }
    fetchGame();
  }, [game, game_slug]);
  return (
    <div>
      {error && <p>{error}</p>}
      {!error && (!characters || characters.length === 0) && <p>No characters found</p>}
      <div className="characters-list">
        { characters && characters.map((character, index) => (
          <div key={index} className="character-card">
            <h3>{character.characterLabel || "Unknown Character"}</h3>
            <p>{character.characterDescription || "No description available"}</p>
            {character.image ? (
              <img src={character.image} alt={character.characterLabel} style={{"width":"100%"}}/>
            ) : (
              <div className="placeholder-image">No Image Available</div>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        .characters-list {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .character-card {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 16px;
          width: 200px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .character-card h3 {
          margin: 0 0 8px;
        }
        .character-card p {
          margin: 0 0 8px;
        }
        .character-card img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }
        .placeholder-image {
          width: 100%;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f0f0;
          border-radius: 4px;
          color: #aaa;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

const CreditsComponent = () => {
  return <div>Credits Component</div>;
};

const ReviewsComponent = ({ game }) => {
  const { game_slug } = game;
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // New state for success message
  const { user } = useAuth();
  const [refetch, setRefetch] =useState(false)
  const createReview = async () => {
    try {
      const response = await fetch(endpoint + 'create-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, text, user: user.username, game: game_slug }),
        credentials: 'include'
      });

      if (!response.ok) {
        setError("Failed to create the review");
        return;
      }

      setSuccess(true); // Set success state to true
      console.log("Review created successfully");
    } catch (error) {
      console.error('Error:', error);
      setError("Failed to create the review");
    }
  };

  return (
    <>
      <div className={styles.Form} style={{"display":"flex", "flex-direction":"column", "align-items":"center"}}>
        <h2 style={{"font-size":"28px","color":"var(--highlight-color)"}}>Create Review</h2>
        <div style={{"width":"10%"}}>
          <label style={{"font-size":"20px"}} htmlFor="rating">Rating:</label>
          <input
            style={{
              "width":"100%",
              "text-align":"center"

            }}
            type="number"
            id="rating"
            value={rating}
            min="0"
            max="5"
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 0 && value <= 5) {
                setRating(value);
              }
            }}
          />
        </div>
        <div style={{"width":"70%","display":"flex", "flex-direction":"column", "align-items":"center"}}>
          <label style={{"font-size":"20px"}}htmlFor="text" >Review:</label>
          <textarea style={{"width":"70%","height":"10vh", "font":"arial", "font-size":"16px", "background-color":"#212121","color":"white"}} id="text" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <button onClick={createReview}>Submit Review</button>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>Review submitted successfully!</p>} {/* Render success message */}
      </div>
      <div className={styles2.reviewList}>
      <MainPageReviewLists className={styles2.reviewItem} title="Recent Reviews" id={game_slug} type={"recent"} refetch={refetch} setRefetch={setRefetch} />
        <MainPageReviewLists className={styles2.reviewItem} title="Popular Reviews" id={game_slug} type={"popular"} />
      </div>
    </>
  );
};


export default TabComponent;
