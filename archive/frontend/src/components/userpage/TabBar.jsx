import styles from './TabBar.module.css';
import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';

export default function TabBar({user, id, setCurrentTab}){
    const navigate = useNavigate();
    console.log(setCurrentTab)

    return (
        <div className={styles.tabBar}>
            <button className={styles.tabButton} onClick={() => setCurrentTab('details')}>Details</button>
            <button className={styles.tabButton} onClick={() => setCurrentTab('lists')}>Lists</button>
            <button className={styles.tabButton} onClick={() => setCurrentTab('follows')}>Follows</button>
            <button className={styles.tabButton} onClick={() => setCurrentTab('reviews')}>Reviews</button>
            <button className={styles.tabButton} onClick={() => setCurrentTab('games')}>Games</button>
            {user.username === id && user.username !== "Guest" ? <button className={styles.tabButton} onClick={() => setCurrentTab('bookmarks')}>Bookmarks</button> : null}
            {user.username === id && user.username !== "Guest" ? <button className={styles.tabButton} onClick={() => navigate('/edit')}>Edit</button> : null}
        </div>
)
}
