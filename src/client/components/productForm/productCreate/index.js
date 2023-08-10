import React, { useState } from "react";
import "./index.css"; // 引用CSS文件
import Card from "../../common/card";
import CreateForm from "./createForm";

const ProductCreateForm = () => {
  return (
    <>
      <div className="create-page">
        <h1 id="create-title">Create Product</h1>
        <div className="product-create">
          <Card>{<CreateForm></CreateForm>}</Card>
        </div>
      </div>
    </>
  );
};

export default ProductCreateForm;
