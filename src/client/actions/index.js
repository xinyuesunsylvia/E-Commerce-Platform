import {
  LOGIN,
  SIGNUP,
  RESET_PASSWORD,
  CLOSE_MODAL,
  OPEN_MODAL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_OUT_SUCCESS,
  SIGN_OUT_FAILURE,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILURE,
  PRODUCT_ID,
  PRODUCT_LIST,
  PRODUCT_CREATE,
  PRODUCT_EDIT,
  PRODUCT_DETAIL,
  IMAGE_PREVIEW,
  IMAGE_NOT_PREVIEW,
  PRODUCT_OUT,
  USER_TYPE,
  NORMAL_USER,
  ADMIN_USER,
  ADD_PRODUCT,
  EMPTY_PRODUCT,
  SHOW_DETAIL_PAGE,
  CLOSE_DETAIL_PAGE,
  SIGNUP_USER_TYPE,
  SORT_TYPE,
  CART_STATE,
  UPDATE_ALL,
  CART_EMPTY_STATE,
  ERROR_BOUNDARY,
  LOADING_STATE,
} from "../components/content/form";

export const loadingState = (input) => {
  return {
    type: LOADING_STATE,
    payload: {
      loading_state: input,
    },
  };
};

export const errorBoundary = (input) => {
  return {
    type: ERROR_BOUNDARY,
    payload: {
      error_boundary: input,
    },
  };
};

export const emptyCart = (input) => {
  return {
    type: CART_EMPTY_STATE,
    payload: {
      cart_empty_state: input,
    },
  };
};

export const updateAll = (input) => {
  return {
    type: UPDATE_ALL,
    payload: {
      update_state: input,
    },
  };
};

export const cartState = (state) => {
  return {
    type: CART_STATE,
    payload: {
      cart_window_state: state,
    },
  };
};

export const sortType = (sort_type) => {
  return {
    type: SORT_TYPE,
    payload: {
      sort_type: sort_type,
    },
  };
};

export const closeDetailPage = () => {
  return {
    type: CLOSE_DETAIL_PAGE,
    payload: {
      detail_page: false,
    },
  };
};

export const showDetailPage = () => {
  return {
    type: SHOW_DETAIL_PAGE,
    payload: {
      detail_page: true,
    },
  };
};

export const emptyProduct = (price) => {
  return {
    type: EMPTY_PRODUCT,
    payload: {
      total_price: price,
    },
  };
};

export const addProduct = (price) => {
  return {
    type: ADD_PRODUCT,
    payload: {
      total_price: price,
    },
  };
};

export const signupUserType = (user) => {
  return {
    type: SIGNUP_USER_TYPE,
    payload: {
      signup_user_type: user,
    },
  };
};

export const userType = (user) => {
  return {
    type: USER_TYPE,
    payload: {
      user_type: user,
    },
  };
};

export const imagePreview = () => {
  return {
    type: IMAGE_PREVIEW,
    payload: {
      image_preview: true,
    },
  };
};

export const imageNotPreview = () => {
  return {
    type: IMAGE_NOT_PREVIEW,
    payload: {
      image_preview: false,
    },
  };
};

export const productOut = () => {
  return {
    type: PRODUCT_OUT,
    payload: {
      product_window_state: PRODUCT_OUT,
    },
  };
};

export const productList = () => {
  return {
    type: PRODUCT_LIST,
    payload: {
      product_window_state: PRODUCT_LIST,
    },
  };
};

export const productCreate = () => {
  return {
    type: PRODUCT_CREATE,
    payload: {
      product_window_state: PRODUCT_CREATE,
    },
  };
};

export const productEdit = () => {
  return {
    type: PRODUCT_EDIT,
    payload: {
      product_window_state: PRODUCT_EDIT,
    },
  };
};

export const productDetail = () => {
  return {
    type: PRODUCT_DETAIL,
    payload: {
      product_window_state: PRODUCT_DETAIL,
    },
  };
};

export const productId = (id) => {
  return {
    type: PRODUCT_ID,
    payload: {
      product_id: id,
    },
  };
};

// 用户注册
export const signUp = (email) => {
  return {
    type: SIGN_UP_SUCCESS,
    payload: {
      // user_email: email,
      // user_id: id,
      isLoggedIn: false,
    },
  };
};

export const signUpFailure = (errorMessage) => {
  return {
    type: SIGN_UP_FAILURE,
    payload: {
      error_message: errorMessage,
    },
  };
};

export const signIn = (email) => {
  return {
    type: SIGN_IN_SUCCESS,
    payload: {
      user_email: email,
      // user_id: id,
      isLoggedIn: true,
    },
  };
};

export const signInFailure = (errorMessage) => {
  return {
    type: SIGN_IN_FAILURE,
    payload: {
      error_message: errorMessage,
    },
  };
};

// 用户登出

export const signOut = () => {
  return {
    type: SIGN_OUT_SUCCESS,
    payload: {
      user_email: null,
      user_id: null,
      isLoggedIn: false,
    },
  };
};
export const signOutAction = (email) => async (dispatch) => {
  try {
    const response = await fetch("/auth/sign-out", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    } else {
      dispatch(signOut(email));
      // dispatch(logoutSuccess());
      // dispatch(loginState());
      // dispatch(closeModal());
      // dispatch(updateAll(true)); // 将 update_state 设为 true，以更新组件
      // localStorage.removeItem("token");
    }
  } catch (error) {
    dispatch(signOutFailure(error));
  }
};

export const signOutFailure = (errorMessage) => {
  return {
    type: SIGN_OUT_FAILURE,
    payload: {
      error_message: errorMessage,
    },
  };
};

// 更新用户密码

export const updatePassword = (email) => {
  return {
    type: UPDATE_PASSWORD_SUCCESS,
    payload: {
      user_email: email,
      isLoggedIn: false,
    },
  };
};

export const updatePasswordFailure = (errorMessage) => {
  return {
    type: UPDATE_PASSWORD_FAILURE,
    payload: {
      error_message: errorMessage,
    },
  };
};

export const closeModal = (content) => {
  return {
    type: CLOSE_MODAL,
    // payload: {
    //   login_state: LOGIN,
    //   modal_state: CLOSE_MODAL,
    // },
  };
};

export const openModal = (content) => {
  return {
    type: OPEN_MODAL,
  };
};

export const loginState = (content) => {
  return {
    type: LOGIN,
    payload: {
      login_window_state: content,
    },
  };
};

export const signupState = (content) => {
  return {
    type: SIGNUP,
    payload: {
      login_window_state: content,
    },
  };
};

export const resetState = (content) => {
  return {
    type: RESET_PASSWORD,
    payload: {
      login_window_state: content,
    },
  };
};

export const loginSuccess = (content) => {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      login_state: content,
    },
  };
};

export const logoutSuccess = (content) => {
  return {
    type: LOGOUT_SUCCESS,
    payload: {
      login_state: content,
    },
  };
};
