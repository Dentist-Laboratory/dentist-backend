var express = require("express");
const {
  addDocController,
  updateDoctorContractController,
  getDoctorContractController,
  markOrderReadyController,
  getAllOrdersController,
  getLabDocsController,
  orderPaidController,
  getProfitsController,
  setPublicDelivery,
  removeDocFromLabController,
  getOrderByIdController,
} = require("../controllers/labController");
var router = express.Router();
const isLab = require("../middlewares/isLab");

router.post("/addDoc/:id", isLab, addDocController);
router.delete("/deleteDoc/:id", isLab, removeDocFromLabController);
router.put("/contract/:id", isLab, updateDoctorContractController);
router.get("/contract/:id", isLab, getDoctorContractController);

router.get("/orders", isLab, getAllOrdersController);
router.get("/orders/:id", isLab, getOrderByIdController);
router.patch("/orders/:id", isLab, markOrderReadyController);
router.patch("/orders/paid/:id", isLab, orderPaidController);

router.get("/doctors", isLab, getLabDocsController);

router.get("/financial", isLab, getProfitsController);

router.patch("/public", isLab, setPublicDelivery);

module.exports = router;
