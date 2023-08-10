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
  loadingState,
} from "../../../../actions";
import {
  ADMIN_USER,
  NORMAL_USER,
  ADD_PRODUCT,
  PENDING,
  LOADING_FINISHED,
} from "../../../content/form";

const ProductItem = ({ product, setItemIsLoading, isItemLoading }) => {
  const dispatch = useDispatch();
  const [num, setNum] = useState(0);
  const user_type = useSelector((state) => state.user_type);
  const user_email = useSelector((state) => state.user_email);
  const update_state = useSelector((state) => state.update_state);

  useEffect(() => {
    const fetchGetNum = async (url) => {
      try {
        // dispatch(loadingState(PENDING));
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        // dispatch(loadingState(LOADING_FINISHED));
        if (!response.ok) {
          const errorData = await response.json();
          console.log("Get create API error:", errorData);
        } else {
          const cartData = await response.json();
          const quantity = cartData.quantity;
          console.log("quantity" + quantity);
          console.log("user_email:" + user_email);
          setNum(quantity);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setItemIsLoading(false);
        // dispatch(loadingState(LOADING_FINISHED));
      }
    };
    const getCartNum = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const index = cart.findIndex((item) => item.id === product.id);
      const quantity = index !== -1 ? cart[index].quantity : 0;
      setNum(quantity);
      setItemIsLoading(false);
    };

    if (user_email) {
      console.log("user_email1" + user_email);
      fetchGetNum(`/cart/get/${product.id}?email=${user_email || "temporary"}`);
    } else {
      getCartNum();
    }
    console.log("user_email2:" + user_email);
  }, [update_state, user_email]);

  console.log("user_email2:" + user_email);
  console.log("num" + num);
  const addProduct = async () => {
    try {
      await fetch("/cart/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user_email || "temporary",
          productId: product.id,
        }),
      });
      setNum(num + 1);
      dispatch(updateAll(!update_state));
    } catch (error) {
      console.error(error);
    }
  };

  const incrementNum = async () => {
    try {
      await fetch(`/cart/update/${product.id}`, {
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
        await fetch(`/cart/update/${product.id}`, {
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
      } catch (error) {
        console.error(error);
      }
    }
  };

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

  const removeFromCart = () => {
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

  const clearCart = () => {
    localStorage.removeItem("cart");
  };

  return (
    <>
      <div className="item-card">
        {isItemLoading ? (
          <div>is loading</div>
        ) : (
          <>
            <img
              src={product.image}
              alt={product.name}
              className="item-card-image"
              onClick={() => {
                dispatch(productId(product.id));
                dispatch(productDetail());
                dispatch(showDetailPage());
              }}
            />
            <div className="product-name">{product.name}</div>
            <p className="product-price">${product.price}</p>

            <div className="edit-option">
              {num == 0 && !isItemLoading && (
                <button
                  className="product-add-button"
                  onClick={
                    user_email
                      ? () => {
                          setNum(num + 1);
                          addProduct();
                          // dispatch(addProduct(product.price));
                        }
                      : addToCart
                  }
                >
                  Add
                </button>
              )}
              <div className="admin">
                {num !== 0 && !isItemLoading && (
                  <div className="stock">
                    <button
                      className="stock-button"
                      onClick={user_email ? incrementNum : addToCart}
                    >
                      +
                    </button>
                    <input className="stock-value" value={num} readOnly />
                    <button
                      className="stock-button"
                      onClick={user_email ? decrementNum : removeFromCart}
                    >
                      -
                    </button>
                  </div>
                )}

                {user_type === ADMIN_USER && !isItemLoading && (
                  <button
                    className="product-edit-button"
                    onClick={() => {
                      dispatch(productId(product.id));
                      dispatch(productEdit(product.id));
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default ProductItem;
