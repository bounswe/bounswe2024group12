import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BACKEND_URL = "https://167.99.133.190/api/v1"
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;


const SignUp = () => {
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [name, setName] = useState("");
  const [nameFocus, setNameFocus] = useState(false);

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
    <div style={{
      backgroundColor: "#d4edda",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      {success ? (
        <section style={{ textAlign: "center", color: "green" }}>
          <h1>Success!</h1>
          <p>Your account has been created.</p>
          <p>
            <a href="/login" style={{ color: "green" }}>Log in</a>
          </p>
        </section>) : (
        <section style={{
          backgroundColor: "#e8f5e9",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
        }}>
          <p ref={errRef} className={errMsg ? "error" : "hidden"} style={{ color: "red" }}> {errMsg} </p>
          <h1 style={{ color: "green", textAlign: "center" }}>Sign Up</h1>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label htmlFor="email">
              Email
              <span>
                {validEmail ? (<FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />) : null}
              </span>
              <span>
                {emailFocus && !validEmail ? (<FontAwesomeIcon icon={faTimes} style={{ color: "red" }} />) : null}
              </span>
            </label>
            <input
              type="text"
              id="email"
              ref={emailRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="email-error"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              style={{ borderColor: validEmail ? "green" : "red", padding: "8px", borderRadius: "4px" }}
            />
            <p id="email-error" style={{ color: "red" }}>
              {emailFocus && !validEmail ? "Please enter a valid email address." : ""}
            </p>

            <label htmlFor="name">
              Name
              <span>
                {name ? (<FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />) : null}
              </span>
            </label>
            <input
              type="text"
              id="name"
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
              style={{ padding: "8px", borderRadius: "4px", borderColor: name ? "green" : "red" }}
            />
            <p></p>
            <label htmlFor="password">
              Password
              <span>
                {validPassword ? (<FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />) : null}
              </span>
              <span>
                {passwordFocus && !validPassword ? (<FontAwesomeIcon icon={faTimes} style={{ color: "red" }} />) : null}
              </span>
            </label>
            <input
              type="password"
              id="password"
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="password-error"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              style={{ borderColor: validPassword ? "green" : "red", padding: "8px", borderRadius: "4px" }}
            />
            <p id="password-error" style={{ color: "red" }}>
              {passwordFocus && !validPassword ? "Password must be at least 8 characters long and contain at least one letter and one number." : ""}
            </p>

            <label htmlFor="confirm-password">
              Confirm Password
              <span>
                {(validConfirmPassword && password) ? (<FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />) : null}
              </span>
              <span>
                {confirmPasswordFocus && !validConfirmPassword ? (<FontAwesomeIcon icon={faTimes} style={{ color: "red" }} />) : null}
              </span>
            </label>

            <input
              type="password"
              id="confirm-password"
              autoComplete="off"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              aria-invalid={validConfirmPassword ? "false" : "true"}
              aria-describedby="confirm-password-error"
              onFocus={() => setConfirmPasswordFocus(true)}
              onBlur={() => setConfirmPasswordFocus(false)}
              style={{ borderColor: validConfirmPassword && confirmPassword ? "green" : "red", padding: "8px", borderRadius: "4px" }}
            />
            <p id="confirm-password-error" style={{ color: "red" }}>
              {confirmPasswordFocus && !validConfirmPassword ? "Passwords do not match." : ""}
            </p>

            <button
              type="submit"
              disabled={!(validEmail && validPassword && validConfirmPassword)}
              style={{ backgroundColor: "green", color: "white", padding: "10px", borderRadius: "4px", border: "none", cursor: "pointer" }}
            >
              Sign Up
            </button>
          </form>
          <p>
            Already have an account? <a href="/login" style={{ color: "green" }}>Log in</a>
          </p>
          <p>
            Continue as a guest? <a href="/home" style={{ color: "green" }}>Continue</a>
          </p>
        </section>)}
    </div>
  )

}

export default SignUp;
