import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  LOGIN,
  RESET_PASSWORD,
  SIGNUP,
  OPEN_MODAL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  PRODUCT_LIST,
  PRODUCT_CREATE,
  PRODUCT_EDIT,
  PRODUCT_DETAIL,
} from "../content/form";

import { cartState, closeModal } from "../../actions/index";
import Login from "../LoginForm/login";
import Modal from "../common/modal";
import Signup from "../LoginForm/signup";
import ResetPassword from "../LoginForm/resetPassword";
import Products from "../productForm/products";
import ProductCreateForm from "../productForm/productCreate";
import ProductEditForm from "../productForm/productEdit";
import EditForm from "../productForm/productEdit/editForm";
import ProductDetailForm from "../productForm/productDetail";
import CartForm from "../cartForm";

function Home() {
  const login_window_state = useSelector((state) => state.login_window_state);
  const login_state = useSelector((state) => state.login_state);
  const modal_state = useSelector((state) => state.modal_state);
  const product_state = useSelector((state) => state.product_window_state);
  const detail_page = useSelector((state) => state.detail_page);
  const cart_window = useSelector((state) => state.cart_window_state);
  const dispatch = useDispatch();
  const update_state = useSelector((state) => state.update_state);

  return (
    <>
      {modal_state === OPEN_MODAL &&
        !cart_window &&
        login_state === LOGOUT_SUCCESS && (
          <Modal onClose={() => dispatch(closeModal())}>
            {login_window_state === LOGIN && <Login />}
            {login_window_state === SIGNUP && <Signup />}
            {login_window_state === RESET_PASSWORD && <ResetPassword />}
          </Modal>
        )}
      {cart_window && <CartForm></CartForm>}
      {product_state === PRODUCT_LIST && !detail_page && <Products></Products>}

      {detail_page && product_state !== PRODUCT_EDIT && (
        <ProductDetailForm></ProductDetailForm>
      )}
      {product_state === PRODUCT_CREATE && (
        <ProductCreateForm></ProductCreateForm>
      )}
      {product_state === PRODUCT_EDIT && <ProductEditForm></ProductEditForm>}
    </>
  );
}

export default Home;
