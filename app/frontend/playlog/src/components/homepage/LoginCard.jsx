import { FormEvent, useState } from 'react';
import Card from '../common/Card';
import style from './LoginCard.module.css';
import { useNavigate } from 'react-router-dom';
import { sha256 } from 'js-sha256';


export default function LoginCard() {
  const navigate = useNavigate();
  const [loginFailed, setLoginFailed] = useState(false);

  function handleCreateAccount(event) {
    // link to sign up page
    console.log('Create Account');
    navigate('/signup');
  }


  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    const realMail = sha256('user@cmpe.com')
    const realPassword = sha256('1234')

    let hashedEmail = sha256(email);
    let hashedPassword = sha256(password);

    if (hashedEmail === realMail && hashedPassword === realPassword) {
      console.log('Login successful');
      setLoginFailed(false);
    } else {
      // Handle errors
      console.error('Login failed');
      setLoginFailed(true);
    }
  }

  return (
    <div className={style.Container}>
      <Card>
        <form onSubmit={handleSubmit} className={style.Form}>
          <h1>Login</h1>
          <div style={{ width: '100%' }}>
            <label>E-Mail</label>
            <input type='email' name='email' placeholder='E-Mail' required />
            <label>Password</label>
            <input
              type='password'
              name='password'
              placeholder='Şifre'
              required
            />
          </div>

          <button type='submit' style={{width:'100%'}}>Login</button>
          {loginFailed && <div className={style.Error}>Incorrect e-mail or password!</div>}

        </form>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '5px' }}>
          <a href="#" style={{ color: 'var(--highlight-color)' }}>Forgot your password?</a>
        </div>


      </Card>
      <div className={style.Container} style={{marginTop:'20px' ,alignItems:'center'}}/>
      <Card style={{alignItems: 'center'}} >
        <div className={style.Form}>
        <h2 style={{alignItems: 'center'}}>Create Account</h2>
        <button style={{width:'100%'}} onClick={handleCreateAccount}>
          Sign Up
        </button>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '5px' }}>
          <a href="#" style={{ color: 'var(--highlight-color)' }}>Continue as Guest</a>
        </div>
        </div>
      </Card>
      
    </div>
  );
}
