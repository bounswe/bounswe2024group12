import React, {useState, useEffect} from "react";
import Menu from '../common/Menu';
import styles from "./UserPageComponents.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../common/UserContext";
import TabBar from "./TabBar";
import UserDetails from "./UserDetails";
import DetailsTab from "./DetailsTab";
import ListsTab from "./ListsTab";
import FollowsTab from "./FollowsTab";
import ReviewsTab from "./ReviewsTab";
import GamesTab from "./GamesTab";
import BookmarksTab from "./BookmarksTab";
import { endpoint } from "../common/EndpointContext";

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
    const [bookmarks, setBookmarks] = useState();
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState('details')

    async function fetchUserDetails(){
        try {
            let response = await request("details")
            const data = await response.json();
            setUserPicture("https://is2-ssl.mzstatic.com/image/thumb/Purple30/v4/f8/95/98/f89598d0-f118-c29b-0a78-eb985ad164a0/source/512x512bb.jpg");
            setUserDetails(data);
        }
        catch (error) {
            setUserPicture("");
            setUserDetails({gamesLiked: 0, reviewCount: 0, followers: 0, following: 0});
        }
    }
    async function fetchUserFavorites(){
        try{
            const response = await request('favorites')
            const data = await response.json();
            console.log(data);
            setFavoriteProperties(data.favoriteProperties);
            setFavoriteGames(data.favoriteGames);
        }
        catch (error) {
            const prop = ["turn-based strategy video game", "PlayStation 5", "Larian Studios", "Sony Interactive Entertainment", "Lene Raine"]
            const names = ["genre", "platform", "developer", "publisher", "composer"]
            const zipped = names.map((x, i) => [x, prop[i]]);

            setFavoriteProperties(zipped);
            setFavoriteGames(["Undertale", "Celeste", "Eastward"]);

        }
    }
    async function fetchRecentPopular(){
        try{
            let response = await request('popular-reviews')
            let data = await response.json();
            setPopularReviews(data.reviews);
            console.log("a", data);
            response = await request('recent-reviews')
            data = await response.json();
            console.log("B",data);
            //setRecentlyPlayedGames(data.recentlyPlayedGames);
            setRecentlyPlayedGames(["Undertale"]);
            setRecentlyReviewedGames(data.reviews);
            
        }
        catch (error) {
            console.error('Error:', error);
            setRecentlyPlayedGames(["g", "h", "i"]);
            setRecentlyReviewedGames([["j", 1], ["k",2], ["l",3]]);
            setPopularReviews([["m",4], ["n",5], ["o",6]]);
        }
    }
    async function fetchUserLists(){
        try{
            const response = await request('lists')
            const data = await response.json();
            console.log(data);
            setUserLists(data.userLists);
        }
        catch (error) {
            console.error('Error:', error);
            setUserLists(["p", "q", "r"]);
        }
    }
    async function fetchUserFollows(){
        try{
            let response = await request('followers-list')
            let data = await response.json()
            setUserFollows(data.followers);
            response = await request('following-list')
            data = await response.json()
            console.log("aa",data)
            setUserFollowing(data.following);
        }
        catch (error) {
            console.error('Error zp:', error);
            setUserFollows(["s", "t", "u"]);
            setUserFollowing(["v", "w", "x"]);
        }
    }
    async function fetchUserReviews(){
        try{
            const response = await request('all-reviews')
            const data = await response.json();
            console.log("c",data);
            setUserReviews(data.reviews);
        }
        catch (error) {
            console.error('Error:', error);
            setUserReviews(["y", "z", "aa"]);

        }
    }
    async function fetchUserGames(){
        try{
            const response = await request('games')
            const data = await response.json();
            console.log(data);
            setUserGames(data.userGames);
        }
        catch (error) {
            console.error('Error:', error);
            setUserGames(["ab", "ac", "ad"]);

        }
    }
    async function fetchBookmarks(){
        try{
            const response = await request('bookmarks')
            const data = await response.json();
            console.log(data);
            setBookmarks(data.bookmarks);
        }
        catch (error) {
            console.error('Error:', error);
            setBookmarks(["ae", "af", "ag"]);
        }
    }
        
    async function request(type){
        try{
            const response = await fetch(endpoint + 'user-' + type, {
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
        console.log("Target",id);
        try{
            const response = await fetch(endpoint + 'user-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({"username": id}),
            });
            const data = await response.json();
            if (data.exists === false){
                navigate('/404');
            }
        }
        catch (error) {
            console.error('Error:', error);
            navigate('/404');
        }
    }

    async function followUser(){
        try{
            const response = await fetch(endpoint + 'follow-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({"username": user.username, "followed_user": id}),
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
            const response = await fetch(endpoint + 'unfollow-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({"username": user.username, "followed_user": id}),
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
            const response = await fetch(endpoint + 'is-following', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({"username": user.username, "followed_user": id}),
            });
            const data = await response.json();

            setFollowing(data.is_following);
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if (user.username === ""){
            return;
        }
        checkUser();
        checkFollowing();
        fetchUserDetails();
        fetchUserFavorites();
        fetchRecentPopular();
        fetchUserLists();
        fetchUserFollows();
        fetchUserReviews();
        fetchUserGames();
        fetchBookmarks();
        setLoading(false);
    }, [user, id, following]);

    if (loading || userDetails === undefined || userFollowing === undefined ||recentlyReviewedGames === undefined || popularReviews === undefined || userReviews === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <div >
            <Menu/>
            <div className={styles.Container}>
            <UserDetails user={user} id={id} userDetails={userDetails} userPicture={userPicture} following={following} followUser={followUser} unfollowUser={unfollowUser}/>
            <TabBar user={user} id={id} setCurrentTab={setCurrentTab}/>
            {(currentTab === 'details') ? <DetailsTab favoriteProperties={favoriteProperties} favoriteGames={favoriteGames} recentlyPlayedGames={recentlyPlayedGames} recentlyReviewedGames={recentlyReviewedGames} popularReviews={popularReviews}/>
            : (currentTab === 'lists') ? (
            <ListsTab userLists={userLists}/>
            ) : (currentTab === 'follows') ? (
            <FollowsTab userFollows={userFollows} userFollowing={userFollowing}/>
            ) : (currentTab === 'reviews') ? (
           <ReviewsTab userReviews={userReviews}/>
            ) : (currentTab === 'games') ? (
            <GamesTab userGames={userGames}/>) : 
            (currentTab === 'bookmarks') ? (
            <BookmarksTab userReviews={bookmarks}/>) :
            null}
        </div> 
        </div>
    );
}
