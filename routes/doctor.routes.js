var express = require("express");

const upload = require("../utils/uploadImage");
const isDoc = require("../middlewares/isDoc");
const isDocOrLab = require("../middlewares/isDoc.isLab");
const { saveFilesNameToDB } = require("../middlewares/imagesAndFilesProcess");
const {
  createOrderController,
  editOrderController,
  getOrdersController,
  getOrderByIdController,
  getProfitsController,
  uploadOrderImgsAndFiles,
} = require("../controllers/doctorController");
var router = express.Router();

router.post(
  "/orders/add",
  isDoc,
  uploadOrderImgsAndFiles,
  saveFilesNameToDB,
  createOrderController
);
router.put(
  "/orders/update/:id",
  uploadOrderImgsAndFiles,
  saveFilesNameToDB,
  editOrderController
);

router.get("/orders", isDoc, getOrdersController);
router.get("/orders/:id", isDoc, getOrderByIdController);

router.get("/financial", isDoc, getProfitsController);

module.exports = router;
