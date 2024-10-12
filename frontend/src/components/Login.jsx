import React from 'react';
import { Form, Field } from 'react-final-form';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
} from '@mui/material';
import { StyledLogin } from './StyledLogin';

// Define the Login component first
const Login = () => {
  return (
    <Form
      onSubmit={console.log}
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
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign In
          </Button>

          {/* Sign Up Link */}
          <Box mt={2}>
            <Typography align="center">
              Don't have an account? Sign up
            </Typography>
          </Box>
        </form>
      )}
    />
  );
};

// Export the component after definition
export default Login;
