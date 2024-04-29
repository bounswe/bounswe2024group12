import { FormEvent, useContext } from 'react';
import Card from '../common/Card';
import style from './HomeCard.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/UserContext';

export default function HomeCard() {
    const navigate = useNavigate();
    const { loggedIn, handleLogin, handleLogout, } = useAuth();

    async function handleSignUpBtn(event) {
        navigate('/signup');
    };

    async function handleLoginBtn(event) {
        navigate('/login');
    };

    async function goToMainPage(event) {
        navigate('/main');
    }
    


    return (
        <div className={style.Container}>
            <Card>
                <h1>Welcome to Playlog</h1>
                <p>Playlog is a platform where you can share your favorite games and playlists with your friends.</p>
                {!loggedIn && <button type='button' style={{ width: '100%' }} onClick={handleSignUpBtn} >Sign Up</button>}
                {!loggedIn && <button type='button' style={{ width: '100%' }} onClick={handleLoginBtn}>Login</button>}
                {loggedIn && <button type='button' style={{ width: '100%', fontSize:'25px', fontWeight:'500' }} onClick={goToMainPage}>Discover the World of Games</button>}
                {loggedIn && <button type='button' style={{ width: '100%' }} onClick={handleLogout}>Logout</button>}
                {!loggedIn &&  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '5px' }}>
            <a href="/main" style={{ color: 'var(--highlight-color)' }}>Continue as Guest</a>
        </div>}
            </Card>
        </div>
    );
}