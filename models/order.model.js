const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    UID: {
      type: String,
      required: true,
      maxLength: 255,
    },
    patientName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    age: {
      type: Number,
      required: false,
    },
    teethNo: {
      type: Number,
      required: true,
    },
    sex: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
      maxLength: 255,
    },
    description: {
      type: String,
      required: false,
    },
    screen: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      default: "DocReady(P)",
      enum: [
        "DocReady(P)",
        "DocReady(F)",
        "OTW_LAB(P)",
        "OTW_LAB(F)",
        "UNDERWAY(P)",
        "UNDERWAY(F)",
        "LabReady(P)",
        "LabReady(F)",
        "OTW_DOC(P)",
        "OTW_DOC(F)",
        "END(P)",
        "END(F)",
      ],
      maxLength: 255,
    },
    price: {
      type: Number,
      required: false,
    },
    paid: {
      type: Number,
      required: true,
    },
    lab_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    doc_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
      required: false,
    },
    prova: {
      type: Boolean,
      required: false,
      default: true,
    },
    docReady: {
      type: Boolean,
      required: false,
      default: false,
    },
    image: String,
    image1: String,
    image2: String,
    file: String,
    video: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
exports.Order = Order;
