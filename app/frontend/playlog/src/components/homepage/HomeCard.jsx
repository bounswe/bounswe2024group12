import { FormEvent } from 'react';
import Card from '../common/Card';
import style from './HomeCard.module.css';
import { useNavigate } from 'react-router-dom';

export default function HomeCard() {
    const navigate = useNavigate();

    async function handleSignUpBtn(event) {
        navigate('/signup');
    };

    async function handleLoginBtn(event) {
        navigate('/login');
    };


    return (
        <div className={style.Container}>
            <Card>
                <h1>Welcome to Playlog</h1>
                <p>Playlog is a platform where you can share your favorite games and playlists with your friends.</p>
                <button type='button' style={{ width: '100%' }} onClick={handleSignUpBtn} >Sign Up</button>
                <button type='button' style={{ width: '100%' }} onClick={handleLoginBtn}>Login</button>
            </Card>
        </div>
    );
}