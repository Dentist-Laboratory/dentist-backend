const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
async function adminLoginController(req, res) {
  try {
    const username = req.body.username;
    if (username !== process.env.ADMIN_USER) {
      return res.status(404).json("Wrong Username");
    }
    // const valid = bcrypt.compareSync(req.body.password, process.env.ADMIN_PASS);
    if (req.body.password !== process.env.ADMIN_PASS) {
      return res.status(404).json("Wrong Username Or Password");
    }
    const token = jwt.sign(
      { username: username },
      process.env.JWT_SECRET_ADMIN
    );
    return res.status(200).json({ username: username, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function hireDeliveryController(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User Not Found");
    }
    if (user.role !== "NOM") {
      return res.status(400).json("Can't Set This User To Be Delivery");
    }
    if (user.role == "DEL") {
      return res.status(400).json("User Already Delivery");
    }
    user.role = "DEL";
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getNormalAccounts(req, res) {
  try {
    const users = await User.find({ role: "NOM" });
    if (!users) {
      return res.status(404).json("No Normal Users Available");
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getAllAccounts(req, res) {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json("No Normal Users Available");
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function renewLabSubscriptionController(req, res) {
  try {
    const lab = await User.findById(req.params.id);
    if (!lab) {
      return res.status(404).json("Lab Not Found");
    }
    if (lab.role !== "LAB") {
      return res.status(400).json("User is not a Lab");
    }
    var subDate = new Date(lab.subscription);
    subDate.setMonth(subDate.getMonth() + 1);
    lab.subscription = subDate;
    await lab.save();
    return res.status(200).json(lab);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function cancelLabSubscriptionController(req, res) {
  try {
    const lab = await User.findById(req.params.id);
    if (!lab) {
      return res.status(404).json("Lab Not Found");
    }
    if (lab.role !== "LAB") {
      return res.status(400).json("User is not a Lab");
    }
    var subDate = new Date(lab.subscription);
    subDate.setMonth(subDate.getMonth() - 1);
    lab.subscription = subDate;
    await lab.save();
    return res.status(200).json(lab);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

module.exports = {
  hireDeliveryController,
  getNormalAccounts,
  adminLoginController,
  getAllAccounts,
  renewLabSubscriptionController,
  cancelLabSubscriptionController,
};
