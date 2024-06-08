var express = require("express");
var router = express.Router();
const isAdmin = require("../middlewares/isAdmin");
const {
  adminLoginController,
  getNormalAccounts,
  hireDeliveryController,
  getAllAccounts,
  renewLabSubscriptionController,
  cancelLabSubscriptionController,
} = require("../controllers/adminController");

router.post("/login", adminLoginController);
router.get("/users/normal", isAdmin, getNormalAccounts);
router.get("/users/all", isAdmin, getAllAccounts);
router.put("/delivery/hire/:id", isAdmin, hireDeliveryController);

router.patch(
  "/labs/subscription/renew/:id",
  isAdmin,
  renewLabSubscriptionController
);

router.patch(
  "/labs/subscription/cancel/:id",
  isAdmin,
  cancelLabSubscriptionController
);

module.exports = router;
