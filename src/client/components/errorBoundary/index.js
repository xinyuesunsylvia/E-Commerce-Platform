import React, { useEffect, useState } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { errorBoundary } from "../../actions";

const ErrorBoundary = (props) => {
  const error_boundary = useSelector((state) => state.error_boundary);
  const dispatch = useDispatch();

  useEffect(() => {
    // This function will be called when an error is caught
    const handleError = (error) => {
      console.error(error);
      dispatch(errorBoundary(true));
    };

    // Register the error handler
    window.addEventListener("error", handleError);

    // Remove the error handler on unmount
    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  if (error_boundary) {
    return (
      <>
        <div className="oops-page">
          <h1 className="oops">Oops, something went wrong!</h1>
          <button
            className="oops-button"
            onClick={() => {
              dispatch(errorBoundary(false));
            }}
          >
            Go Home
          </button>
        </div>
      </>
    );
  } else {
    return props.children;
  }
};

export default ErrorBoundary;
