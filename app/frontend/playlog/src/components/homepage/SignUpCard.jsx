import { FormEvent } from 'react';
import Card from '../common/Card';
import style from './SignUpCard.module.css';


export default function SignUpCard() {
    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');
        const username = formData.get('username');

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
                </form>
            </Card>
        </div>
    );
}
