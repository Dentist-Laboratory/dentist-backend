var express = require("express");
const {
  loginUserController,
  signupUserController,
} = require("../controllers/userAuthController");
var router = express.Router();

router.post("/login", loginUserController);
router.post("/signup", signupUserController);

module.exports = router;
