import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import "./index.css";

const Backdrop = (props) => {
  return <div className="backdrop" onClick={props.onClose} />;
};

const ModalOverlay = (props) => {
  return (
    <div className="modal">
      <header>
        <button className="close-button" onClick={props.onClose}>
          X
        </button>
      </header>
      <div className="content">{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const Modal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onClose} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        // <ModalOverlay headerText={props.headerText} onClose={props.onClose}>
        <ModalOverlay onClose={props.onClose}>{props.children}</ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

Modal.propTypes = {
  // headerText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
