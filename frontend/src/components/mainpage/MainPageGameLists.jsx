import React from 'react';
import styles from './MainPageGameLists.module.css';
import tempImage from "../temporaryassets/gamePicture.jpeg";
const MainPageGameLists = ({title="Featured Games", list=[]}) => {
    for(let i=0; i<10;i++){
        list.push({src:tempImage, name: "Witcher"})
    }
    return (
      <div>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.container}>
            {
                list.map(({src, name})=>{
                    return(
                    <div className={styles.imageContainer}>
                    <img src={src} alt={name} className={styles.image} /> </div>);
                })
            }
        </div>
      </div>
    );
  };

export default MainPageGameLists;
