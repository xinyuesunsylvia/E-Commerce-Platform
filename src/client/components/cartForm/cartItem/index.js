import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import {
  productId,
  productDetail,
  productCreate,
  productEdit,
  addProduct,
  showDetailPage,
  updateAll,
} from "../../../actions";
import { ADMIN_USER, NORMAL_USER, ADD_PRODUCT } from "../../content/form";

const CartItem = ({ product, update, setUpdate }) => {
  const dispatch = useDispatch();
  const [num, setNum] = useState(1);
  const user_type = useSelector((state) => state.user_type);
  const user_email = useSelector((state) => state.user_email);
  const update_state = useSelector((state) => state.update_state);

  useEffect(() => {
    const fetchGetNum = async () => {
      try {
        const response = await fetch(
          `/cart/get/${product.productId}?email=${user_email || "temporary"}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.log("Get create API error:", errorData);
        }
        const cartData = await response.json();
        const quantity = cartData.quantity;
        setNum(quantity);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    const getCartNum = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const index = cart.findIndex((item) => item.id === product.id);
      const quantity = index !== -1 ? cart[index].quantity : 0;
      setNum(quantity);
      // setItemIsLoading(false);
    };
    if (user_email) {
      // console.log("user_email1" + user_email);
      fetchGetNum();
    } else {
      getCartNum();
    }
  }, []);
  const removeProduct = async () => {
    try {
      await fetch(`/cart/delete/${product.productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user_email || "temporary",
        }),
      });
      setNum(0);
      dispatch(updateAll(!update_state));
    } catch (error) {
      console.error(error);
    }
  };

  const incrementNum = async () => {
    try {
      await fetch(`/cart/update/${product.productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user_email || "temporary",
          quantity: num + 1,
        }),
      });
      setNum(num + 1);
      dispatch(updateAll(!update_state));
    } catch (error) {
      console.error(error);
    }
  };

  const decrementNum = async () => {
    if (num > 0) {
      try {
        await fetch(`/cart/update/${product.productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user_email || "temporary",
            quantity: num - 1,
          }),
        });
        setNum(num - 1);
        dispatch(updateAll(!update_state));
        // if (num === 0) {
        //   setUpdate(!update);
        // }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (num === 0) {
      setUpdate(!update);
      dispatch(updateAll(!update_state));
    }
  }, [num]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log(cart);
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id
    );
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity = num + 1;
    } else {
      const newProduct = { ...product, quantity: 1 };
      cart.push(newProduct);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setNum(num + 1);
    dispatch(updateAll(!update_state));
  };

  const deleteFromCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id
    );
    if (existingProductIndex !== -1) {
      const product = cart[existingProductIndex];
      if (num > 1) {
        product.quantity = num - 1;
      } else {
        cart.splice(existingProductIndex, 1);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    setNum(num - 1);
    dispatch(updateAll(!update_state));
  };
  const removeFromCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id
    );
    if (existingProductIndex !== -1) {
      cart.splice(existingProductIndex, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    setNum(0);
    dispatch(updateAll(!update_state));
  };

  return (
    <div>
      <div className="cart-card-all-page">
        {/* <div className=""></div> */}
        <img
          src={product.image}
          alt={product.name}
          className="cart-card-image"
        />
        <div className="cart-one-column">
          <div className="cart-product-name">{product.name}</div>
          <div className="cart-num-stock">
            <button
              className="cart-num-button"
              onClick={user_email ? incrementNum : addToCart}
            >
              +
            </button>
            <input className="cart-num-value" value={num} readOnly />
            <button
              className="cart-num-button"
              onClick={user_email ? decrementNum : deleteFromCart}
            >
              -
            </button>
          </div>
        </div>

        <div className="cart-second-column">
          <p className="cart-product-price">${product.price}</p>
          <button
            className="cart-remove-button"
            onClick={user_email ? removeProduct : removeFromCart}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
export default CartItem;
