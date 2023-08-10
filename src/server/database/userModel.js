const mongooose = require("mongoose");
const userSchema = require("./userSchema");

const User = mongooose.model("User", userSchema);

module.exports = User;
