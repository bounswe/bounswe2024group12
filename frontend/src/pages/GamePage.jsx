import GamePageComponents from "../components/gamepage/GamePageComponents";
import { useParams } from "react-router-dom";
import React,{useState, useEffect} from 'react';

export default function GamePage() {
    let { id } = useParams();
    const [error, setError] = useState("")
    const [game, setGame] = useState()
    async function fetchGame() {
        try {
            const response = await fetch('http://localhost:8000/game-info', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({ "game-name":id }),
            });
      
          if (!response.ok) {
            setError("Could not fetch the game");
            return;
          }
          const data = await response.json();
          setError("");
          setGame(data); //todo check when isil returns the format
        }
        catch (error) {
          console.error('Error:', error);
          setError("Could not fetch the game");
        }
      }
    return (
        <>
        {error !=="" ? <h1>{error}</h1> :<GamePageComponents game={game}/> }
        </>
        
    );
}