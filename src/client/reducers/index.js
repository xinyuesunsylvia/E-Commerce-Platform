import {
  CLOSE_MODAL,
  OPEN_MODAL,
  LOGIN,
  SIGNUP,
  RESET_PASSWORD,
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
  TOTAL_PRICE,
  EMPTY_PRODUCT,
  SHOW_DETAIL_PAGE,
  CLOSE_DETAIL_PAGE,
  SIGNUP_USER_TYPE,
  SORT_TYPE,
  LAST_ADDED,
  CART_STATE,
  UPDATE_ALL,
  CART_EMPTY_STATE,
  ERROR_BOUNDARY,
  LOADING_STATE,
  PENDING,
  LOADING_FINISHED,
} from "../components/content/form/index";

export const reducer = (
  state = {
    modal_state: CLOSE_MODAL,
    login_window_state: LOGIN,
    login_state: LOGOUT_SUCCESS,
    user_email: null,
    // user_id: null,
    isLoggedIn: false,
    error_message: null,
    product_id: "",
    product_window_state: PRODUCT_LIST,
    image_preview: false,
    user_type: NORMAL_USER,
    signup_user_type: NORMAL_USER,
    total_price: 0.0,
    detail_page: false,
    sort_type: LAST_ADDED,
    cart_window_state: false,
    update_state: false,
    cart_empty_state: true,
    error_boundary: false,
    loading_state: LOADING_FINISHED,
  },
  action
) => {
  switch (action.type) {
    case LOADING_STATE:
      return {
        ...state,
        loading_state: action.payload.loading_state,
      };

    case ERROR_BOUNDARY:
      return {
        ...state,
        error_boundary: action.payload.error_boundary,
      };

    case CART_EMPTY_STATE:
      return {
        ...state,
        cart_empty_state: action.payload.cart_empty_state,
      };

    case UPDATE_ALL:
      return {
        ...state,
        update_state: action.payload.update_state,
      };

    case CART_STATE:
      return {
        ...state,
        cart_window_state: action.payload.cart_window_state,
      };

    case SORT_TYPE:
      return {
        ...state,
        sort_type: action.payload.sort_type,
      };

    case SHOW_DETAIL_PAGE:
      return {
        ...state,
        detail_page: true,
      };

    case CLOSE_DETAIL_PAGE:
      return {
        ...state,
        detail_page: false,
      };

    case EMPTY_PRODUCT:
      return {
        ...state,
        total_price: 0.0,
      };

    case ADD_PRODUCT:
      return {
        ...state,
        total_price: action.payload.total_price + state.total_price,
      };

    case SIGNUP_USER_TYPE:
      return {
        ...state,
        signup_user_type: action.payload.signup_user_type,
      };

    case USER_TYPE:
      return {
        ...state,
        user_type: action.payload.user_type,
      };

    case IMAGE_PREVIEW:
      return {
        ...state,
        image_preview: action.payload.image_preview,
      };

    case IMAGE_NOT_PREVIEW:
      return {
        ...state,
        image_preview: action.payload.image_preview,
      };

    case PRODUCT_OUT:
      return {
        ...state,
        product_window_state: action.payload.product_window_state,
      };

    case PRODUCT_LIST:
      return {
        ...state,
        product_window_state: action.payload.product_window_state,
      };

    case PRODUCT_CREATE:
      return {
        ...state,
        product_window_state: action.payload.product_window_state,
      };

    case PRODUCT_EDIT:
      return {
        ...state,
        product_window_state: action.payload.product_window_state,
      };

    case PRODUCT_DETAIL:
      return {
        ...state,
        product_window_state: action.payload.product_window_state,
      };

    case PRODUCT_ID:
      return { ...state, product_id: action.payload.product_id };

    case OPEN_MODAL:
      return { ...state, modal_state: OPEN_MODAL };

    case CLOSE_MODAL:
      return { ...state, modal_state: CLOSE_MODAL };
    // return {
    //   ...state,
    //   modal_state: CLOSE_MODAL,
    //   login_state: action.payload.login_state,
    // };

    case LOGIN:
      return { ...state, login_window_state: LOGIN };

    case SIGNUP:
      return { ...state, login_window_state: SIGNUP };

    case RESET_PASSWORD:
      return { ...state, login_window_state: RESET_PASSWORD };

    case LOGIN_SUCCESS:
      return { ...state, login_state: LOGIN_SUCCESS };

    case LOGOUT_SUCCESS:
      return { ...state, login_state: LOGOUT_SUCCESS };

    case SIGN_UP_SUCCESS:
      return {
        ...state,
        user_email: action.payload.user_email,
        isLoggedIn: action.payload.isLoggedIn,
        error_message: null,
      };

    case SIGN_UP_FAILURE:
      return {
        ...state,
        error_message: action.payload.error_message,
      };

    case SIGN_IN_SUCCESS:
      return {
        ...state,
        user_email: action.payload.user_email,
        user_id: action.payload.id,
        isLoggedIn: action.payload.isLoggedIn,
        error_message: null,
      };

    case SIGN_IN_FAILURE:
      return {
        ...state,
        error_message: action.payload.error_message,
      };

    case SIGN_OUT_SUCCESS:
      return {
        ...state,
        user_email: action.payload.user_email,
        // user_id: action.payload.id,
        isLoggedIn: action.payload.isLoggedIn,
        error: null,
      };

    case SIGN_OUT_FAILURE:
      return {
        ...state,
        error: action.payload.error_message,
      };

    case UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        user_email: action.payload.user_email,
        isLoggedIn: action.payload.isLoggedIn,
        error_message: null,
      };

    case UPDATE_PASSWORD_FAILURE:
      return {
        ...state,
        error_message: action.payload.error_message,
      };

    default:
      return state;
  }
};
