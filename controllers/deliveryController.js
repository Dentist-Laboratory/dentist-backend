const { Order } = require("../models/order.model");
const { User } = require("../models/user.model");

async function getReadyOrders(req, res) {
  try {
    const orders = await Order.find({
      status: ["DocReady(P)", "LabReady(P)"],
    })
      .populate("doc_id")
      .populate("lab_id");
    if (!orders) {
      return res.status(404).json("No Ready Orders");
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getMyOrdersController(req, res) {
  try {
    // Fetch user orders
    const user = await User.findById(req.userId)
      .select("delOrders")
      .populate({
        path: "delOrders",
        populate: { path: "lab_id doc_id" },
      });

    // Check if the user has any orders
    if (!user || !user.delOrders || user.delOrders.length === 0) {
      return res.status(404).json("No Orders Available");
    }

    // Filter out orders with specific statuses
    const filteredOrders = user.delOrders.filter((order) => {
      const status = order.status;
      return ![
        "LabReady(P)",
        "LabReady(F)",
        "DocReady(P)",
        "DocReady(F)",
      ].includes(status);
    });

    // Check if any orders remain after filtering
    if (filteredOrders.length === 0) {
      return res.status(404).json("No Orders Available");
    }

    // Return the filtered orders
    return res.status(200).json(filteredOrders);
  } catch (error) {
    console.error("Error in getMyOrdersController:", error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function markOrderDeliveredLabController(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json("Order Not Found");
    }
    console.log(order.status);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json("User Not Found");
    }
    if (order.status !== "OTW_LAB(P)" && order.status !== "OTW_LAB(F)") {
      return res.status(400).json("Can't Set Order Delivered");
    }
    if (order.status === "OTW_LAB(F)") {
      order.status = "UNDERWAY(F)";
    }
    if (order.status === "OTW_LAB(P)") {
      order.status = "UNDERWAY(P)";
    }
    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function markOrderDeliveredDocController(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json("Order Not Found");
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json("User Not Found");
    }
    if (order.status !== "OTW_DOC(P)" && order.status !== "OTW_DOC(F)") {
      return res.status(400).json("Can't Set Order Delivered");
    }
    if (order.status === "OTW_DOC(F)") {
      order.status = "END(F)";
    }
    if (order.status === "OTW_DOC(P)") {
      order.status = "END(P)";
    }
    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function takeOrderController(req, res) {
  try {
    // Validate req.params.id and req.userId
    if (!req.params.id || !req.userId) {
      return res.status(400).json({ error: "Invalid Order ID or User ID" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order Not Found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    switch (order.status) {
      case "DocReady(P)":
        order.status = "OTW_LAB(P)";
        break;
      case "DocReady(F)":
        order.status = "OTW_LAB(F)";
        break;
      case "LabReady(P)":
        order.status = "OTW_DOC(P)";
        break;
      case "LabReady(F)":
        order.status = "OTW_DOC(F)";
        break;
      default:
        return res.status(400).json({ error: "Invalid Order Status" });
    }

    if (!user.delOrders.includes(order._id)) {
      user.delOrders.push(order._id);
    }

    // Save order and user concurrently
    await Promise.all([order.save(), user.save()]);

    return res.status(200).json(order);
  } catch (error) {
    console.log("Error taking order:", error);
    return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
}

async function getProfitsController(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json("User Not Found");
    }
    let orderQuantity = user.delOrders.length;
    return res.status(200).json({
      orders: orderQuantity,
      totalProfit: orderQuantity * 3.5,
    });
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

module.exports = {
  getReadyOrders,
  markOrderDeliveredDocController,
  markOrderDeliveredLabController,
  takeOrderController,
  getProfitsController,
  getMyOrdersController,
};
