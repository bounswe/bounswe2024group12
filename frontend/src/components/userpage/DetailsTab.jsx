import styles from './DetailsTab.module.css'
import { useNavigate } from 'react-router-dom';


export default function DetailsTab({favoriteProperties, favoriteGames, recentlyPlayedGames, recentlyReviewedGames, popularReviews}) {
    const navigate = useNavigate();
    
    return(
            <div className={styles.Tab}>
                <div className={styles.userFavorites}>
                    <h2 className={styles.favoriteTitle}>Favorites</h2>
                    <div className={styles.favoriteCard}>
                        <div className={styles.favorites}>
                            <h3>Favorite Properties</h3>
                            <ul>
                                {favoriteProperties.map((property) => (
                                    <li><text className={styles.underlined}>{property[0]}</text> <text className={styles.clickable} onClick={
                                        () => navigate('/property',{state: {property_type:property[0],property_name:property[1]}})
                                    }>{property[1]}</text></li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.favorites}>
                            <h3>Favorite Games</h3>
                            <ul>
                                {favoriteGames.map((game) => (
                                    <li className={styles.clickable} onClick={
                                        () => navigate('/game/' + game.replace(" ", "-").toLowerCase())
                                    }>{game}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.userFavorites}>
                    <h2 className={styles.favoriteTitle}>Recently</h2>
                    <div className={styles.favorites}>
                        <h3>Recently Played Games</h3>
                        <ul>
                            {recentlyPlayedGames.map((game) => (
                                <li className={styles.clickable} onClick={
                                    () => navigate('/game/' + game)
                                }>{game}</li>
                            ))}
                        </ul>
                        <h3 className={styles.favoriteTitle}>Recently Reviewed</h3>
                        <ul>
                            {recentlyReviewedGames.map((game) => (
                                <li className={styles.clickable} onClick={
                                    () => navigate('/review/' + game[1])
                                }>{game[1]}<br/>{game[3]}<br/>{game[4]}</li>
                            ))}
                        </ul>
                    <h3 className={styles.favoriteTitle}>Popular Reviews</h3>
                    <ul>
                        {popularReviews.map((game) => (
                            <li className={styles.clickable} onClick={
                                () => navigate('/review/' + game[1])
                            }>{game[1]}<br/>{game[3]}<br/>{game[4]}</li>
                        ))}
                    </ul>
                    </div>
                </div>
            </div>
        )
    }