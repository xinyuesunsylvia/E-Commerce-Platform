var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

//connect to database
const connectToMongoose = require("./database/connect");
connectToMongoose();

// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");

var app = express();
app.set("view engine", "ejs");

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

// APIs
const authApi = require("./authApi");
app.use("/auth", authApi);
const productApi = require("./productApi");
app.use("/products", productApi);
const cartApi = require("./cartApi");
app.use("/cart", cartApi);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
