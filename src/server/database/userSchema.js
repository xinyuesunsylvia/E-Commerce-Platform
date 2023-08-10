//schema => define field => generate model => use model => query, insert, delete, update
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  isLoggedIn: { type: Boolean, default: false },
  type: { type: String, required: true },
  id: { type: String, required: true },
  token: { type: String },
});

module.exports = userSchema;
