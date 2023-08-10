import React, { useState } from "react";
import { useDispatch } from "react-redux";

import {
  loginState,
  updatePassword,
  updatePasswordFailure,
} from "../../../actions/index";
import {
  EMAIL_NOT_EXISTED,
  LOGIN_FORM,
  WRONG_PASSWORD,
} from "../../content/form";
import "./index.css";

const ResetPassword = (props) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState(null);

  const [emailNotExisted, setEmailNotExisted] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  // const [currentPasswordError, setCurrentPasswordError] = useState(null);

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

  const validateNewPassword = (newPassword) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
    const isValid = passwordRegex.test(newPassword);

    if (!newPassword) {
      setNewPasswordError(LOGIN_FORM.PASSWORD.REQUIRED_MESSAGE);
    } else if (!isValid) {
      setNewPasswordError(LOGIN_FORM.PASSWORD.ERROR_MESSAGE);
    } else {
      setNewPasswordError(null);
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isNewPasswordValid = validateNewPassword(newPassword);
    // const isCurrentPasswordValid = validatePassword(password);

    if (isEmailValid && isNewPasswordValid) {
      console.log(LOGIN_FORM.EMAIL.LABEL, email);
      try {
        const response = await fetch("/auth/update-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, currentPassword, newPassword }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error === EMAIL_NOT_EXISTED) {
            setEmailNotExisted(true);
          } else if (errorData.error === WRONG_PASSWORD) {
            setWrongPassword(true);
          } else {
            console.log("Get update-password API error:", errorData);
          }
          dispatch(updatePasswordFailure(errorData));
        } else {
          dispatch(updatePassword(email));
          dispatch(loginState());
        }
      } catch (error) {
        dispatch(updatePasswordFailure(error));
      }
    }
  };
  return (
    <>
      <div className="reset">
        <h2 className="title">Update your password</h2>
        <div className="tutorial">
          Enter your email link, we will send you the recovery link
        </div>
        <form className="reset-form" onSubmit={handleSubmit}>
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
          {emailNotExisted && (
            <div className="email-not-existed">{EMAIL_NOT_EXISTED}</div>
          )}
          <label htmlFor="current-password">Current Password</label>
          <input
            // className={currentPasswordError ? "error-input" : ""}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            type="password"
            placeholder={LOGIN_FORM.PASSWORD.PLACE_HOLDER}
            id="password"
            name="password"
          />
          {wrongPassword && (
            <div className="wrong-password">{WRONG_PASSWORD}</div>
          )}
          {/* {currentPasswordError && (
            <div className="error-password">{currentPasswordError}</div>
          )} */}

          <label htmlFor="new-password">New Password</label>
          <input
            className={newPasswordError ? "error-input" : ""}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            placeholder={LOGIN_FORM.PASSWORD.PLACE_HOLDER}
            id="password"
            name="password"
          />
          {newPasswordError && (
            <div className="error-password">{newPasswordError}</div>
          )}

          <button id="submit" type="submit">
            Update password
          </button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
