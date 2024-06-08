const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    UID: {
      type: String,
      required: true,
      maxLength: 255,
    },
    username: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    phone: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    email: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    buildNo: {
      type: Number,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    floorNo: {
      type: Number,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    address: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    password: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    role: {
      type: String,
      enum: ["DOC", "LAB", "NOM", "DEL"],
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    docsId: {
      type: [mongoose.Schema.ObjectId],
      ref: "User",
      required: false,
    },
    labId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
    },
    labContract: {
      type: Object,
      required: false,
    },
    delOrders: {
      type: [mongoose.Schema.ObjectId],
      ref: "Order",
      required: false,
    },
    subscription: {
      type: Date,
      required: false,
      default: null,
    },
    publicDelivery: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
exports.User = User;
