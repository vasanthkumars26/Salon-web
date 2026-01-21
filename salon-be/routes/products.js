const express = require("express");
const Product = require("../models/Product");
const upload = require("../middlewares/upload");

const router = express.Router();

/* GET PRODUCTS */
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

/* ADD PRODUCT */
router.post("/", upload.single("image"), async (req, res) => {
  const { name, price, imageUrl } = req.body;

  const image = req.file
    ? `http://localhost:4000/uploads/${req.file.filename}`
    : imageUrl;

  const product = new Product({ name, price, image });
  await product.save();

  res.status(201).json(product);
});

/* UPDATE PRODUCT */
router.put("/:id", upload.single("image"), async (req, res) => {
  const { name, price, imageUrl } = req.body;

  const image = req.file
    ? `http://localhost:4000/uploads/${req.file.filename}`
    : imageUrl;

  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { name, price, image },
    { new: true }
  );

  res.json(updated);
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
