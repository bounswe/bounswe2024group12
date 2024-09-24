import React from "react";
import { useState } from "react";
import style from "./ForgotPasswordCard.module.css";
import Card from "../common/Card";
import { endpoint } from "../common/EndpointContext";



export default function ForgotPasswordCard() {
    const [error, setError] = useState(""); // State to store error messages
    const [successMessage, setSuccessMessage] = useState(""); // State to store success messages
  
    async function handleSubmit(event) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email');
      console.log('Email: ', email);
     
  
      try {
        const response = await fetch(endpoint + 'forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
  
        const responseData = await response.json(); // Expecting JSON response from server
  
        if (!response.ok) {
          throw new Error(`${response.statusText} - ${responseData.message}`);
        }
  
        if (responseData.userNotFound) {
          setError("No user found with that email address.");
          setSuccessMessage(""); // Clear success message if there's an error
        } else {
          setError(""); // Clear error message on success
          // Set success message indicating the reset email has been sent
          setSuccessMessage(`Reset email sent to: ${email}`);
        }
      }
      catch (error) {
        console.error('Error:', error);
        setError(error.toString());
        setSuccessMessage(""); // Clear success message if there's an error
      }
    
  
    }

    
    return(
        <div className={style.Container}>
      <Card>
        <form onSubmit={handleSubmit} className={style.Form}>
          <h2>Reset Password</h2>
          <div style={{ width: '100%' }}>
            <label>E-mail</label>
            <input type='email' name='email' placeholder='E-Mail' required />
          </div>

          
          <button type='submit' style={{ width: '100%' }}>
            Continue
          </button>
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
          {successMessage && <div style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}

        </form>
      </Card>
    </div>
    );}

