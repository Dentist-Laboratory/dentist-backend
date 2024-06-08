var express = require("express");
const {
  getReadyOrders,
  takeOrderController,
  markOrderDeliveredDocController,
  markOrderDeliveredLabController,
  getProfitsController,
  getMyOrdersController,
} = require("../controllers/deliveryController");
const isDel = require("../middlewares/isDel");
var router = express.Router();

router.get("/orders", isDel, getReadyOrders);
router.get("/orders/myOrders", isDel, getMyOrdersController);
router.patch("/orders/otw/:id", isDel, takeOrderController);
router.patch(
  "/orders/doc/delivered/:id",
  isDel,
  markOrderDeliveredDocController
);
router.patch(
  "/orders/lab/delivered/:id",
  isDel,
  markOrderDeliveredLabController
);
router.get("/financial", isDel, getProfitsController);

module.exports = router;
