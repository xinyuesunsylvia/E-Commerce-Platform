//mongodb+srv://xinyuesun1996:<password>@cluster0.48tyjv9.mongodb.net/?retryWrites=true&w=majority
const mongooose = require("mongoose");
const connectionStr =
  "mongodb+srv://xinyuesun1996:xinyuesun@cluster0.48tyjv9.mongodb.net/?retryWrites=true&w=majority";

const connectToMongoose = () => {
  mongooose.connect(connectionStr);

  const db = mongooose.connection;
  db.on("error", console.error.bind(console), "connection error");
  db.on("open", () => {
    console.log("connect to mongodb");
  });
};

module.exports = connectToMongoose;
