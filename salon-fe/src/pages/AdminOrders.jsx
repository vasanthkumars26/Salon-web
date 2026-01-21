import { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      {orders.map((o, i) => (
        <div key={i} className="border p-4 mb-4">
          <p>Total: ₹{o.total}</p>
          <p>Date: {new Date(o.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
