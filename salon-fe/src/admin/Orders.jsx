import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaDoorClosed } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const API = "https://salon-server-gurw.onrender.com/api/orders";
const BASE_URL = "https://salon-server-gurw.onrender.com";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState({ from: "", to: "" });
  const [expandedOrders, setExpandedOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert("Access denied or failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, currentStatus) => {
    const nextStatus =
      currentStatus === "Pending" ? "Processing" : "Delivered";

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/${orderId}`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    }
  };

  // 🔍 Filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      order._id?.includes(search);
    const orderDate = order.date ? new Date(order.date) : null;
    const fromDate = filterDate.from ? new Date(filterDate.from) : null;
    const toDate = filterDate.to ? new Date(filterDate.to) : null;
    const matchesDate =
      (!fromDate || (orderDate && orderDate >= fromDate)) &&
      (!toDate || (orderDate && orderDate <= toDate));
    return matchesSearch && matchesDate;
  });

  // ✅ Dashboard metrics
  const totalOrders = filteredOrders.length;
  const pendingOrders = filteredOrders.filter(o => o.status === "Pending").length;
  const deliveredOrders = filteredOrders.filter(o => o.status === "Delivered").length;

  if (loading)
    return <p className="text-center mt-10">Loading orders...</p>;
  if (!orders.length)
    return <p className="text-center mt-10">No orders found.</p>;

  
  const handleback = ()=>{
    navigate("/admin");
  }

  return (
    
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-6 text-sm ">
        <h1 onClick={handleback} className="bg-slate-300  hover:text-blue-500 cursor-pointer hover:underline w-fit px-3 rounded-xl py-1 flex items-center"><FaDoorClosed/> BACK</h1>
      </div>
      <h1 className="text-2xl lg:text-3xl font-bold mb-4">All Orders</h1>

      {/* 🟢 Dashboard Metric Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-600 text-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
          <p className="text-sm uppercase">Total Orders</p>
          <p className="text-xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
          <p className="text-sm uppercase">Pending Orders</p>
          <p className="text-xl font-bold">{pendingOrders}</p>
        </div>
        <div className="bg-blue-500 text-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
          <p className="text-sm uppercase">Delivered Orders</p>
          <p className="text-xl font-bold">{deliveredOrders}</p>
        </div>
      </div>

      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by customer or Order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="date"
            value={filterDate.from}
            onChange={(e) =>
              setFilterDate({ ...filterDate, from: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={filterDate.to}
            onChange={(e) =>
              setFilterDate({ ...filterDate, to: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => {
          const totalPrice = (order.items || []).reduce(
            (sum, item) =>
              sum + Number(item.price || 0) * Number(item.quantity || 1),
            0
          );

          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow rounded-xl p-4 lg:p-6"
            >
              {/* 🔹 Order Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 border-b pb-3">
                <div>
                  <p className="font-semibold">
                    Order ID: <span className="text-gray-500">{order._id}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.customerName} • {order.phone}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      order.status === "Pending"
                        ? "bg-yellow-500"
                        : order.status === "Processing"
                        ? "bg-blue-500"
                        : "bg-green-600"
                    }`}
                  >
                    {order.status}
                  </span>

                  <p className="font-bold text-lg">₹{totalPrice}</p>

                  {/* 🔄 Update Status */}
                  {order.status !== "Delivered" && (
                    <button
                      onClick={() => updateStatus(order._id, order.status)}
                      className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
                    >
                      {order.status === "Pending"
                        ? "Start Processing"
                        : "Mark Delivered"}
                    </button>
                  )}

                  {/* 📦 Expand/Collapse */}
                  <button
                    onClick={() => {
                      setExpandedOrders((prev) =>
                        prev.includes(order._id)
                          ? prev.filter((id) => id !== order._id)
                          : [...prev, order._id]
                      );
                    }}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                  >
                    {expandedOrders.includes(order._id)
                      ? "Hide Items"
                      : "Show Items"}
                  </button>
                </div>
              </div>

              {/* 🔹 Products List */}
              <AnimatePresence>
                {expandedOrders.includes(order._id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 space-y-2 overflow-hidden"
                  >
                    {(order.items || []).map((item, idx) => {
                      const imageUrl =
                        item.image?.startsWith("http")
                          ? item.image
                          : `${BASE_URL}${item.image}`;
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-4 border rounded-lg p-3"
                        >
                          <img
                            src={imageUrl || "/no-image.png"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity || 1}
                            </p>
                          </div>
                          <p className="font-semibold">
                            ₹{Number(item.price || 0) * Number(item.quantity || 1)}
                          </p>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 🔹 Footer */}
              <div className="text-sm font-semibold mt-3">
                Total: ₹{totalPrice}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Ordered on{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "—"}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrders;
