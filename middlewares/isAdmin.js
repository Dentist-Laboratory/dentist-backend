const jwt = require("jsonwebtoken");

async function AdminPrivileges(req, res, next) {
  try {
    if (!req.header("Authorization")) {
      return res.status(401).json("FORBIDDEN");
    }
    const key = req.header("Authorization").split(" ")[0];
    const token = req.header("Authorization").split(" ")[1];
    if (key !== process.env.JWT_KEYWORD_ADMIN) {
      return res.status(401).json("FORBIDDEN");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    const username = decoded.username;
    if (username !== process.env.ADMIN_USER) {
      return res.status(401).json("FORBIDDEN");
    }
    next();
  } catch (error) {
    return res.status(401).json("FORBIDDEN");
  }
}

module.exports = AdminPrivileges;
