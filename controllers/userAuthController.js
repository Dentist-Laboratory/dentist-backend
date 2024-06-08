const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { genUID } = require("../utils/genUID");
async function signupUserController(req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json("Email Address Already Exist");
    }
    user = new User({
      UID: await genUID(User),
      username: req.body.username,
      phone: req.body.phone,
      email: req.body.email,
      buildNo: req.body.buildNo,
      floorNo: req.body.floorNo,
      address: req.body.address,
      password: bcrypt.hashSync(req.body.password, 10),
      role: req.body.role,
      subscription: req.body.role === "LAB" ? new Date() : null,
    });
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const userWithoutPassword = { ...user };
    delete userWithoutPassword._doc.password;
    return res
      .status(201)
      .json({ user: userWithoutPassword._doc, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}
async function protect(req, res, next) {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
}
async function loginUserController(req, res) {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json("Please Enter Valid Credentials");
    }
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json("User Not Found");
    }
    const valid = bcrypt.compareSync(req.body.password, user.password);
    if (!valid) {
      return res.status(401).json("Wrong Username Or Password");
    }
    var currentDate = new Date();
    if (user.role == "LAB" && currentDate > user.subscription) {
      return res.status(403).json("Subscription Expired");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const userWithoutPassword = { ...user };
    delete userWithoutPassword._doc.password;
    return res
      .status(200)
      .json({ user: userWithoutPassword._doc, token: token });
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

module.exports = { signupUserController, loginUserController, protect };
