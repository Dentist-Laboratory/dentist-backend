var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const ApiError = require("./utils/api.error");
const globalError = require("./middlewares/error.middleware");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var labRouter = require("./routes/labs");
var docRouter = require("./routes/doctor.routes");
var adminRouter = require("./routes/admins");
var deliveryRouter = require("./routes/deliverers");
const dbConnection = require("./configs/database");

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected To MongoDB"))
  .catch((err) => console.log(err));

var app = express();
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/labs", labRouter);
app.use("/doctors", docRouter);
app.use("/admins", adminRouter);
app.use("/deliverers", deliveryRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Global error handling middleware for express
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});
app.use(globalError);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
