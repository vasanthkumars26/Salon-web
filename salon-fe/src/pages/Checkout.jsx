import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {auth} from "../config/firebase";
import jsPDF from "jspdf";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // User inputs
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Order state
  const [success, setSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) navigate("/login");
      else setUser(currentUser);
    });

    return () => unsub();
  }, [navigate]);

  // Place order
  const placeOrder = async () => {
    const orderData = {
      user: {
        uid: user.uid,
        email: user.email,
        name,
        phone,
        address,
      },
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
      })),
      totalAmount: total,
    };

    const res = await fetch("https://salon-server-gurw.onrender.com/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (res.ok) {
      setPlacedOrder({
        ...orderData,
        date: new Date().toLocaleString(),
      });
      setSuccess(true);
      clearCart();
    }
  };

  // Invoice PDF
  const downloadInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Order Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${placedOrder.user.name}`, 14, 32);
    doc.text(`Email: ${placedOrder.user.email}`, 14, 40);
    doc.text(`Phone: ${placedOrder.user.phone}`, 14, 48);
    doc.text(`Address: ${placedOrder.user.address}`, 14, 56);
    doc.text(`Date: ${placedOrder.date}`, 14, 64);

    let y = 78;
    doc.text("Items:", 14, y);
    y += 8;

    placedOrder.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} x ${item.qty} - ₹${item.price * item.qty}`,
        14,
        y
      );
      y += 7;
    });

    y += 6;
    doc.text(`Total Amount: ₹${placedOrder.totalAmount}`, 14, y);

    doc.save("order-invoice.pdf");
  };

  // Success Screen
  if (success && placedOrder) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-green-600 mb-4 text-center">
          🎉 Order Placed Successfully
        </h1>

        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="font-semibold mb-2">Delivery Details</h3>
          <p><b>Name:</b> {placedOrder.user.name}</p>
          <p><b>Email:</b> {placedOrder.user.email}</p>
          <p><b>Phone:</b> {placedOrder.user.phone}</p>
          <p><b>Address:</b> {placedOrder.user.address}</p>
          <p className="text-sm text-gray-500 mt-2">
            Ordered on: {placedOrder.date}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="font-semibold mb-3">Ordered Items</h3>

          {placedOrder.items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between mb-2 text-sm"
            >
              <span>{item.name} × {item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <hr className="my-2" />
          <p className="font-bold text-right">
            Total: ₹{placedOrder.totalAmount}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadInvoice}
            className="flex-1 bg-blue-600 text-white py-3 rounded"
          >
            Download Invoice 📄
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-black text-white py-3 rounded"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Checkout Form
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Checkout</h2>

      <div className="bg-white p-4 rounded shadow mb-4">
        <p className="text-sm text-gray-500 mb-2">
          Logged in as: {user?.email}
        </p>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border p-2 mb-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <textarea
          placeholder="Delivery Address"
          className="w-full border p-2"
          rows="3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <h3 className="text-xl font-bold mb-3">Order Summary</h3>

      {cart.map((item) => (
        <div key={item._id} className="flex justify-between mb-2">
          <span>{item.name} × {item.qty}</span>
          <span>₹{item.price * item.qty}</span>
        </div>
      ))}

      <h3 className="text-xl font-bold mt-4">
        Total: ₹{total}
      </h3>

      <button
        onClick={placeOrder}
        disabled={!name || !phone || !address}
        className="mt-5 bg-black text-white px-6 py-3 rounded w-full disabled:opacity-50"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
