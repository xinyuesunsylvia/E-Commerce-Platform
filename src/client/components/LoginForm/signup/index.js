import React, { useState } from "react";
import "./index.css";

import {
  EMAIL_EXISTED,
  LOGIN_FORM,
  NORMAL_USER,
  ADMIN_USER,
} from "../../content/form";
import { useDispatch, useSelector } from "react-redux";
import {
  loginState,
  signUp,
  signUpFailure,
  signupUserType,
  updateAll,
} from "../../../actions";

const Signup = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [userTypeError, setUserTypeError] = useState(false);

  const [emailExisted, setEmailExisted] = useState(false);
  const signup_user_type = useSelector((state) => state.signup_user_type);

  const update_state = useSelector((state) => state.update_state);
  const dispatch = useDispatch();

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
    if (userTypeError !== NORMAL_USER && userTypeError !== ADMIN_USER) {
      setUserTypeError(true);
      return;
    }

    if (isEmailValid && isPasswordValid) {
      console.log(LOGIN_FORM.EMAIL.LABEL, email);
      // console.log(LOGIN_FORM.PASSWORD.LABEL, password);
      try {
        const response = await fetch("/auth/sign-up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            type: signup_user_type,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error === EMAIL_EXISTED) {
            setEmailExisted(true);
          } else {
            console.log("Get Signup API error:", errorData);
          }
          dispatch(signUpFailure(errorData));
        } else {
          dispatch(signUp(email));
          dispatch(loginState());
          dispatch(signupUserType(NORMAL_USER));
          dispatch(updateAll(!update_state));
        }
      } catch (error) {
        dispatch(signUpFailure(error));
      }
    }
  };
  const handleUserType = (e) => {
    setUserTypeError(e.target.value);
    dispatch(signupUserType(e.target.value));
    console.log("1" + signup_user_type);
  };
  console.log("2" + signup_user_type);
  return (
    <div className="signup">
      <h2 className="title">Sign up an account</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          className={emailError ? "error-input" : ""}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder={LOGIN_FORM.EMAIL.PLACE_HOLDER}
          id="email"
          name="email"
        />
        {emailError && <div className="error-email">{emailError}</div>}
        {emailExisted && <div className="email-existed">{EMAIL_EXISTED}</div>}
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
        {passwordError && <div className="error-password">{passwordError}</div>}
        <div>
          <select
            className={userTypeError === true ? "error-input" : ""}
            name="user-type"
            onChange={handleUserType}
          >
            <option value="">Please Select User Type</option>
            <option value={NORMAL_USER}>User</option>
            <option value={ADMIN_USER}>Admin</option>
          </select>
        </div>
        {/* {userTypeError && (
          <div className="error-type">"Please Select User Type"</div>
        )} */}

        <button className="sign-up-button" id="submit" type="submit">
          Create account
        </button>
      </form>
      <button className="link-btn" onClick={() => dispatch(loginState())}>
        Already have an account? Sign in
      </button>
    </div>
  );
};

export default Signup;
