const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productId: {
    type: String,   
    required: true
  },
  name: String,
  price: Number,
  image: String,
  qty: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model("Cart", cartSchema);
