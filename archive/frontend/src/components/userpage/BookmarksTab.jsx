import styles from './DetailsTab.module.css';
import { useNavigate } from 'react-router-dom';

export default function BookmarksTab({userReviews}) {
    const navigate = useNavigate();
    return (
        <div className={styles.Tab}>
            <div className={styles.userFavorites}>
                <div className={styles.vertical_list}>
                    <h2 className={styles.favoriteTitle}>Bookmarked Reviews</h2>
                    <ul>
                        {userReviews.map((review) => (
                            <li className={styles.clickable} onClick={
                                () => navigate('/review/' + review)
                            }>{review}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
