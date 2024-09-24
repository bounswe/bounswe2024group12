import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Menu.module.css';
import { useAuth } from './UserContext';
import AnimatedLoader from './AnimatedLoader/AnimatedLoader';
import { endpoint } from './EndpointContext';
import debounce from 'lodash/debounce';


// import search icon from react-icons
import { FaSearch } from 'react-icons/fa';

const Menu = () => {

  const [gameName, setGameName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchProperty, setSearchProperty] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);


  useEffect(() => {
    setIsAnimating(true);
  }, []);

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

  

  
  const debouncedSearchGame = useCallback(
    debounce(async (query) => {
      setLoading(true);
      // if (query === 'users')
      //   {
      //     try {
      //       const response = await fetch(`${endpoint}search-user`, {
      //         method: 'POST',
      //         headers: {
      //           'Content-Type': 'application/json',
      //         },
      //         credentials: 'include',
      //         body: JSON.stringify({ search_term: query }),
      //       });

      //       if (!response.ok) {
      //         console.log('Search failed:', response.statusText);
      //         return;
      //       }

      //       const data = await response.json();
      //       setSuggestions(data.users);

      //     } catch (error) {
      //       console.error('Error:', error);
      //     }
      

      //   } 

      // else {
      try {
        const searchEndpoint = searchProperty ? `${endpoint}search-game-by/${searchProperty}/` : `${endpoint}search-game`;
        const response = await fetch(searchEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ search_term: query }),
        });
  
        if (!response.ok) {
          console.log('Search failed:', response.statusText);
          return;
        }
  
        const data = await response.json();
        if (searchProperty === '') {
          setSuggestions(data.games);
        } else {
          setSuggestions(data.results);
        }
        console.log('Suggestions:', suggestions);
      } catch (error) {
        console.error('Error:', error);
      } 
    // }
      setLoading(false);
    }, 1000), // 200ms debounce delay
    [searchProperty]
  );
  
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setGameName(query);
    if (query.length > 2) {
      debouncedSearchGame(query);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (selectedItem) => {
    if (searchProperty === '') {
      navigate(`/game/${selectedItem['game_slug']}`);
    }
    else {
      navigate('/property', { state: { property_type:searchProperty , property_name: selectedItem.gameLabel} });


    }
  };

  const handlePropertyChange = (e) => {
    setSearchProperty(e.target.value);
  };

  return (
    <div className={styles.menu}>
       <div
      onClick={() => navigate('/main')}
      className={`${styles.siteName} ${isAnimating ? styles.slideIn : ''}`}
    >
      PlayLog
    </div>
      <div className={styles.menuItems}>
        

      <select className={styles.propertyDropdown} onChange={handlePropertyChange} value={searchProperty}>
            <option value="">Search in Games...</option>
            <option value="genre">Search in Genre</option>
            <option value="publisher">Search in Publisher</option>
            <option value="developer">Search in Developer</option>
            <option value="platform">Search in Platform</option>
            <option value="composer">Search in Composer</option>
            <option value="director">Search in Director</option>
            <option value="country">Search in Country</option>
            {/* <option value="users">Search in Users</option> */}
          </select>
        <div className={styles.searchContainer}>
          {/* search by property dropdown */}
          

          <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search..."
              value={gameName}
              onChange={handleSearchChange}
            />
            {loading && 
              <div
                style={{position:'relative', top:'-5px', left:'-5px' }}
              >
                <AnimatedLoader/>
              </div>
            }  
          </div>  

          <div ref={ref} className={styles.suggestions}>
            {suggestions.map((suggestion) => (
             
              <div
                key={suggestion['gameLabel']}
                onClick={() => handleSuggestionClick(suggestion)}
                className={styles.suggestionItem}
              >
                {suggestion.gameLabel}
              </div>) 
            )}
          </div>
        </div>

        <button className={styles.menuButton}><a href="/lists" className={styles.menuLink}>Lists</a></button>
        <button className={styles.menuButton}><a href="/games" className={styles.menuLink}>Games</a></button>
       
        {user ? (
          <div onClick={()=>{navigate("/user/"+user.username)}} className={styles.userInfo}>Welcome, {user.username}</div>
        ) : (
          <button onClick={()=>{navigate("/")}} className={styles.loginButton}><a href="/" className={styles.loginLink}>Log in</a></button>
        )}
      </div>
    </div>
  );
};

export default Menu;
