import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./index.css";
import {
  productList,
  productEdit,
  addProduct,
  closeDetailPage,
} from "../../../../actions";
import { ADMIN_USER, NORMAL_USER } from "../../../content/form";

const DetailForm = () => {
  const [product, setProduct] = useState({});
  const user_type = useSelector((state) => state.user_type);
  const productId = useSelector((state) => state.product_id);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/products/detail/${productId}`);

        if (response.ok) {
          const data = await response.json();
          setProduct(data.product);
        } else {
          console.log("Get product API error:", response.statusText);
        }
      } catch (error) {
        console.log("Get product API error:", error);
      }
    };
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return (
    <>
      <div className="product-create-container">
        <div className="image-preview">
          {true ? (
            <img
              src={product.image}
              alt="Preview"
              style={{ maxWidth: "100%" }}
            />
          ) : (
            <img src={""} alt="Original" style={{ maxWidth: "100%" }} />
          )}
        </div>

        <form className="product-create-form">
          <label className="category">{product.category}</label>
          <label className="name">{product.name}</label>
          <label className="price">${product.price}</label>
          <label className="description">{product.description}</label>
          <div className="detail-bottom-button">
            {user_type === NORMAL_USER && (
              <button
                className="detail-button"
                onClick={(event) => {
                  event.preventDefault();
                  dispatch(addProduct(product.price));
                }}
              >
                Add To Cart
              </button>
            )}
            {user_type === ADMIN_USER && (
              <button
                className="detail-button"
                onClick={(event) => {
                  event.preventDefault();
                  dispatch(productEdit());
                }}
              >
                Edit
              </button>
            )}
            <button
              className="detail-button"
              onClick={(event) => {
                event.preventDefault();
                dispatch(productList());
                dispatch(closeDetailPage());
              }}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default DetailForm;
