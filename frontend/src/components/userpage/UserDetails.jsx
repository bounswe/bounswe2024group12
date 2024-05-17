import styles from './UserDetails.module.css';
import propertyPlaceholder from '../../assets/property_placeholder.png'

export default function UserDetails({user, id, userDetails, userPicture, following, followUser, unfollowUser}){

    return (
        <div className={styles.userDetails}>
                        <div className={styles.info}>
                            <img src={(userPicture!=="" && userPicture!=null) ? userPicture : propertyPlaceholder} alt="User Picture" className={styles.userPicture}/> 
                            <div className={styles.name}>
                                <h2 className={styles.username}>{id}</h2>
                                <a className={styles.property} href="https://www.youtube.com/watch?v=gWOXSh4-Iuc">gamer</a>
                            </div>
                        </div>
                        <div className={styles.stats}>
                                <p className={styles.bio}>Games Played: {userDetails.gamesLiked}</p>
                                <p className={styles.bio}>Reviews: {userDetails.reviewCount}</p>
                                <p className={styles.bio}>Followers: {userDetails.followers}</p>
                                <p className={styles.bio}>Following: {userDetails.following}</p>

                        {(user.username !== id && user.username !== "Guest" && !following ) ? 
                        <button className={styles.followButton} onClick={
                            () => followUser()
                        }>Follow</button> : 
                        (user.username !== id && user.username !== "Guest" && following) ?
                        <button className={styles.followButton} onClick={
                            () => unfollowUser()
                        }>Unfollow</button> : null}
                        </div>
        </div>
        )
}