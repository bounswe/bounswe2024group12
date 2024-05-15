import { useState, useEffect } from 'react';
import Card from '../common/Card';
import style from './LoginCard.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/UserContext';
import { endpoint } from '../common/EndpointContext';


export default function LoginCard() {
  console.log(endpoint);
  const navigate = useNavigate();
  const [loginFailed, setLoginFailed] = useState(false);
  const { loggedIn, handleLogin,  } = useAuth();

  useEffect(() => {
    if (loggedIn) 
      navigate('/home');
  });

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

    console.log('Email: ', email);
    console.log('Password', password);

    try {
      const response = await fetch(endpoint+'login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setLoginFailed(true);
        return;
      }

      const data = await response.json();

      setLoginFailed(false);
      handleLogin(data.username);
      navigate('/main');
    }
    catch (error) {
      console.error('Error:', error);
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
          <a href="/forgot-password" style={{ color: 'var(--highlight-color)' }}>Forgot your password?</a>
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
          <a href="/main" style={{ color: 'var(--highlight-color)' }}>Continue as Guest</a>
        </div>
        </div>
      </Card>
      
    </div>
  );
}
