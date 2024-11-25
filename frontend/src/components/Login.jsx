import React from 'react';
import { Form, Field } from 'react-final-form';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setErrorMsg("");  // Clear error message on new submit

    try {
      const response = await fetch(`${BACKEND_URL}/accounts/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      setSuccess(true);
      const token = data.token;
      const username = data.username;
      localStorage.setItem("token", token); 
      console.log(data);
      localStorage.setItem("username", username);
      navigate('/home');

    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  // Handle guest navigation
  const handleGuestContinue = () => {
    navigate('/home'); // Redirect to home page as guest
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: 'background.default' }} // Softer green background
    >
      <Box
        sx={{
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          boxShadow: 2,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        {success && <Alert severity="success">Login successful!</Alert>}

        <Form
          onSubmit={handleSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <Field name="email">
                {({ input }) => (
                  <TextField
                    {...input}
                    label="Email"
                    type="email"
                    variant="outlined"
                    required
                    fullWidth
                    margin="normal"
                  />
                )}
              </Field>

              {/* Password Field */}
              <Field name="password">
                {({ input }) => (
                  <TextField
                    {...input}
                    label="Password"
                    type="password"
                    variant="outlined"
                    required
                    fullWidth
                    margin="normal"
                  />
                )}
              </Field>

              {/* Remember Me Checkbox */}
              <FormControlLabel
                control={<Checkbox color="#background.paper" />}
                label="Remember me"
              />

              {/* Submit Button */}
              <Button type="submit" variant="contained" sx={{ backgroundColor: '#background.paper', color: 'white' }} fullWidth>
                Sign In
              </Button>

              {/* Sign Up Link */}
              <Box mt={2}>
                <Typography align="center">
                  Don't have an account? <a href="/signup" style={{ color: '#background.paper' }}>Sign up</a>
                </Typography>
              </Box>
            </form>
          )}
        />

        {/* Continue as Guest Button */}
        <Box mt={2}>
          <Typography align="center">
            <Button 
              onClick={handleGuestContinue}
              variant="outlined"
              fullWidth
              sx={{ color: 'green', borderColor: 'green' }}
            >
              Continue as Guest
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
