import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  productList,
  imagePreview,
  imageNotPreview,
} from "../../../../actions";
import "./index.css";
import { INVALID_INPUT } from "../../../../../server/content/form";

const CreateForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const preview_state = useSelector((state) => state.image_preview);
  const [inputError, setInputError] = useState(false);

  const dispatch = useDispatch();

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
          category: category,
          price: price,
          stock: stock,
          image: image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === INVALID_INPUT) {
          setInputError(true);
        }
        console.log("Get create API error:", errorData);

        // dispatch(signInFailure(errorData));
      } else {
        console.log("Get create successful");
        setInputError(false);
        dispatch(productList());
        dispatch(imageNotPreview());
      }
    } catch (error) {
      // dispatch(signInFailure(error));
    }
  };

  // 更新照片链接和预览
  const handleImageLinkChange = (e) => {
    setImage(e.target.value);
    // setImagePreview(e.target.value);
  };

  return (
    <>
      <div className="product-create-container">
        <form className="product-create-form">
          <div className="product-name-option">
            <label htmlFor="name">Product name</label>
            <input
              className="product-add-name"
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="product-description-option">
            <label htmlFor="description">Product description</label>
            <textarea
              className="product-add-description"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="one-line">
            <div className="category-option">
              <label htmlFor="type">Category</label>
              <select
                className="create-category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Please select category</option>
                <option value="Category1">Category1</option>
                <option value="Category2">Category2</option>
                <option value="Category3">Category3</option>
              </select>
            </div>
            <div className="price-option">
              <label htmlFor="price">Price</label>
              <input
                className="create-price"
                // type="number"
                step="0.01"
                id="price"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="second-line">
            <div className="stock-option">
              <label htmlFor="stock">In Stock Quantity</label>
              <input
                className="stock-input"
                // type="number"
                id="stock"
                name="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
            <div className="image-option">
              <label htmlFor="photoLink">Add Image Link</label>
              <div className="image-wrap">
                <input
                  className="image"
                  type="url"
                  id="photoLink"
                  name="photoLink"
                  value={image}
                  onChange={handleImageLinkChange}
                  required
                />
                <div
                  className="preview"
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

          <div className="image-preview-box">
            {preview_state ? (
              <img
                className="image-preview-one"
                src={image}
                alt="Preview"
                style={{ maxWidth: "100%" }}
              />
            ) : (
              <div className="preview-box">
                <img
                  className="image-box"
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

          <div className="bottom-button">
            <button className="bottom-add-button" onClick={addProduct}>
              ADD
            </button>
            {inputError && (
              <div className="error-add-input">Invalid input!</div>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateForm;
