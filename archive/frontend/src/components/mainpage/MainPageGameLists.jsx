import React, { useState, useEffect, useRef } from 'react';
import styles from './MainPageGameLists.module.css';
import { useNavigate } from 'react-router-dom';
import { endpoint } from '../common/EndpointContext';
import ComponentLoader from '../common/ComponentLoader/ComponentLoader';
import Card from '../common/Card';

const MainPageGameLists = ({ title = "Featured Games", type = "" }) => {
  const navigate = useNavigate();
  const listRef = useRef(null);

  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchPopularGames() {
    try {
      const response = await fetch(endpoint + 'popular-games', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        setError("Could not fetch Popular Games");
        return;
      }
      const data = await response.json();
      setError("");
      setList(data.games);
    }
    catch (error) {
      console.error('Error:', error);
      setError("Could not fetch Popular Games");
    } finally {
      setLoading(false);
    }
  }

  async function fetchNewGames() {
    try {
      const response = await fetch(endpoint + 'new-games', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        setError("Could not fetch New Games");
        return;
      }
      const data = await response.json();
      setError("");
      setList(data.games);
    }
    catch (error) {
      console.error('Error:', error);
      setError("Could not fetch New Games");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (type === "popular") {
      fetchPopularGames();
    } else if (type === "new") {
      fetchNewGames();
    }
  }, [type]);

  function handleClick(id) {
    navigate(`/game/${id}`);
  }

  function scrollList(direction) {
    const container = listRef.current;
    const scrollAmount = 200 + 10; // Width of card + margin-right
    if (direction === 'prev') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  }

  return (
    <>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <ComponentLoader />
        </div>
      ) : error !== "" ? (
        <div className={styles.title}>
          <h6>{error}</h6>
        </div>
      ) : (
        <div >
          <div style={{margin:'20px 0px'}}>
          <Card>
          <h2 className={styles.title}>{title}</h2>
          </Card>
          </div>
          <div className={styles.container}>
            <button onClick={() => scrollList('prev')} className={styles.scrollButton}>{"<"}</button>
            <div className={styles.imageContainer} ref={listRef}>
              {list && list.length && list.map((game) => (
                <div className={styles.card} onClick={() => handleClick(game.game_slug)} key={game.game_slug}>
                  <Card interactive>
                    <img src={game.image} alt={game.gameLabel} className={styles.image} />
                  </Card>
                </div>
              ))}
            </div>
            <button onClick={() => scrollList('next')} className={styles.scrollButton}>{">"}</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MainPageGameLists;