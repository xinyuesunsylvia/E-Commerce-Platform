import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ADMIN_USER,
  EMAIL_NOT_EXISTED,
  LOGIN_FORM,
  NORMAL_USER,
  USER_TYPE,
  WRONG_PASSWORD,
} from "../../content/form";
import "./index.css";
import {
  resetState,
  signupState,
  loginSuccess,
  closeModal,
  signIn,
  signInFailure,
  productList,
  userType,
  updateAll,
} from "../../../actions";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [emailNotExisted, setEmailNotExisted] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const user_type = useSelector((state) => state.user_type);

  const update_state = useSelector((state) => state.update_state);

  const dispatch = useDispatch();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!email) {
      setEmailError(LOGIN_FORM.EMAIL.REQUIRED_MESSAGE);
    } else if (!isValid) {
      setEmailError(LOGIN_FORM.EMAIL.ERROR_MESSAGE);
    } else {
      setEmailError(null);
    }

    return isValid;
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
    const isValid = passwordRegex.test(password);

    if (!password) {
      setPasswordError(LOGIN_FORM.PASSWORD.REQUIRED_MESSAGE);
    } else if (!isValid) {
      setPasswordError(LOGIN_FORM.PASSWORD.ERROR_MESSAGE);
    } else {
      setPasswordError(null);
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      try {
        const response = await fetch("/auth/sign-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            cart: cart,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error === EMAIL_NOT_EXISTED) {
            setEmailNotExisted(true);
          } else if (errorData.error === WRONG_PASSWORD) {
            setWrongPassword(true);
          } else {
            console.log("Get Signin API error:", errorData);
          }
          dispatch(signInFailure(errorData));
        } else {
          console.log(`${LOGIN_FORM.EMAIL.LABEL}: ${email}`);

          const dataMessage = await response.json();

          // token -> local storage
          const token = dataMessage.token;
          localStorage.setItem("token", token);

          localStorage.removeItem("cart");
          if (dataMessage.type === NORMAL_USER) {
            dispatch(userType(NORMAL_USER));
          } else if (dataMessage.type === ADMIN_USER) {
            dispatch(userType(ADMIN_USER));
          }

          dispatch(signIn(email));
          dispatch(loginSuccess());
          dispatch(closeModal());
          dispatch(productList());
          dispatch(updateAll(!update_state));
          // console.log(`user type: ${user_type}`);
        }
      } catch (error) {
        dispatch(signInFailure(error));
      }
    }
  };

  return (
    <>
      <div className="login">
        <div>
          <h2 className="title">Sign in to your account</h2>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="email-title" htmlFor="email">
            Email
          </label>
          <input
            className={emailError ? "error-input" : ""}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // type="email"
            placeholder={LOGIN_FORM.EMAIL.PLACE_HOLDER}
            id="email"
            name="email"
          />
          {emailError && <div className="error-email">{emailError}</div>}
          {emailNotExisted && (
            <div className="email-not-existed">{EMAIL_NOT_EXISTED}</div>
          )}
          <label htmlFor="password">Password</label>
          <input
            className={passwordError ? "error-input" : ""}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder={LOGIN_FORM.PASSWORD.PLACE_HOLDER}
            id="password"
            name="password"
          />
          {passwordError && (
            <div className="error-password">{passwordError}</div>
          )}

          {wrongPassword && (
            <div className="wrong-password">{WRONG_PASSWORD}</div>
          )}
          <button id="submit" type="submit">
            Sign In
          </button>
        </form>
        <div className="login-set-state">
          <button
            className="login-link-signup"
            onClick={() => dispatch(signupState())}
          >
            Don't have an account? Sign up
          </button>
          <button
            className="login-link-password"
            onClick={() => dispatch(resetState())}
          >
            Forgot password
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
