import { useRef, useState, useEffect } from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

const BACKEND_URL = process.env.REACT_APP_API_URL;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const SignUp = () => {
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [name, setName] = useState("");

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const emailValid = EMAIL_REGEX.test(email);
    setValidEmail(emailValid);
  }, [email]);

  useEffect(() => {
    const passwordValid = PWD_REGEX.test(password);
    setValidPassword(passwordValid);
    const confirmPasswordValid = password === confirmPassword;
    setValidConfirmPassword(confirmPasswordValid);
  }, [password, confirmPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = EMAIL_REGEX.test(email);
    const v2 = PWD_REGEX.test(password);
    const v3 = password === confirmPassword;
    if (!(v1 && v2 && v3)) {
      setErrMsg("Please fix the errors in the form.");
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/accounts/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail: email,
          username: name,
          password: password
        }),
      });

      if (!response.ok) {
        throw new Error("Please try again.");
      }

      const data = await response.json();
      setSuccess(true);
      console.log("User created:", data);

    } catch (error) {
      setErrMsg("Sign-up failed: " + error.message);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {success ? (
        <Box textAlign="center">
          <Typography variant="h4" color="success.main">Success!</Typography>
          <Typography>Your account has been created.</Typography>
          <Button href="/login" variant="contained" color="success">Log in</Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2, boxShadow: 3 }}>
          {errMsg && <Alert severity="error" ref={errRef}>{errMsg}</Alert>}
          <Typography variant="h4" color="primary" textAlign="center" mb={2}>Sign Up</Typography>

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            error={emailFocus && !validEmail}
            helperText={emailFocus && !validEmail ? "Please enter a valid email address." : ""}
            InputProps={{
              endAdornment: validEmail && <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />,
            }}
          />

          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              endAdornment: name && <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />,
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
            error={passwordFocus && !validPassword}
            helperText={passwordFocus && !validPassword ? "Password must be at least 8 characters, and contain letters and numbers." : ""}
            InputProps={{
              endAdornment: validPassword && <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />,
            }}
          />

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setConfirmPasswordFocus(true)}
            onBlur={() => setConfirmPasswordFocus(false)}
            error={confirmPasswordFocus && !validConfirmPassword}
            helperText={confirmPasswordFocus && !validConfirmPassword ? "Passwords do not match." : ""}
            InputProps={{
              endAdornment: validConfirmPassword && confirmPassword && <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />,
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!(validEmail && validPassword && validConfirmPassword)}
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>

          <Typography mt={2} textAlign="center">
            Already have an account? <Button href="/login" variant="text" color="primary">Log in</Button>
          </Typography>
          <Typography mt={1} textAlign="center">
            Continue as a guest? <Button href="/home" variant="text" color="primary">Continue</Button>
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default SignUp;
