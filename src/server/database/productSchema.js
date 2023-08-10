const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, reuqired: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = productSchema;
