import { useEffect, useState } from 'react';
import Card from '../common/Card';
import style from './SignUpSuccessCard.module.css';
import { useLocation } from 'react-router-dom'
import InvalidAccessCard from '../common/InvalidAccessCard';
import {useNavigate} from 'react-router-dom';

export default function SignUpSuccessCard() {
    const [countdown, setCountdown] = useState(10);
    const location = useLocation();
    const navigate = useNavigate();

    console.log(location.state)

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((currentCountdown) => currentCountdown - 1);
        }, 1000);

        const timer = setTimeout(() => {
            navigate('/login'); 
        }, 10000); 
        
        return () => {
            clearInterval(interval);
            clearTimeout(timer); // Cleanup the interval and timer when the component unmounts
        };
    }, [navigate]);

    if (location.state === null) {
        return (
            <div className={style.Container}>
                <InvalidAccessCard />
            </div>);
    }
    const email = location.state.email;
    return (
        <div className={style.Container}>
            <Card>
                <h1>You successfully signed up!</h1>
                <p>Your confirmation mail is sent to {email}. Please check your inbox.</p>
                <p style={{color:'var(--highlight-color)', fontWeight:'400'}}>You will be redirected to the login page in {countdown} seconds.</p>
            </Card>
        </div>
    );
}