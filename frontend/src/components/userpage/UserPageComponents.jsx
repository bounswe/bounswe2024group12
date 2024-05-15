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
            setUserPicture("");
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
    function fetchBookmarks(){
        try{
            const response = request('bookmarks')
            const data = response.json();
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
            if (data.exist === false){
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
        fetchBookmarks();
        setLoading(false);
    }, []);

    if (loading) {
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
