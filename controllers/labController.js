const { Order } = require("../models/order.model");
const { User } = require("../models/user.model");

async function addDocController(req, res) {
  try {
    const lab = await User.findById(req.userId);
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("Doctor not found");
    }
    if (!lab) {
      return res.status(404).json("Lab not found");
    }
    if (lab.docsId.includes(req.params.id)) {
      return res.status(400).json("Doctor Already Added");
    }
    lab.docsId.push(req.params.id);
    user.labId = lab._id;
    await lab.save();
    await user.save();
    return res.status(200).json(lab);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getDoctorContractController(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("Doctor not found");
    }
    return res.status(200).json(user.labContract);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function updateDoctorContractController(req, res) {
  try {
    const lab = await User.findById(req.userId);
    if (!lab) {
      return res.status(404).json("Lab not found");
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    user.labContract = req.body.contract;
    await user.save();
    return res.status(200).json(user.labContract);
  } catch (error) {
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

async function markOrderReadyController(req, res) {
  try {
    // Find the order by ID
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json("Order Not Found");
    }

    // Check the order status and update accordingly
    if (order.status !== "UNDERWAY(P)" && order.status !== "UNDERWAY(F)") {
      return res.status(400).json("Can't Set Order To Ready");
    }

    if (order.status === "UNDERWAY(P)") {
      order.status = "LabReady(P)";
    } else if (order.status === "UNDERWAY(F)") {
      order.status = "LabReady(F)";
    }

    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    // Log the error for detailed debugging
    console.error("Error in markOrderReadyController:", error);

    // Return a detailed error response
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: error.message, // Include the error message for debugging
    });
  }
}

async function getAllOrdersController(req, res) {
  try {
    const orders = await Order.find({ lab_id: req.userId })
      .populate("lab_id")
      .populate("doc_id");
    if (!orders[0]) {
      return res.status(404).json("No Orders Available");
    }
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

async function getOrderByIdController(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json("Order Not Found");
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

async function getLabDocsController(req, res) {
  try {
    const docs = await User.findById(req.userId)
      .select("docsId")
      .populate("docsId");
    if (!docs.docsId[0]) {
      return res.status(404).json("No Doctors Available");
    }
    return res.status(200).json(docs.docsId);
  } catch (error) {
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

async function orderPaidController(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json("Order Not Found");
    }
    order.paid = req.body.paid;
    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

async function getProfitsController(req, res) {
  try {
    const { startDate, endDate } = req.query;

    // Convert startDate and endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);


    const orders = await Order.find({
      lab_id: req.userId,
      date: {
        $gte: start,
        $lte: end,
      },
    }).populate("doc_id", "username");

    if (orders.length === 0) {
      return res.status(404).json("No Orders Available");
    }

    const doctorProfits = orders.reduce((acc, order) => {
      const doctorId = order.doc_id._id;

      if (!acc[doctorId]) {
        acc[doctorId] = {
          doctorId: doctorId,
          doctorName: order.doc_id.username,
          totalPrice: 0,
          totalPaid: 0,
          orderCount: 0,
        };
      }

      acc[doctorId].totalPrice += order.price;
      acc[doctorId].totalPaid += order.paid;
      acc[doctorId].orderCount++;

      return acc;
    }, {});

    const profitsArray = Object.values(doctorProfits);

    return res.status(200).json(profitsArray);
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function setPublicDelivery(req, res) {
  try {
    const lab = await User.findById(req.userId);
    if (!lab) {
      return res.status(404).json("Lab not found");
    }
    if (lab.role !== "LAB") {
      return res.status(400).json("User is not lab");
    }
    lab.publicDelivery = req.body.publicDelivery;
    await lab.save();
    return res.status(200).json(lab);
  } catch (error) {
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

async function removeDocFromLabController(req, res) {
  try {
    const lab = await User.findById(req.userId);
    if (!lab) {
      return res.status(404).json("Lab Not Found");
    }
    if (!lab.docsId.includes(req.params.id)) {
      return res.status(404).json("Doctor Not Found in Lab");
    }
    lab.docsId = lab.docsId.filter((doc) => doc.toString() !== req.params.id);
    await lab.save();
    return res.status(200).json(lab);
  } catch (error) {
    return res.status(200).json("INTERNAL SERVER ERROR");
  }
}

module.exports = {
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
};
