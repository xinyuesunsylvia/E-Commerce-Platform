// import React, { Fragment } from "react";
// import ReactDOM from "react-dom";
// import PropTypes from "prop-types";

// import "./index.css";

// const CartBackdrop = (props) => {
//   return <div className="backdrop" onClick={props.onClose} />;
// };

// const CartModalOverlay = (props) => {
//   return (
//     <div className="cart-modal">
//       <header>
//         <button className="cart-close-button" onClick={props.onClose}>
//           X
//         </button>
//       </header>
//       <div className="cart-content">{props.children}</div>
//     </div>
//   );
// };

// const portalElement = document.getElementById("overlays");

// const CartModal = (props) => {
//   return (
//     <Fragment>
//       {ReactDOM.createPortal(
//         <CartBackdrop onClose={props.onClose} />,
//         portalElement
//       )}
//       {ReactDOM.createPortal(
//         // <ModalOverlay headerText={props.headerText} onClose={props.onClose}>
//         <CartModalOverlay onClose={props.onClose}>
//           {props.children}
//         </CartModalOverlay>,
//         portalElement
//       )}
//     </Fragment>
//   );
// };

// CartModal.propTypes = {
//   // headerText: PropTypes.string.isRequired,
//   onClose: PropTypes.func.isRequired,
//   children: PropTypes.node.isRequired,
// };

// export default CartModal;
