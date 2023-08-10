import CartIcon from "./CartIcon/cartIcon";
import { cartState, emptyCart, openModal } from "../../actions/index";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import "./headerCart.css";

const HeaderCartButton = (props) => {
  const [products, setProducts] = useState([]);
  const total_price = useSelector((state) => state.total_price);
  const user_email = useSelector((state) => state.user_email);
  const [empty, setEmpty] = useState(false);
  // const empty = useSelector((state) => state.cart_empty_state);
  const update_state = useSelector((state) => state.update_state);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProducts = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          if ((errorData.error = "EMPTY CART")) {
            // dispatch(emptyCart(true));
            setEmpty(true);
          }
        } else {
          const data = await response.json();
          const productsArray = data.products || [];
          setProducts(productsArray);
          setEmpty(false);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const getCart = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      setProducts(cartItems);
    };
    if (user_email) {
      fetchProducts(`/cart/get-user/${user_email || "temporary"}`);
    } else {
      getCart();
    }
  }, [update_state, user_email]);

  const totalPrice = products.reduce((acc, product) => {
    return acc + product.quantity * product.price;
  }, 0);

  return (
    <button
      className="header-cart"
      onClick={() => {
        dispatch(openModal());
        dispatch(cartState(true));
      }}
    >
      <span className="icon">
        <CartIcon />
      </span>
      <span className="badge"> ${empty ? 0.0 : totalPrice.toFixed(2)} </span>
    </button>
  );
};

export default HeaderCartButton;
