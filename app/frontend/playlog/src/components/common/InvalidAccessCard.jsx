import { FormEvent, useState } from 'react';
import Card from '../common/Card';
import style from './Card.module.css';
import { useNavigate } from 'react-router-dom';

export default function InvalidAccessCard() {
  const navigate = useNavigate();

  function navigateHomePage(event) {
    navigate('/home');
  }

  return (
    <div className={style.Container}>
      <Card>
        <h1>Invalid access.</h1>
        <button style={{width:'100%'}} onClick={navigateHomePage}>
            Go back to Home Page
            </button>
      </Card>
      
    </div>
  );
}
