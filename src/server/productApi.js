const express = require("express");
const { v4: uuidv4 } = require("uuid");

const {
  SERVER_ERROR,
  EMAIL_EXISTED,
  SIGNUP_SUCCESS,
  EMAIL_NOT_EXISTED,
  WRONG_PASSWORD,
  SIGNIN_SUCCESS,
  SIGNOUT_SUCCESS,
  UPDATE_PASSWORD_SUCCESS,
  INVALID_INPUT,
} = require("./content/form");

const Product = require("./database/productModel");

const productApi = express.Router();

// 产品相关的 API 路由

// list
productApi.get("/list", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: SERVER_ERROR });
  }
});

// sort by last added
productApi.get("/last", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: SERVER_ERROR });
  }
});

// sort by low to high price
productApi.get("/low", async (req, res) => {
  try {
    const products = await Product.find().sort({ price: 1 });
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: SERVER_ERROR });
  }
});

// sort by hight to low price
productApi.get("/high", async (req, res) => {
  try {
    const products = await Product.find().sort({ price: -1 });
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: SERVER_ERROR });
  }
});

// create
productApi.post("/create", async (req, res) => {
  const { name, description, category, price, stock, image } = req.body;
  const id = uuidv4();

  if (!name || !description || !category || !price || !stock || !image) {
    return res.status(400).json({ error: INVALID_INPUT });
  }

  try {
    const product = new Product({
      id,
      name,
      description,
      category,
      price,
      stock,
      image,
      createdAt: new Date(),
    });

    await product.save();
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// edit
productApi.put("/edit/:id", async (req, res) => {
  const { name, description, category, price, stock, image } = req.body;
  if (!name || !description || !category || !price || !stock || !image) {
    return res.status(400).json({ error: "invalid input" });
  }
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ id: productId });
    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.price = price || product.price;
      product.stock = stock || product.stock;
      product.image = image || product.image;

      await product.save();
      res.json({ product });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get detail
productApi.get("/detail/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// delete
productApi.delete("/delete/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOneAndDelete({ id: productId });
    if (product) {
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

productApi.delete("/delete-all", async (req, res) => {
  try {
    await Product.deleteMany();
    res.json({ message: "All products deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = productApi;
