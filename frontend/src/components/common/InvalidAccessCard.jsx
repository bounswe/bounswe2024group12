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
    <div style={{"max-width":'30%', margin: "20px auto"}}>
      <Card>
        <h1 style={{"text-align":"center"}} >Invalid access.</h1>
        <button style={{width:'100%'}} onClick={navigateHomePage}>
            Go back to Home Page
            </button>
      </Card>
      
    </div>
  );
}
