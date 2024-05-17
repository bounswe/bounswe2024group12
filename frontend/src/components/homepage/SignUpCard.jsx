import { useState, useEffect } from 'react';
import Card from '../common/Card';
import style from './SignUpCard.module.css';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../common/UserContext';
import TermsAndConditions from './agreements/TermsAndConditions';
import PrivacyAgreement from './agreements/PrivacyAgreement';
import { endpoint } from '../common/EndpointContext';


export default function SignUpCard() {
    const navigate = useNavigate();
    const [passwordErr, setPasswordErr] = useState("");
    const [usernameErr, setUsernameErr] = useState("");
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const { loggedIn, } = useAuth();

    useEffect(() => {
        if (loggedIn)
            navigate('/home');
    });

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');
        const username = formData.get('username');

        let passwordCriteria = checkPasswordCriteria(password);
        let usernameCriteria = checkUsernameCriteria(username);
        if (passwordCriteria !== "" || usernameCriteria !== "") {
            setPasswordErr(passwordCriteria);
            setUsernameErr(usernameCriteria);
            return;
        }
        else {
            console.log("Password meets criteria.");
        }


        console.log("Username: ", username);
        console.log("Email: ", email);
        console.log("Password", password);

        try {
            const response = await fetch(endpoint+'signup', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                console.log(response.statusText);
                setUsernameErr("Duplicate username or email.");
                setPasswordErr("");
                return;
            }

            const data = await response.json();
            console.log(data);
            navigate('/signup-success', { state: { email: email, signUpSuccess: true } });
        }

        catch (error) {
            console.error('Error:', error);
            setUsernameErr(error);
        }

    }

    function checkPasswordCriteria(string) {
        if (string.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        else if (string.length > 32) {
            return "Password must be at most 32 characters long.";
        }
        else if (string.search(/\d/) === -1) {
            return "Password must contain at least one digit.";
        }
        else if (string.search(/[a-z]/) === -1) {
            return "Password must contain at least one lowercase letter.";
        }
        else if (string.search(/[A-Z]/) === -1) {
            return "Password must contain at least one uppercase letter.";
        }
        else if (string.search(/[^a-zA-Z0-9!@#$%^&*()_+.,]/) !== -1) {
            return "Password must contain only letters, digits, and the following special characters: !@#$%^&*()_+.,";
        }
        else {
            return "";
        }
    }

    function checkUsernameCriteria(string) {
        if (string.length < 8) {
            return "Username must be at least 8 characters long.";
        }
        else if (string.length > 16) {
            return "Username must be at most 16 characters long.";
        }
        else if(string.match(/^[\d_]/)){
            return "Username cannot start with a number or underscore";
        }
        else if (string.search(/[^a-zA-Z0-9_]/) !== -1) {
            return "Username must contain only letters, digits and underscore.";
        }
        else {
            return "";
        }

    }
    const toggleTerms = (event) => {
        event.stopPropagation();
        setShowTerms(!showTerms)
    };
    const togglePrivacy = (event) => {
        event.stopPropagation();
        setShowPrivacy(!showPrivacy);
    }

    return (
        <>
            <div className={style.Container}>
                <Card>
                    <form onSubmit={handleSubmit} className={style.Form}>
                        <h1>Sign Up</h1>
                        <div style={{ width: '100%' }}>
                            <label>Username</label>
                            <input type='text' name='username' placeholder='Username' required />
                            <label>E-Mail</label>
                            <input type='email' name='email' placeholder='E-Mail' required />
                            <label>Password</label>
                            <input type='password' name='password' placeholder='Password' required />
                            {/* Privacy and terms*/}

                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row' }}>
                                <input
                                    type='checkbox'
                                    id='privacyPolicy'
                                    name='privacy'
                                    required
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <label htmlFor='privacyPolicy' style={{ marginLeft: '5px', paddingRight: '0px' }}>
                                    I agree to the
                                </label>
                                <span className={style.linkText} onClick={toggleTerms}>
                                    Terms & Conditions
                                </span>
                                <span> and </span>
                                <span className={style.linkText} onClick={togglePrivacy}>
                                    Privacy Policy
                                </span>.
                            </div>

                        </div>

                        <button type='submit' style={{ width: '100%' }}>Sign Up</button>
                        {passwordErr !== "" && <div className={style.Error}>{passwordErr}</div>}
                        {usernameErr !== "" && <div className={style.Error}>{usernameErr}</div>}
                    </form>

                </Card>

            </div>
            {showTerms && (
                <div className={style.contentCard}>
                    <TermsAndConditions />

                </div>
            )}
            {showPrivacy && (
                <div className={style.contentCard}>
                    <PrivacyAgreement />
                </div>
            )}
        </>
    );
}
