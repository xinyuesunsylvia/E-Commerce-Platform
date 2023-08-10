import React, { useState, useEffect } from "react";
import "./index.css";
import Card from "../../common/card";
import EditForm from "./editForm";
import { useSelector } from "react-redux";

const ProductEditForm = () => {
  return (
    <>
      <div className="edit-page">
        <h1 id="edit-title">Edit Product</h1>
        <div className="product-edit">
          <Card>{<EditForm></EditForm>}</Card>
        </div>
      </div>
    </>
  );
};

export default ProductEditForm;
