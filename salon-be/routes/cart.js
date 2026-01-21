const express = require("express");
const Cart = require("../models/Cart");

const router = express.Router();

/* GET CART */
router.get("/", async (req, res) => {
  const cart = await Cart.find();
  res.json(cart);
});

/* ADD TO CART */
router.post("/", async (req, res) => {
  try {
    const { productId, name, price, image } = req.body;

    let item = await Cart.findOne({ productId });

    if (item) {
      item.qty += 1;
      await item.save();
      return res.json(item);
    }

    const newItem = await Cart.create({
      productId,
      name,
      price,
      image,
      qty: 1,
    });

    res.status(201).json(newItem);

  } catch (err) {
    console.error("Cart Error:", err);
    res.status(500).json({ error: "Cart operation failed" });
  }
});


/* UPDATE QTY */
router.put("/:id", async (req, res) => {
  const item = await Cart.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(item);
});

/* DELETE ITEM */
router.delete("/:id", async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json({ message: "Item removed" });
});

module.exports = router;
