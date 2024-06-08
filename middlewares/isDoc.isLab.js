const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");

async function UserPrivileges(req, res, next) {
  try {
    if (!req.header("Authorization")) {
      return res.status(401).json("authorization header not found");
    }
    const key = req.header("Authorization").split(" ")[0];
    const token = req.header("Authorization").split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json("user not found");
    }
    if (user.role !== "DOC" && user.role !== "LAB") {
      return res.status(401).json("user shouldbe a DOC or a LAB");
    }
    req.userId = decoded._id;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = UserPrivileges;
