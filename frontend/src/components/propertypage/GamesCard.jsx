import { useEffect, useState } from "react";
import style from './GamesCard.module.css';

export default function GamesCard({data}){
    const [gamesData, setGamesData] = useState([...data]);
    
    useEffect(() => {
        setGamesData(data);
    }, [data]);

    return (
        <div className={style.GamesBlock}>
            {gamesData.map((game) => {
                return (
                    <div className={style.GameBlock}>
                        <img width="200px" src={game.image} alt={game.name} />
                        <div className={style.GameInfoBlock}>
                        <div className={style.GameTitleBlock}>
                        <h1>{game.name}</h1>
                        <h3>Rating: {game.rating} / 5</h3>
                        </div>
                        <h4>{game.genre}</h4>
                        
                        <p>{game.description}</p>            
                        </div>
                    </div>
                );
            })}
        </div>
    );
}