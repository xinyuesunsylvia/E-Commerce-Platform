import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { LOGIN_FORM } from "../../content/form";
import "./index.css";
import {
  resetState,
  signupState,
  loginSuccess,
  logoutSuccess,
  closeModal,
} from "../../../actions";
import { USER_TYPE } from "../../../constants";

const Login = (props) => {
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/auth/sign-out", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        // throw new Error(errorData.message);
        console.log("Get Signout API error:", errorData);
      } else {
        dispatch({
          type: SIGN_OUT_SUCCESS,
          payload: { email: null, isLoggedIn: false },
        });
        dispatch(updateAll(!update_state));
        dispatch(logoutSuccess());
        dispatch(closeModal());
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: SIGN_OUT_FAILURE, payload: error.message });
    }
  };

  return (
    <>
      <div className="login">
        <h2 className="title">Sign in to your account</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
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
          <button id="submit" type="submit">
            Sign In
          </button>
        </form>
        <div className="set-state">
          <button
            className="link-signup"
            onClick={() => dispatch(signupState())}
          >
            Don't have an account? Sign up
          </button>
          <button
            className="link-password"
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
