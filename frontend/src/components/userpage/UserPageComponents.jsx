import React, {useState, useEffect} from "react";
import Menu from '../common/Menu';
import styles from "./UserPageComponents.module.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../common/UserContext";

export default function UserPageComponents(){
    const { user } = useAuth();
    const navigate = useNavigate();
    const [userPicture, setUserPicture] = useState();
    const [userDetails, setUserDetails] = useState();
    const [favoriteProperties, setFavoriteProperties] = useState();
    const [favoriteGames, setFavoriteGames] = useState();
    const [recentlyPlayedGames, setRecentlyPlayedGames] = useState();
    const [recentlyReviewedGames, setRecentlyReviewedGames] = useState();
    const [popularReviews, setPopularReviews] = useState();
    const [userLists, setUserLists] = useState();
    const [userFollows, setUserFollows] = useState();
    const [userFollowing, setUserFollowing] = useState();
    const [userReviews, setUserReviews] = useState();
    const [userGames, setUserGames] = useState();
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState('details');

    function fetchUserDetails(){
        try {
            const response = request('details')
            const data = response.json();
            console.log(data);
            setUserPicture(data.userPicture);
            setUserDetails(data.userDetails);
        }
        catch (error) {
            console.error('Error:', error);
            setUserPicture();
            setUserDetails();
        }
    }
    function fetchUserFavorites(){
        try{
            const response = request('favorites')
            const data = response.json();
            console.log(data);
            setFavoriteProperties(data.favoriteProperties);
            setFavoriteGames(data.favoriteGames);
        }
        catch (error) {
            console.error('Error:', error);
            setFavoriteProperties(["a", "b", "c"]);
            setFavoriteGames(["d", "e", "f"]);

        }
    }
    function fetchRecentPopular(){
        try{
            const response = request('recent-popular')
            const data = response.json();
            console.log(data);
            setRecentlyPlayedGames(data.recentlyPlayedGames);
            setRecentlyReviewedGames(data.recentlyReviewedGames);
            setPopularReviews(data.popularReviews);
        }
        catch (error) {
            console.error('Error:', error);
            setRecentlyPlayedGames(["g", "h", "i"]);
            setRecentlyReviewedGames(["j", "k", "l"]);
            setPopularReviews(["m", "n", "o"]);
        }
    }
    function fetchUserLists(){
        try{
            const response = request('lists')
            const data = response.json();
            console.log(data);
            setUserLists(data.userLists);
        }
        catch (error) {
            console.error('Error:', error);
            setUserLists(["p", "q", "r"]);
        }
    }
    function fetchUserFollows(){
        try{
            const response = request('follows')
            const data = response.json();
            console.log(data);
            setUserFollows(data.userFollows);
            setUserFollowing(data.userFollowing);
        }
        catch (error) {
            console.error('Error:', error);
            setUserFollows(["s", "t", "u"]);
            setUserFollowing(["v", "w", "x"]);
        }
    }
    function fetchUserReviews(){
        try{
            const response = request('reviews')
            const data = response.json();
            console.log(data);
            setUserReviews(data.userReviews);
        }
        catch (error) {
            console.error('Error:', error);
            setUserReviews(["y", "z", "aa"]);

        }
    }
    function fetchUserGames(){
        try{
            const response = request('games')
            const data = response.json();
            console.log(data);
            setUserGames(data.userGames);
        }
        catch (error) {
            console.error('Error:', error);
            setUserGames(["ab", "ac", "ad"]);

        }
    }
    async function request(type){
        try{
            const response = await fetch('http://localhost:8000/user-' + type, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({"username": user.username}),
            });
            return await response;
        }
            catch (error) {
                return error;
        }
    }   

    useEffect(() => {

        fetchUserDetails();
        fetchUserFavorites();
        fetchRecentPopular();
        fetchUserLists();
        fetchUserFollows();
        fetchUserReviews();
        fetchUserGames();
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Menu/>
            <div className={styles.tabBar}>
                <button className={styles.tabButton} onClick={() => setCurrentTab('details')}>Details</button>
                <button className={styles.tabButton} onClick={() => setCurrentTab('lists')}>Lists</button>
                <button className={styles.tabButton} onClick={() => setCurrentTab('follows')}>Follows</button>
                <button className={styles.tabButton} onClick={() => setCurrentTab('reviews')}>Reviews</button>
                <button className={styles.tabButton} onClick={() => setCurrentTab('games')}>Games</button>
            </div>

            <div className={styles.userDetails}>
                <img src={userPicture} alt="User Picture" className={styles.userPicture}/> 
                <h2 className={styles.username}>{user.username}</h2>
                <p className={styles.bio}>{userDetails}</p>
            </div>
            {(currentTab === 'details') ? 
            <div>
                <div className={styles.userFavorites}>
                    <h2 className={styles.favoriteTitle}>Favorites</h2>
                    <div className={styles.favoriteProperties}>
                        <h3>Favorite Properties</h3>
                        <ul>
                            {favoriteProperties.map((property) => (
                                <li>{property}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.favoriteGames}>
                        <h3>Favorite Games</h3>
                        <ul>
                            {favoriteGames.map((game) => (
                                <li>{game}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                
                <div className={styles.recentPopular}>
                    <h2 className={styles.recentPopularTitle}>Recently Played Games</h2>
                    <ul>
                        {recentlyPlayedGames.map((game) => (
                            <li>{game}</li>
                        ))}
                    </ul>
                    <h2 className={styles.recentPopularTitle}>Recently Reviewed Games</h2>
                    <ul>
                        {recentlyReviewedGames.map((game) => (
                            <li>{game}</li>
                        ))}
                    </ul>
                    <h2 className={styles.recentPopularTitle}>Popular Reviews</h2>
                    <ul>
                        {popularReviews.map((review) => (
                            <li>{review}</li>
                        ))}
                    </ul>
                </div>
            </div> : (currentTab === 'lists') ? (
            <div className={styles.userLists}>
                <h2 className={styles.userListsTitle}>User Lists</h2>
                <ul>
                    {userLists.map((list) => (
                        <li>{list}</li>
                    ))}
                </ul>
            </div>
            ) : (currentTab === 'follows') ? (
            <div className={styles.userFollows}>
                <h2 className={styles.userFollowsTitle}>Follows</h2>
                <ul>
                    {userFollows.map((follow) => (
                        <li>{follow}</li>
                    ))}
                </ul>
                <h2 className={styles.userFollowingTitle}>Following</h2>
                <ul>
                    {userFollowing.map((following) => (
                        <li>{following}</li>
                    ))}
                </ul>
            </div>
            ) : (currentTab === 'reviews') ? (
            <div className={styles.userReviews}>
                <h2 className={styles.userReviewsTitle}>User Reviews</h2>
                <ul>
                    {userReviews.map((review) => (
                        <li>{review}</li>
                    ))}
                </ul>
            </div>
            ) : (currentTab === 'games') ? (
            <div className={styles.userGames}>
                <h2 className={styles.userGamesTitle}>User Games</h2>
                <ul>
                    {userGames.map((game) => (
                        <li>{game}</li>
                    ))}
                </ul>
            </div>) : null}
        </div> 
    );
}
