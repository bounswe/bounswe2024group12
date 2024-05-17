import React, { useState, useEffect } from 'react';
import styles from './MainPageReviewList.module.css';
import tempImage from "../temporaryassets/gamePicture.jpeg";
import MainPageReviewBox from './MainPageReviewBox';
import { endpoint } from '../common/EndpointContext';

const MainPageReviewLists = ({title="Featured Reviews", id, type, refetch, setRefetch}) => {
    const [list, setList] =useState([])
    const [error, setError] =useState("")
    async function fetchReviews() {
      try {
      console.log((type==="recent" ? "recent-reviews" : "popular-reviews") + (id ? '-game' : ""))
          const response = await fetch(endpoint + (type==="recent" ? "recent-reviews" : "popular-reviews") + (id ? '-game' : ""), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body:JSON.stringify({game: id })
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

      
    
  },[id, refetch])
    return (
      <div>
        <h2 className={styles.title}>{title+" "}</h2>
        <div className={styles.container}>
            {
                list.map((item)=>{
                    return(
                    <MainPageReviewBox review={item} />);
                })
            }
        </div>
      </div>
    );
  };

export default MainPageReviewLists;
