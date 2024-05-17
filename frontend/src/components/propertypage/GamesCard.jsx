import { useEffect, useState } from "react";
import style from './GamesCard.module.css';
import { useNavigate } from 'react-router-dom';
import gamePlaceholder from '../../assets/game_placeholder.png'

export default function GamesCard({data}){
    const [gamesData, setGamesData] = useState([...data]);
    const navigate = useNavigate();

    function handleClick(game_slug){
        console.log(game_slug)
        navigate(`/game/${game_slug}`);
    }
    
    useEffect(() => {
        setGamesData(data);
    }, [data]);

    return (
        <div className={style.GamesBlock}>
            {gamesData.map((game) => {
                return (
                    <div className={style.GameBlock} onClick={()=>{handleClick(game.game_slug);}}>
                        <img width="200px" src={(game.image!=="" && game.image!=null) ? game.image : (game.logo!=="" && game.logo!=null) ? game.logo : gamePlaceholder} alt={game.name} />
                        <div className={style.GameInfoBlock}>
                        <div className={style.GameTitleBlock}>
                        <h1>{game.gameLabel}</h1>
                        <h3>Rating: {game.rating} / 5</h3>
                        </div>
                        <h4>{game.genreLabel!="" ? game.genreLabel : "genre unknown"}</h4>
                        <p>{game.gameDescription}</p>            
                        </div>
                    </div>
                );
            })}
        </div>
    );
}