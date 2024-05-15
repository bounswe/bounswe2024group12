import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Menu.module.css';
import { useAuth } from './UserContext';
import AnimatedLoader from './AnimatedLoader/AnimatedLoader';



const Menu = () => {
  const [gameName, setGameName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    // Click outside to close suggestions
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  const handleSearchChange = async (e) => {
    setLoading(true);
    const query = e.target.value;
    setGameName(query);
    if (query.length > 2) {
      await searchGame(query);
    } else {
      setSuggestions([]);
    }
    setLoading(false);
  };

  const searchGame = async (query) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/search-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ game_name: query }),
      });

      if (!response.ok) {
        console.log('Search failed:', response.statusText);
        return;
      }

      const data = await response.json();
      setSuggestions(data.games);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSuggestionClick = (gameSlug) => {
    navigate(`/game-details/${gameSlug}`);
    setSuggestions([]); // Clear suggestions after click
  };

  return (
    <div className={styles.menu}>
      <div className={styles.siteName}> PlayLog</div>
      <div className={styles.menuItems}>
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          
        
        <input
            className={styles.searchInput}
            placeholder="Search games"
            value={gameName}
            onChange={handleSearchChange}
            
          />
          {loading && <div
          // Add inline style to add loader as 5px-5px
          style={{position:'relative', top:'-5px', left:'-5px' }}
          >
            <AnimatedLoader />
            </div>
            }  


        </div>  
        
          <div ref={ref} className={styles.suggestions}>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion['game-slug']}
                onClick={() => handleSuggestionClick(suggestion['game-slug'])}
                className={styles.suggestionItem}
              >
                {suggestion.gameLabel}
              </div>
            ))}
        </div>
          
        </div>
        <button className={styles.menuButton}><a href="/lists" className={styles.menuLink}>Lists</a></button>
        <button className={styles.menuButton}><a href="/games" className={styles.menuLink}>Games</a></button>
       
        {user ? (
          <div className={styles.userInfo}>Welcome, {user.username}</div>
        ) : (
          <button className={styles.loginButton}><a href="/" className={styles.loginLink}>Log in</a></button>
        )}
      </div>
    </div>
  );
};

export default Menu;
