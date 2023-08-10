const express = require("express");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("./database/userModel");
const CartList = require("./database/cartListModel");
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

const authApi = express.Router();

authApi.get("/get-all-info", async (req, res) => {
  try {
    const allInfo = await User.find();
    res.json(allInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: SERVER_ERROR });
  }
});

// get user
authApi.get("/get/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const cur_user = await User.findOne({ token: token });
    res.json(cur_user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: SERVER_ERROR });
  }
});

// 用户注册
authApi.post("/sign-up", async (req, res) => {
  try {
    const { email, password, type } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: EMAIL_EXISTED });
    }

    const randomBytes = crypto.randomBytes(16);
    const token = randomBytes.toString("hex");

    // 创建新用户
    const newUser = new User({
      email: email,
      password: hashedPassword,
      isLoggedIn: false,
      type: type,
      token: token,
      id: uuidv4(),
    });

    // 保存新用户到数据库
    await newUser.save();

    res.json({ message: SIGNUP_SUCCESS });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: SERVER_ERROR });
  }
});

// 用户登录
authApi.post("/sign-in", async (req, res) => {
  try {
    const { email, password, cart } = req.body;

    // 查询用户信息
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: EMAIL_NOT_EXISTED });
    }

    // 检查密码是否匹配
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: WRONG_PASSWORD });
    }
    // 生成 token
    const randomBytes = crypto.randomBytes(16);
    const token = randomBytes.toString("hex");

    // 将 token 存储在用户数据中
    user.token = token;

    user.isLoggedIn = true;
    await user.save();

    const user_type = user.type;

    // Merge temporary cart with existing cart
    const existingCartList = await CartList.findOne({ email: email });

    if (existingCartList) {
      if (cart) {
        cart.forEach(async (cartItem) => {
          const existingProductIndex = existingCartList.products.findIndex(
            (product) => product.productId === cartItem.id
          );
          if (existingProductIndex !== -1) {
            existingCartList.products[existingProductIndex].quantity +=
              cartItem.quantity;
          } else {
            existingCartList.products.push({
              productId: cartItem.id,
              quantity: cartItem.quantity,
              price: cartItem.price,
              name: cartItem.name,
              image: cartItem.image,
            });
          }
        });
        await existingCartList.save();
        await CartList.deleteMany({ email: "temporary" });
      }
    } else {
      console.log(cart);
      if (cart) {
        const newCartList = new CartList({
          email: email,
          products: [],
        });
        cart.forEach(async (cartItem) => {
          newCartList.products.push({
            productId: cartItem.id,
            quantity: cartItem.quantity,
            price: cartItem.price,
            name: cartItem.name,
            image: cartItem.image,
          });
        });
        await newCartList.save();
      } else {
        const newCartList = new CartList({
          email: email,
          products: [],
        });
        await newCartList.save();
      }
    }
    res.json({ message: SIGNIN_SUCCESS, type: user_type, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: SERVER_ERROR });
  }
});

// 用户登出
authApi.post("/sign-out", async (req, res) => {
  try {
    const { email } = req.body;

    // 查询用户信息
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: EMAIL_EXISTED });
    }

    // 更新用户登录状态
    user.token = null;
    user.isLoggedIn = false;
    await user.save();

    res.json({ message: SIGNOUT_SUCCESS });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: SERVER_ERROR });
  }
});

// 更新用户密码
authApi.put("/update-password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    // 查询用户信息
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: EMAIL_NOT_EXISTED });
    }

    // 检查当前密码是否匹配
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: WRONG_PASSWORD });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 更新用户密码
    user.password = hashedPassword;
    await user.save();

    res.json({ message: UPDATE_PASSWORD_SUCCESS });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: SERVER_ERROR });
  }
});

// delete
authApi.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const product = await User.findOneAndDelete({ id: userId });
    if (product) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

authApi.delete("/delete-all", async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = authApi;
