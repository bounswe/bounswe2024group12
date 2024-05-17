import styles from './DetailsTab.module.css';
import { useNavigate } from 'react-router-dom';

export default function GamesTab({userGames}) {
    const navigate = useNavigate();
    return (
        <div className={styles.Tab}>
            <div className={styles.userFavorites}>
                <div className={styles.vertical_list}>
                    <h2 className={styles.favoriteTitle}>User Games</h2>
                    <ul>
                        {userGames.map((game) => (
                            <li className={styles.clickable} onClick={
                                () => navigate('/game/' + game.replace(/ /g,"_").toLowerCase())
                            }>{game}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
