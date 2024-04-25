import React from 'react';
import styles from './MainPageReviewList.module.css';
import tempImage from "./temporaryassets/gamePicture.jpeg";
import MainPageReviewBox from './MainPageReviewBox';

const MainPageReviewLists = ({title="Featured Reviews", list=[]}) => {
    for(let i=0; i<3;i++){
        list.push({src:tempImage, name: "Witcher"})
    }
    return (
      <div>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.container}>
            {
                list.map((item)=>{
                    return(
                    <MainPageReviewBox />);
                })
            }
        </div>
      </div>
    );
  };

export default MainPageReviewLists;
