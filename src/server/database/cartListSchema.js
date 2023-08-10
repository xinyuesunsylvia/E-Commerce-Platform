const mongoose = require("mongoose");

const cartListSchema = new mongoose.Schema({
  email: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
    },
  ],
});

module.exports = cartListSchema;
