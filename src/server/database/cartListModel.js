const mongooose = require("mongoose");
const cartListSchema = require("./cartListSchema");

const CartList = mongooose.model("CartList", cartListSchema);

module.exports = CartList;
