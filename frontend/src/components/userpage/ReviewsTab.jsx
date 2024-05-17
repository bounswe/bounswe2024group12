import styles from './DetailsTab.module.css';
import { useNavigate } from 'react-router-dom';
import MainPageReviewBox from '../mainpage/MainPageReviewBox';

export default function ReviewsTab({userReviews}) {
    const navigate = useNavigate();
    return (
        <div className={styles.Tab}>
            <div className={styles.userFavorites}>
                <div className={styles.vertical_list}>
                    <h2 className={styles.favoriteTitle}>User Reviews</h2>
                    <ul>
                        {userReviews.map((review) => (
                            <li className={styles.clickable}><MainPageReviewBox review={{user: review.user, rating: review.rating, likes: review.likes, description: review.text, game_slug:review.game_slug, id:review.id,}} /></li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
