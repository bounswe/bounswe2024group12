import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  return (
    <section>
      <p ref={errRef} className={errMsg ? "error" : "hidden"}> {errMsg} </p>
      <h1>Sign Up</h1>
      <form>
        <label htmlFor="email">
          Email
          <span>
            {validEmail ? ( <FontAwesomeIcon icon={faCheck} /> ) : null}
          </span>
          <span>
            {emailFocus && !validEmail ? ( <FontAwesomeIcon icon={faTimes} /> ) : null}
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
          />
          <p id="email-error">
            {emailFocus && !validEmail ? "Please enter a valid email address." : ""}
          </p>

        <label htmlFor="name">
          Name
          <span>
            {nameFocus ? ( <FontAwesomeIcon icon={faCheck} /> ) : null}
          </span>
        </label>
          <input
            type="text"
            id="name"
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setNameFocus(true)}
            onBlur={() => setNameFocus(false)}
          />

        <label htmlFor="password">
          Password
          <span>
            {validPassword ? ( <FontAwesomeIcon icon={faCheck} /> ) : null}
          </span>
          <span>
            {passwordFocus && !validPassword ? ( <FontAwesomeIcon icon={faTimes} /> ) : null}
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
          />
          <p id="password-error">
            {passwordFocus && !validPassword ? "Password must be at least 8 characters long and contain at least one letter and one number." : ""}
          </p>

        <label htmlFor="confirm-password">
          Confirm Password
          <span>
            {(validConfirmPassword && password)? ( <FontAwesomeIcon icon={faCheck} /> ) : null}
          </span>
          <span>
            {confirmPasswordFocus && !validConfirmPassword ? ( <FontAwesomeIcon icon={faTimes} /> ) : null}
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
          />
          <p id="confirm-password-error">
            {confirmPasswordFocus && !validConfirmPassword ? "Passwords do not match." : ""}
          </p>

        <button
          type="submit"
          disabled={!(validEmail && validPassword && validConfirmPassword)}
          onClick={(e) => {
            e.preventDefault();
            if (validEmail && validPassword && validConfirmPassword) {
              setSuccess(true);
            } else {
              setErrMsg("Please fix the errors in the form.");
            }
          }}
        >
          Sign Up
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </section>
  )
}

export default SignUp;
