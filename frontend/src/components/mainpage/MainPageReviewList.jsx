import React, { useState, useEffect } from 'react';
import styles from './MainPageReviewList.module.css';
import tempImage from "../temporaryassets/gamePicture.jpeg";
import MainPageReviewBox from './MainPageReviewBox';

const MainPageReviewLists = ({title="Featured Reviews", id, type}) => {
    const [list, setList] =useState([])
    const [error, setError] =useState("")
    async function fetchReviews() {
      try {
          const response = await fetch('http://localhost:8000/' + type==="recent" ? "recentReviews" : "popularReviews", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(id ? { "game_id":id }: {}),
          });
    
        if (!response.ok) {
          setError("Could not fetch recent reviews");
          return;
        }
        const data = await response.json();
        setError("");
        setList(data.reviews); 
      }
      catch (error) {
        console.error('Error:', error);
        setError("Could not fetch recent reviews");
      }
    }
    
    useEffect(()=>{

      fetchReviews()
    
  },[id])
    return (
      <div>
        <h2 className={styles.title}>{title+" "}</h2>
        <div className={styles.container}>
            {
                list.map((item)=>{
                    return(
                    <MainPageReviewBox review={item}/>);
                })
            }
        </div>
      </div>
    );
  };

export default MainPageReviewLists;
