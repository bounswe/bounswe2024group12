import { FormEvent, useState } from 'react';
import Card from '../common/Card';
import style from './SignUpSuccessCard.module.css';
import { useLocation } from 'react-router-dom'
import InvalidAccessCard from '../common/InvalidAccessCard';

export default function SignUpSuccessCard() {
    const location = useLocation();
    console.log(location.state)
    if (location.state === null) {
        return (
            <div className={style.Container}>
                <InvalidAccessCard />
            </div>);
    }
    const email = location.state.email;
    return (
        <div className={style.Container}>
            <Card>
                <h1>You successfully signed up!</h1>
                <p>Please check your mailbox for confirmation e-mail.</p>
            </Card>
        </div>
    );
}