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

    useEffect(() => {
        console.log(user);
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

import React, {useState, useEffect} from "react";
import Menu from '../common/Menu';
import styles from "./UserPageComponents.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../common/UserContext";
import TabBar from "./TabBar";

export default function UserPageComponents(){
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [userPicture, setUserPicture] = useState();
    const [userDetails, setUserDetails] = useState();
    const [following, setFollowing] = useState(false);
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
    const [currentTab, setCurrentTab] = useState('details')

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
            setUserDetails({gamesPlayed: 0, reviewCount: 0, followers: 0, following: 0});
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
            const prop = ["a", "b", "c", "d", "e"]
            const names = ["genre", "platform", "developer", "publisher", "composer"]
            const zipped = names.map((x, i) => [x, prop[i]]);

            setFavoriteProperties(zipped);
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
            setRecentlyReviewedGames([["j", 1], ["k",2], ["l",3]]);
            setPopularReviews([["m",4], ["n",5], ["o",6]]);
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
                body: JSON.stringify({"username": id}),
            });
            return await response;
        }
            catch (error) {
                return error;
        }
    }   

    async function checkUser(){
        try{
            const response = await fetch('http://localhost:8000/user-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({"username": id}),
            });
            const data = await response.json();
            // if (data.exist === false){
            //     navigate('/404');
            // }
        }
        catch (error) {
            console.error('Error:', error);
            // navigate('/404');
        }
    }

    async function followUser(){
        try{
            const response = await fetch('http://localhost:8000/user-follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({"follower": user.username, "followed": id}),
            });
            const data = await response.json();
            if (data.success === true){
                setFollowing(true);
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    async function unfollowUser(){
        try{
            const response = await fetch('http://localhost:8000/user-unfollow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({"follower": user.username, "followed": id}),
            });
            const data = await response.json();
            if (data.success === true){
                setFollowing(false);
            }
        }

        catch (error) {
            console.error('Error:', error);
        }
    }

    async function checkFollowing(){
        try{
            const response = await fetch('http://localhost:8000/user-following', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({"follower": user.username, "followed": id}),
            });
            const data = await response.json();

            setFollowing(data.following);
        }
        catch (error) {
            console.error('Error:', error);
        }
    }



    useEffect(() => {
        checkUser();
        checkFollowing();
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
            
            <div className={styles.userDetails}>
                <img src={userPicture} alt="User Picture" className={styles.userPicture}/> 
                <h2 className={styles.username}>{id}</h2>
                <p className={styles.bio}>Games Played: {userDetails.gamesPlayed}</p>
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

            <TabBar user={user} id={id} setCurrentTab={setCurrentTab}/>
            {(currentTab === 'details') ? 
            <div>
                <div className={styles.userFavorites}>
                    <h2 className={styles.favoriteTitle}>Favorites</h2>
                    <div className={styles.favoriteProperties}>
                        <h3>Favorite Properties</h3>
                        <ul>
                            {favoriteProperties.map((property) => (
                                <li>{property[0]}: <text onClick={
                                    () => navigate('/property/' + property[1])
                                }>{property[1]}</text></li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.favoriteGames}>
                        <h3>Favorite Games</h3>
                        <ul>
                            {favoriteGames.map((game) => (
                                <li onClick={
                                    () => navigate('/game/' + game)
                                }>{game}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={styles.recentPopular}>
                    <h2 className={styles.recentPopularTitle}>Recently Played Games</h2>
                    <ul>
                        {recentlyPlayedGames.map((game) => (
                            <li onClick={
                                () => navigate('/game/' + game)
                            }>{game}</li>
                        ))}
                    </ul>
                    <h2 className={styles.recentPopularTitle}>Recently Reviewed Games</h2>
                    <ul>
                        {recentlyReviewedGames.map((game) => (
                            <li onClick={
                                () => navigate('/review/' + game[1])
                            }>{game[0]}</li>
                        ))}
                    </ul>
                    <h2 className={styles.recentPopularTitle}>Popular Reviews</h2>
                    <ul>
                        {popularReviews.map((game) => (
                            <li onClick={
                                () => navigate('/review/' + game[1])
                            }>{game[0]}</li>
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
                        <li onClick={
                            () => navigate('/user/' + follow)
                        }>{follow}</li>
                    ))}
                </ul>
                <h2 className={styles.userFollowingTitle}>Following</h2>
                <ul>
                    {userFollowing.map((following) => (
                        <li onClick={
                            () => navigate('/user/' + following)
                        }>{following}</li>
                    ))}
                </ul>
            </div>
            ) : (currentTab === 'reviews') ? (
            <div className={styles.userReviews}>
                <h2 className={styles.userReviewsTitle}>User Reviews</h2>
                <ul>
                    {userReviews.map((review) => (
                        <li onClick={
                            () => navigate('/review/' + review)
                        }>{review}</li>
                    ))}
                </ul>
            </div>
            ) : (currentTab === 'games') ? (
            <div className={styles.userGames}>
                <h2 className={styles.userGamesTitle}>User Games</h2>
                <ul>
                    {userGames.map((game) => (
                        <li onClick={
                            () => navigate('/game/' + game)
                        }>{game}</li>
                    ))}
                </ul>
            </div>) : null}
        </div> 
    );
}
