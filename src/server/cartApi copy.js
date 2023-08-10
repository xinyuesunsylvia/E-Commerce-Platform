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

// user login merge cart
cartApi.post("/login", async (req, res) => {
  try {
    // 用户登录成功后，查找该用户的购物车记录
    const cart = req.session.cart || [];
    const { email } = req.body;
    const existingCartList = await CartList.findOne({ email });

    // 如果找到该用户的购物车记录，则将未登录用户的购物车记录合并到该用户的购物车记录中
    if (existingCartList) {
      cart.forEach(async (cartItem) => {
        const existingProductIndex = existingCartList.products.findIndex(
          (product) => product.productId === cartItem.productId
        );
        if (existingProductIndex !== -1) {
          existingCartList.products[existingProductIndex].quantity +=
            cartItem.quantity;
        } else {
          existingCartList.products.push(cartItem);
        }
      });
      await existingCartList.save();
      // 如果未找到该用户的购物车记录，则将未登录用户的购物车记录作为该用户的购物车记录
    } else {
      const cartList = new CartList({
        email,
        products: cart,
      });
      await cartList.save();
    }

    req.session.cart = [];
    res.json({ message: "登录成功" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// create cart
cartApi.post("/create", async (req, res) => {
  try {
    const { email, productId } = req.body;
    let cartList;

    // 如果用户已登录，查找该用户的购物车记录
    if (email) {
      cartList = await CartList.findOne({ email });
      // 如果找到该用户的购物车记录，则将商品添加进去
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
        // 如果未找到该用户的购物车记录，则创建一个新的购物车记录
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
      // 如果用户未登录，则将商品添加到未登录用户的购物车记录中
    } else {
      let cart = req.session.cart || [];
      const existingProductIndex = cart.findIndex(
        (product) => product.productId === productId
      );
      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity++;
      } else {
        const product = await Product.findOne({ id: productId });
        if (!product) {
          throw new Error("商品不存在");
        }
        cart.push({
          productId: product.id,
          quantity: 1,
          price: product.price,
          name: product.name,
          image: product.image,
        });
      }
      req.session.cart = cart;
    }

    res.json({ message: "商品已添加到购物车" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

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

// get cart productId
cartApi.get("/get/:productId", async (req, res) => {
  try {
    const { email } = req.query;
    const { productId } = req.params;
    let cartList;

    // 如果用户已登录，查找该用户的购物车记录
    if (email) {
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
        res.json([]);
      }
    } else {
      const cart = req.session.cart || [];
      const product = cart.find((product) => product.productId === productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "购物车中未找到指定商品" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "获取购物车记录失败" });
  }
});

// cartApi.get("/get", async (req, res) => {
//   try {
//     const { email } = req.query;
//     let cartList;

//     // 如果用户已登录，查找该用户的购物车记录
//     if (email) {
//       cartList = await CartList.findOne({ email });
//       if (cartList) {
//         res.json(cartList.products);
//       } else {
//         res.json([]);
//       }
//     } else {
//       const cart = req.session.cart || [];
//       res.json(cart);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "获取购物车记录失败" });
//   }
// });

// update cart product
cartApi.put("/update/:productId", async (req, res) => {
  try {
    const { email } = req.body;
    const { productId } = req.params;
    const { quantity } = req.body;
    let cartList;

    if (email) {
      cartList = await CartList.findOne({ email });
      if (cartList) {
        const productIndex = cartList.products.findIndex(
          (product) => product.productId === productId
        );
        if (productIndex !== -1) {
          cartList.products[productIndex].quantity = quantity;
          await cartList.save();
          res.json({ message: "购物车记录已更新" });
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
          await cartList.save();
          res.json({ message: "购物车记录创建已更新" });
          // res.status(404).json({ message: "购物车中未找到指定商品" });
        }
      } else {
        res.json({ message: "no data" });
        // res.status(404).json({ message: "购物车记录不存在" });
      }
    } else {
      // old
      let cart = req.session.cart || [];
      const existingProductIndex = cart.findIndex(
        (product) => product.productId === productId
      );
      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity = quantity;
        req.session.cart = cart;
        res.json({ message: "购物车记录已更新" });
      } else {
        res.status(404).json({ message: "购物车中未找到指定商品" });
      }
    }
    // try
    // let cart = req.session.cart || [];
    //   const existingProductIndex = cart.findIndex(
    //     (product) => product.productId === productId
    //   );
    //   if (existingProductIndex !== -1) {
    //     cart[existingProductIndex].quantity++;
    //   } else {
    //     const product = await Product.findById(productId);
    //     if (!product) {
    //       throw new Error("商品不存在");
    //     }
    //     cart.push({
    //       productId: product.id,
    //       quantity: 1,
    //       price: product.price,
    //       name: product.name,
    //       image: product.image,
    //     });
    //   }
    //   req.session.cart = cart;
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

    // 如果用户已登录，查找该用户的购物车记录
    if (email) {
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
      // 如果用户未登录，则将商品从未登录用户的购物车记录中删除
    } else {
      let cart = req.session.cart || [];
      const productIndex = cart.findIndex(
        (product) => product.productId === productId
      );
      if (productIndex !== -1) {
        cart.splice(productIndex, 1);
        req.session.cart = cart;
        res.json({ message: "购物车记录已删除" });
      } else {
        res.status(404).json({ message: "购物车中未找到指定商品" });
      }
    }
  } catch (error) {
    console.error(error);
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
