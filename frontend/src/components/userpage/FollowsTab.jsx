import styles from './DetailsTab.module.css';
import { useNavigate } from 'react-router-dom';

export default function FollowsTab({userFollows, userFollowing}) {
    const navigate = useNavigate();

return(
    <div className={styles.Tab}>
        <div className={styles.userFavorites}>
            <div className={styles.vertical_list}>
                <h2 className={styles.favoriteTitle}>Followers</h2>
                <ul>
                    {userFollows.map((follow) => (
                        <li className={styles.clickable} onClick={
                            () => navigate('/user/' + follow)
                        }>{follow}</li>
                    ))}
                </ul>
            </div>
        </div>
        <div className={styles.userFavorites}>
            <div className={styles.vertical_list}>  
                <h2 className={styles.favoriteTitle}>Following</h2>
                <ul>
                    {userFollowing.map((following) => (
                        <li className={styles.clickable} onClick={
                            () => navigate('/user/' + following)
                        }>{following}</li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
    )
}