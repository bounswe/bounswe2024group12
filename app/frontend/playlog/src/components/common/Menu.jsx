import React,{useState} from 'react';
import styles from './Menu.module.css';


const Menu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setisLoggedIn] = useState(true);
  const [username, setUserName] = useState()
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className={styles.menu}>
      <div className={styles.siteName}>PlayLog</div>
      <div className={styles.menuItems}>
        <button className={styles.menuButton}><a href="/lists" className={styles.menuLink}>Lists</a></button>
        <button className={styles.menuButton}><a href="/games" className={styles.menuLink}>Games</a></button>
        <input type="text" placeholder="Search games" className={styles.searchBar} />
        {isLoggedIn ? (
          <div className={styles.userInfo}>Welcome, {username}</div>
        ) : (
          <button className={styles.loginButton}> <a href="/" className={styles.loginLink}>Log in</a></button>
        )}
      </div>
    </div>
  );
};

export default Menu;
