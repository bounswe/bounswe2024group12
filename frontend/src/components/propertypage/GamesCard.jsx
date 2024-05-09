import { useEffect, useState } from "react";

export default function GamesCard({data}){
    const [gamesData, setGamesData] = useState([...data]);
    
    useEffect(() => {
        setGamesData(data);
    }, [data]);

    return (
        <div>
            {gamesData.map((game) => {
                return (
                    <div>
                        <h1>{game.name}</h1>
                        <h3>{game.rating}</h3>
                        <img src={game.image} alt={game.name} />
                        <p>{game.description}</p>
                        <p>{game.genre}</p>
                    </div>
                );
            })}
        </div>
    );
}