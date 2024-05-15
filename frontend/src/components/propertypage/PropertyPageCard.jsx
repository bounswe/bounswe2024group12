import { FormEvent, useEffect, useState } from 'react';
import Card from '../common/Card';
import style from './PropertyPageCard.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth} from '../common/UserContext';
import PropertyCard from './PropertyCard';
import GamesCard  from './GamesCard';
import NotExistCard from './NotExistCard';
import { endpoint } from '../common/EndpointContext';


export default function PropertyPageCard({property_type, property_name}) {
    const navigate = useNavigate();
    const { loggedIn, handleLogin, handleLogout, } = useAuth();
    const [ notExist, setNotExist ] = useState(false);
    const [ propertyData, setPropertyData ] = useState(null);
    const [ gamesData, setGamesData ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);


    async function retrieveGames() {
        if (property_name == null) {
            navigate('/main');
        }
        const response = await fetch(endpoint + 'property', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ property_type, property_name }),
        });
        
        if (!response.ok) {
            setNotExist(true);
            return;
        }

        const data = await response.json();
        setNotExist(false);
        console.log(data);
        setPropertyData(data.property);
        setGamesData(data.games);
        setIsLoading(false);
        return ;
    }

    useEffect(() => {
        retrieveGames();
    }, []);
    


    return (
        <div className={style.Container}>
            <Card>
                {isLoading ? <div>Loading...</div> :
                notExist ? <NotExistCard/> :
                <div><PropertyCard data ={propertyData} />
                <GamesCard data = {gamesData}/></div>}
            </Card>
        </div>
    );
}