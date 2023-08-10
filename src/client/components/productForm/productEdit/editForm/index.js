import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  productList,
  imagePreview,
  imageNotPreview,
} from "../../../../actions";
import "./index.css";

const EditForm = () => {
  const [product, setProduct] = useState({});
  const [formData, setFormData] = useState({
    // name: product.name,
    // description: product.description,
    // category: product.category,
    // price: product.price,
    // stock: product.stock,
    // image: product.image,
    // imagePreview: product.image,
  });
  const [image, setImage] = useState();
  const [inputError, setInputError] = useState(false);
  const productId = useSelector((state) => state.product_id);
  const preview_state = useSelector((state) => state.image_preview);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/products/detail/${productId}`);

        if (response.ok) {
          const data = await response.json();
          setProduct(data.product);
          setFormData(data.product);
          setImage(data.product.name);
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

  const editProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/products/edit/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === "invalid input") {
          setInputError(true);
        }
        console.log("Get create API error:", errorData);
      } else {
        console.log("Get create successful");
        setInputError(false);
      }
    } catch (error) {
      console.log("Get error");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <>
      <div className="product-edit-container">
        <form className="product-edit-form">
          <div className="product-name-option">
            <label htmlFor="name">Product name</label>
            <input
              className="product-edit-name"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="product-description-option">
            <label className="description">Product description</label>
            <textarea
              className="product-edit-description"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="edit-one-line">
            <div className="category-edit-option">
              <label htmlFor="type">Category</label>
              <select
                className="edit-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Category1">Category1</option>
                <option value="Category2">Category2</option>
                <option value="Category3">Category3</option>
              </select>
            </div>
            <div className="edit-price-option">
              <label htmlFor="price">Price</label>
              <input
                className="edit-price"
                // type="number"
                step="0.01"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="edit-second-line">
            <div className="edit-stock-option">
              <label htmlFor="stock">In Stock Quantity</label>
              <input
                className="edit-stock-input"
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
            <div className="edit-image-option">
              <label className="edit-photoLink">Add Image Link</label>
              <div className="edit-image-wrap">
                <input
                  className="edit-image"
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
                <div
                  className="edit-preview"
                  onClick={(event) => {
                    event.preventDefault();
                    dispatch(imagePreview());
                  }}
                >
                  Preview
                </div>
              </div>
            </div>
          </div>

          <div className="edit-image-preview-box">
            {preview_state ? (
              <img
                className="edit-image-preview-one"
                src={formData.image}
                alt="Preview"
                style={{ maxWidth: "100%" }}
              />
            ) : (
              <div className="edit-preview-box">
                <img
                  className="edit-image-box"
                  src={
                    "https://pixsector.com/cache/517d8be6/av5c8336583e291842624.png"
                  }
                  alt="Original"
                  style={{ maxWidth: "20%" }}
                />
                <div>image preview!</div>
              </div>
            )}
          </div>

          <div className="edit-bottom-button">
            <button
              className="edit-bottom-edit-button"
              onClick={(event) => {
                event.preventDefault();
                editProduct(event);
                dispatch(productList());
                dispatch(imageNotPreview());
              }}
            >
              Edit
            </button>
            {inputError && (
              <div className="edit-error-edit-input">Invalid input!</div>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default EditForm;
