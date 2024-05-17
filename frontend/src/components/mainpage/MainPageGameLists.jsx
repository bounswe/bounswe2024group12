import React,{useState, useEffect} from 'react';
import styles from './MainPageGameLists.module.css';
import {useNavigate} from 'react-router-dom';
import { endpoint } from '../common/EndpointContext';

const MainPageGameLists = ({title="Featured Games", type=""}) => {
  const navigator = useNavigate();

    const [list, setList] = useState([]);
    const [error, setError] = useState("")
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
      }
    }
    useEffect(() => {
      if(type==="popular"){
        fetchPopularGames();
      }else if (type="new"){
        fetchNewGames()
      }
    }, []);


    function handleClick(id) {
      navigator(`/game/${id}`);
    }
    return (<>
    {error!=="" ?  <div className={styles.title}> <h6>{error}</h6> </div> :(<div>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.container}>
            {
               list && list.length && list.map((game)=>{
                    return(
                    <div className={styles.imageContainer} onClick={()=>{handleClick(game["game_slug"])}} >
                    <img src={game.image} alt={game.gameLabel} className={styles.image} /> </div>);
                })
            }
        </div>
      </div>)}
    </>
      
    );
  };

export default MainPageGameLists;
