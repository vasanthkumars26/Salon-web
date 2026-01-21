const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const router = express.Router();

/* PLACE ORDER */
router.post("/", async (req, res) => {
  try {
    const { user, items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const order = await Order.create({
      user,
      items,
      total: totalAmount,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});


/* ADMIN – ALL ORDERS */
router.get("/", async (req, res) => {
  res.json(await Order.find().sort({ createdAt: -1 }));
});

// PUT /api/orders/:id
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
