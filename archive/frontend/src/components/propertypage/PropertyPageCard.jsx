import { FormEvent, useEffect, useState } from 'react';
import Card from '../common/Card';
import style from './PropertyPageCard.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth} from '../common/UserContext';
import PropertyCard from './PropertyCard';
import GamesCard  from './GamesCard';
import NotExistCard from './NotExistCard';
import { endpoint } from '../common/EndpointContext';
import Menu from '../common/Menu';



export default function PropertyPageCard() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loggedIn, handleLogin, handleLogout, } = useAuth();
    const [ notExist, setNotExist ] = useState(false);
    const [ propertyData, setPropertyData ] = useState(null);
    const [ gamesData, setGamesData ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);


    async function retrieveGames() {

        const { property_type, property_name } = location.state || {};
        if (!property_name) {
            navigate('/main');
            return;
        }
        

        if (property_name == null) {
            navigate('/main');
        }

        console.log("Property Name: ", property_name);
        console.log("Property Type: ", property_type);
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
        const propertyData = {
            property_name: data.property_name,
            property_type: data.property_type,
            property_description: data.property_description,
            property_image: data.property_image,
        }
        setPropertyData(propertyData);
        setGamesData(data.games);
        setIsLoading(false);
        return ;
    }

    useEffect(() => {
        retrieveGames();
    }, [location.state]);
    


    return (
        <div><Menu/>
        <div className={style.Container}>
            
            <Card>
                {isLoading ? <div>Loading...</div> :
                notExist ? <NotExistCard/> :
                <div><PropertyCard data ={propertyData} />
                <GamesCard data = {gamesData}/></div>}
            </Card>
        </div>
        </div>
    );
}