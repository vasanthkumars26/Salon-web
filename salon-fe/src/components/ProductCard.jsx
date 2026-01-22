import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const ProductCard = ({ product, isAdmin, onEdit, onDelete }) => {
  const { cart, addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  const isInCart = cart.some(item => item._id === product._id);

  const handleAddToCart = () => {
    addToCart(product);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
      {/* IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-56 object-contain"
      />

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600 font-medium">₹{product.price}</p>

        {/* ACTIONS */}
        {!isAdmin && (
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`mt-4 w-full py-2 rounded transition ${
              isInCart
                ? "bg-green-500 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {isInCart ? "Added" : "Add to Cart"}
          </button>
        )}

        {/* ADMIN ACTIONS */}
        {isAdmin && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 bg-blue-500 text-white py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="flex-1 bg-red-500 text-white py-2 rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* 🔔 TOAST NOTIFICATION */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm shadow-lg"
        >
          ✅ Added to cart
        </motion.div>
      )}
    </div>
  );
};

export default ProductCard;
