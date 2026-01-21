// src/pages/Cart.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const { cart, removeFromCart, updateQty } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Cart ({cart.length})</h2>

      {cart.length === 0 && (
        <p className="text-gray-500 text-lg">Your cart is empty!</p>
      )}

      <AnimatePresence>
        {cart.map((item) => (
          <motion.div
            key={item._id}
            layout
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex gap-4 bg-white p-4 rounded-xl shadow mb-4 items-center"
          >
            <img
              src={item.image}
              className="w-28 h-28 object-cover rounded"
              alt={item.name}
            />

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-pink-600 font-bold text-lg">₹{item.price}</p>

              <div className="flex gap-3 mt-2 items-center">
                <button
                  onClick={() => updateQty(item._id, item.qty - 1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  −
                </button>

                <motion.span
                  key={item.qty}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="font-semibold text-lg"
                >
                  {item.qty}
                </motion.span>

                <button
                  onClick={() => updateQty(item._id, item.qty + 1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 mt-2 hover:underline"
              >
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {cart.length > 0 && (
        <>
          <h3 className="text-xl font-bold mt-6">Total: ₹{total}</h3>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-4 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
