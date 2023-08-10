import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Fragment } from "react";

import HeaderCartButton from "./headerCart";
import "./header.css";
import {
  openModal,
  logoutSuccess,
  closeModal,
  signOut,
  signOutFailure,
  loginState,
  productOut,
  addProduct,
  emptyProduct,
  productList,
  userType,
  updateAll,
  signIn,
  loginSuccess,
  signOutAction,
} from "../../actions";
import {
  LOGOUT_SUCCESS,
  SIGN_OUT_SUCCESS,
  SIGN_OUT_FAILURE,
  NORMAL_USER,
  ADMIN_USER,
} from "../content/form";

const Header = (props) => {
  const [products, setProducts] = useState([]);
  const login_state = useSelector((state) => state.login_state);
  const email = useSelector((state) => state.user_email);
  const user_email = useSelector((state) => state.user_email);
  const update_state = useSelector((state) => state.update_state);

  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLogin = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("token: " + token);
        const response = await fetch(`/auth/get/${token}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.log("Get user API error:", errorData);
        } else {
          const dataMessage = await response.json();
          console.log("dataMessage: " + dataMessage);
          if (dataMessage.type === NORMAL_USER) {
            dispatch(userType(NORMAL_USER));
          } else if (dataMessage.type === ADMIN_USER) {
            dispatch(userType(ADMIN_USER));
          }
          if (!dataMessage.email) {
            dispatch(signIn("temporary"));
          } else {
            dispatch(signIn(dataMessage.email));
          }
          console.log("email:" + user_email);
          dispatch(loginSuccess());
          dispatch(closeModal());
          dispatch(productList());
          dispatch(updateAll(!update_state));
        }
      } catch (error) {
        // console.log("Error fetching products:", error);
      }
    };
    fetchLogin();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const response = await fetch("/auth/sign-out", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email }),
      // });

      // console.log("Signout-Email", email);
      dispatch(signOutAction(email));
      dispatch(signOut(email));
      dispatch(logoutSuccess());
      dispatch(loginState());
      dispatch(closeModal());
      dispatch(updateAll(!update_state));
      localStorage.removeItem("token");

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   // throw new Error(errorData.message);
      //   console.log("Get Signout API error:", errorData, email);
      //   dispatch(signOutFailure(errorData));
      // } else {
      //   dispatch(signOut(email));
      //   dispatch(logoutSuccess());
      //   dispatch(loginState());
      //   dispatch(closeModal());
      //   dispatch(updateAll(!update_state));
      //   localStorage.removeItem("token");
      // }
    } catch (error) {
      dispatch(signOutFailure(error));
    }
  };

  return (
    <Fragment>
      <header className="header">
        <h3>Management</h3>
        <input className="header-input-option" placeholder="Search" />

        <button
          className="header-login"
          onClick={
            login_state === LOGOUT_SUCCESS
              ? () => dispatch(openModal())
              : (e) => {
                  handleSubmit(e);
                  dispatch(productList());
                  dispatch(emptyProduct());
                  dispatch(userType(NORMAL_USER));
                  dispatch(updateAll(!update_state));
                }
          }
        >
          {login_state === LOGOUT_SUCCESS ? "Sign In" : "Sign Out"}
        </button>
        <HeaderCartButton className="header-cart-button" />
      </header>
    </Fragment>
  );
};
export default Header;
