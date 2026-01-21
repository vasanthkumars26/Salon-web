const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      uid: String,
      name: String,
      email: String,
      phone: String,
      address: String,
    },

    items: [
      {
        productId: String,
        name: String,
        image: String,
        price: Number,
        qty: Number,
      },
    ],

    totalAmount: Number,
    status: {
      type: String,
      default: "Placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
