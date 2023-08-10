const express = require("express");
const bcrypt = require("bcrypt");
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
} = require("./content/form");

const CartList = require("./database/cartListModel");
const Product = require("./database/productModel");

const cartApi = express.Router();

// get cart product list
cartApi.get("/get-all", async (req, res) => {
  try {
    const cartList = await CartList.find();
    if (cartList) {
      res.json(cartList);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "获取购物车记录失败" });
  }
});

// get cart product list
cartApi.get("/get-user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    let cartList;

    cartList = await CartList.findOne({ email });
    if (cartList) {
      if (cartList.products.length === 0) {
        res.json({ error: "EMPTY CART" });
      } else {
        res.json(cartList);
      }
    } else {
      res.json({ error: "EMPTY CART" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "获取购物车记录失败" });
  }
});

// get cart productId
cartApi.get("/get/:productId", async (req, res) => {
  try {
    const { email } = req.query;
    const { productId } = req.params;
    let cartList;

    cartList = await CartList.findOne({ email });
    if (cartList) {
      const product = cartList.products.find(
        (product) => product.productId === productId
      );
      if (product) {
        res.json(product);
      } else {
        // res.status(404).json({ message: "购物车中未找到指定商品" });
        res.json({ quantity: 0 });
      }
    } else {
      res.json({ quantity: 0 });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "获取购物车记录失败" });
  }
});

// create cart
cartApi.post("/create", async (req, res) => {
  try {
    const { email, productId } = req.body;
    let cartList;

    cartList = await CartList.findOne({ email });

    if (cartList) {
      const existingProductIndex = cartList.products.findIndex(
        (product) => product.productId === productId
      );
      if (existingProductIndex !== -1) {
        // cartList.products[existingProductIndex].quantity++;
        cartList.products[existingProductIndex].quantity = 1;
      } else {
        const product = await Product.findOne({ id: productId });
        if (!product) {
          throw new Error("商品不存在");
        }
        cartList.products.push({
          productId: product.id,
          quantity: 1,
          price: product.price,
          name: product.name,
          image: product.image,
        });
      }
      await cartList.save();
    } else {
      const product = await Product.findOne({ id: productId });
      if (!product) {
        throw new Error("商品不存在");
      }
      cartList = new CartList({
        email,
        products: [
          {
            productId: product.id,
            quantity: 1,
            price: product.price,
            name: product.name,
            image: product.image,
          },
        ],
      });
      await cartList.save();
    }

    res.json({ message: "商品已添加到购物车" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// update cart product
cartApi.put("/update/:productId", async (req, res) => {
  try {
    const { email } = req.body;
    const { productId } = req.params;
    const { quantity } = req.body;
    let cartList;

    cartList = await CartList.findOne({ email });
    if (quantity === 0) {
      cartList = await CartList.findOne({ email });
      if (cartList) {
        cartList.products = cartList.products.filter(
          (product) => product.productId !== productId
        );
        await cartList.save();
        res.json({ message: "购物车记录已更新" });
      } else {
        res.json({ message: "no such email" });
      }
    } else {
      if (cartList) {
        const productIndex = cartList.products.findIndex(
          (product) => product.productId === productId
        );
        if (productIndex !== -1) {
          cartList.products[productIndex].quantity = quantity;
          await cartList.save();
          res.json({ message: "购物车记录已更新" });
        } else {
          res.json({ message: "购物车中目前没有指定商品" });
        }
      } else {
        res.json({ message: "no such email" });
        // res.status(404).json({ message: "购物车记录不存在" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "更新购物车记录失败" });
  }
});

// delete cart product
cartApi.delete("/delete/:productId", async (req, res) => {
  try {
    const { email } = req.body;
    const { productId } = req.params;
    let cartList;

    cartList = await CartList.findOne({ email });
    if (cartList) {
      const productIndex = cartList.products.findIndex(
        (product) => product.productId === productId
      );
      if (productIndex !== -1) {
        cartList.products.splice(productIndex, 1);
        await cartList.save();
        res.json({ message: "购物车记录已删除" });
      } else {
        res.status(404).json({ message: "购物车中未找到指定商品" });
      }
    } else {
      res.status(404).json({ message: "购物车记录不存在" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

cartApi.delete("/delete-all", async (req, res) => {
  try {
    await CartList.deleteMany({});
    res.json({ message: "所有购物车记录已删除" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

module.exports = cartApi;
