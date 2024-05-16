import { useEffect, useState } from "react";
import style from './GamesCard.module.css';
import { useNavigate } from 'react-router-dom';
import gamePlaceholder from '../../assets/game_placeholder.png'

export default function GamesCard({data}){
    const [gamesData, setGamesData] = useState([...data]);
    const navigate = useNavigate();

    function handleClick(game){
        console.log(game.name)
        const name = game.name.replace(/\s/g, '_');
        navigate(`/game/${name}`);
    }
    
    useEffect(() => {
        setGamesData(data);
    }, [data]);

    return (
        <div className={style.GamesBlock}>
            {gamesData.map((game) => {
                return (
                    <div className={style.GameBlock} onClick={()=>{handleClick(game);}}>
                        <img width="200px" src={(game.image!=="") ? game.image : gamePlaceholder} alt={game.name} />
                        <div className={style.GameInfoBlock}>
                        <div className={style.GameTitleBlock}>
                        <h1>{game.name}</h1>
                        <h3>Rating: {game.rating} / 5</h3>
                        </div>
                        <h4>{game.genre!=="" ? game.genre : "genre unknown"}</h4>
                        <p>{game.description}</p>            
                        </div>
                    </div>
                );
            })}
        </div>
    );
}