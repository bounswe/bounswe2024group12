import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Menu.module.css';
import { useAuth } from './UserContext';

const Menu = () => {
  const [gameName, setGameName] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setGameName(e.target.value);
  };

  async function searchGame() {
    try {
      const response = await fetch('http://127.0.0.1:8000/search-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ game_name: gameName }),
      });

      if (!response.ok) {
        console.log('Search failed:', response.statusText);
        return;
      }

      const data = await response.json();
      console.log('Search success:', data);
      navigate('/game-details', { state: { gameData: data } });
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className={styles.menu}>
      <div className={styles.siteName}>PlayLog</div>
      <div className={styles.menuItems}>
        <button className={styles.menuButton}><a href="/lists" className={styles.menuLink}>Lists</a></button>
        <button className={styles.menuButton}><a href="/games" className={styles.menuLink}>Games</a></button>
        <input type="text" placeholder="Search games" value={gameName} onChange={handleSearchChange} className={styles.searchBar} />
        <button onClick={searchGame} className={styles.menuButton}>Search</button>
        {user ? (
          <div className={styles.userInfo}>Welcome, {user.username} </div>
        ) : (
          <button className={styles.loginButton}> <a href="/" className={styles.loginLink}>Log in</a></button>
        )}
      </div>
    </div>
  );
};

export default Menu;
