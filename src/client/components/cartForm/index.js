import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/card";
import "./index.css";
import CartItem from "./cartItem";
import Modal from "../common/modal";
import {
  cartState,
  closeModal,
  errorBoundary,
  updateAll,
} from "../../actions/index";

import ReactPaginate from "react-paginate";

const CartForm = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState();
  const dispatch = useDispatch();
  const user_type = useSelector((state) => state.user_type);
  const sort_type = useSelector((state) => state.sort_type);
  const cart_window = useSelector((state) => state.cart_window_state);
  const user_email = useSelector((state) => state.user_email);
  const [empty, setEmpty] = useState(false);
  const [update, setUpdate] = useState(false);
  const update_state = useSelector((state) => state.update_state);

  // page
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const fetchProducts = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          if ((errorData.error = "EMPTY CART")) {
            setEmpty(true);
          }
        } else {
          const data = await response.json();
          const productsArray = data.products || [];
          setProducts(productsArray);
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
  }, [update_state]);

  const itemsPerPage = 2;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;

    setItemOffset(newOffset);
  };
  const productsList = currentItems.map((product) => (
    <CartItem
      product={product}
      id={product.productId}
      key={product._id}
      // name={product.name}
      // price={product.price}
      // image={product.image}
      // description={product.description}
      update={update}
      setUpdate={setUpdate}
    />
  ));

  // total num
  const totalNum = products.reduce((acc, product) => {
    return acc + product.quantity;
  }, 0);

  // subtotal
  const totalPrice = products.reduce((acc, product) => {
    return acc + product.quantity * product.price;
  }, 0);

  // tax
  const tax_rate = 0.1;
  const tax = totalPrice * tax_rate;
  // discount
  const discount_rate = 0.05;
  const discount = totalPrice * discount_rate * -1;

  const estimatedTotalPrice = totalPrice + tax + discount;

  const handleCheckOut = async () => {
    try {
      const response = await fetch("cart/chaeck-out");
      if (!response.ok) {
        const errorData = await response.json();
        if ((errorData.error = "EMPTY CART")) {
          setEmpty(true);
        }
      } else {
        const data = await response.json();
        const productsArray = data.products || [];
        setProducts(productsArray);
      }
    } catch (error) {
      dispatch(errorBoundary(true));
      console.error("Error fetching products:", error);
    }
  };

  return (
    <>
      <section className="cart-products">
        <Modal
          onClose={() => {
            dispatch(cartState(false));
            dispatch(closeModal());
            dispatch(updateAll(!update_state));
          }}
        >
          {
            <>
              <div className="cart-title">
                <div className="cart-title-name">Cart</div>
                <div className="cart-total-num">({totalNum})</div>
              </div>
              {empty ? <div>EMPTY CART</div> : productsList}
              <ReactPaginate
                breakLabel="..."
                nextLabel=">>"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<<"
                renderOnZeroPageCount={null}
                containerClassName="pagination-cart"
                pageLinkClassName="page-num-cart"
                nextLinkClassName="page-num-cart"
                previousLinkClassName="page-num-cart"
                activeLinkClassName="active"
              />
              <div className="discount-code">
                <div className="discount-tilte">Apply Discount Code</div>
                <div className="discount-apply">
                  <input className="dicount-input"></input>
                  <label className="discount-apply-button">Apply</label>
                </div>
              </div>
              <div className="total-price">
                <p className="total-price-title">Subtotal:</p>
                <p className="total-price-num">${totalPrice.toFixed(2)}</p>
              </div>
              <div className="total-tax">
                <p className="tax-title">Tax: </p>
                <p className="tax-num">${tax.toFixed(2)}</p>
              </div>
              <div className="total-discount">
                <p className="discount-title">discount: </p>
                <p className="discount-num">${discount.toFixed(2)}</p>
              </div>
              <div className="total-estimated-total">
                <p className="estimated-total-title">EstimatedTotal:</p>
                <p className="estimated-total-num">
                  ${estimatedTotalPrice.toFixed(2)}
                </p>
              </div>

              <button
                className="cart-check-out-button"
                onClick={handleCheckOut}
              >
                Continue to checkout
              </button>
            </>
          }
        </Modal>
      </section>
    </>
  );
};

export default CartForm;
