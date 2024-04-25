import { FormEvent, useState } from 'react';
import Card from '../common/Card';
import style from './SignUpCard.module.css';
import { useNavigate } from 'react-router-dom'
import { sha256 } from 'js-sha256';


export default function SignUpCard() {
    const navigate = useNavigate();
    const [passwordErr, setPasswordErr] = useState("");
    const [usernameErr, setUsernameErr] = useState("");

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

        let hashedEmail = sha256(email);
        let hashedPassword = sha256(password);
        
        console.log("Username: ", username);
        console.log("Email: ", hashedEmail);
        console.log("Password", hashedPassword);

        try {
            const response = await fetch('http://localhost:3001/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, hashedEmail, hashedPassword }),
            });
            const data = await response.json();
            console.log(data);
        }
        catch (error) {
            console.error('Error:', error);
        }

        navigate('/signup-success', {state: {email: email, signUpSuccess: true}});
    }

    function checkPasswordCriteria(string){
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

    function checkUsernameCriteria(string){
        if (string.length < 8) {
            return "Username must be at least 8 characters long.";
        }
        else if (string.length > 16){
            return "Username must be at most 16 characters long.";
        }
        else if (string.search(/[^a-zA-Z0-9_]/) !== -1) {
            return "Username must contain only letters, digits and underscore.";
        }
        else {
            return "";
        }
    }

    return (
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
                        
                        <div style={{ marginTop: '10px', display:'flex' ,flexDirection:'row' }}>
                            <input
                                // type agree to terms and conditions and privacy policy whent its not checked
                                type='checkbox'
                                id='privacyPolicy'
                                name='privacy'
                                required
                                style={{ width: '20px', height: '20px', cursor: 'pointer'}}

                                
                                

                            />
                            <label htmlFor='privacyPolicy' style={{ marginLeft: '5px' }}>
                                I agree to the <a href="/terms-and-conditions" style={{ color: 'var(--highlight-color)' }}>Terms &amp; Conditions</a> and <a href="/privacy-policy" style={{color: 'var(--highlight-color)' }}>Privacy Policy</a>.
                            </label>
                        </div>

                    </div>

                    <button type='submit' style={{ width: '100%' }}>Sign Up</button>
                    {passwordErr !== "" && <div className={style.Error}>{passwordErr}</div>}
                    {usernameErr !== "" && <div className={style.Error}>{usernameErr}</div>}
                </form>
            </Card>
        </div>
    );
}
