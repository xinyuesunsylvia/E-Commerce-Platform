import React, { useState, useEffect } from "react";
import "./index.css";
import Card from "../../common/card";
import DetailForm from "./DetailForm";

const ProductDetailForm = () => {
  return (
    <>
      <div className="detail-page">
        <h1 className="product-detail-page">Product Detail</h1>
        <Card>{<DetailForm></DetailForm>}</Card>
      </div>
    </>
  );
};

export default ProductDetailForm;
