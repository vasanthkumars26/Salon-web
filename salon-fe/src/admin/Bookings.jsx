import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

const API = "https://salon-server-gurw.onrender.com/api/bookings";
const SOCKET_URL = "https://salon-server-gurw.onrender.com";

const socket = io(SOCKET_URL);

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔎 Filters
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔹 Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initial fetch + WebSocket
  useEffect(() => {
    fetchBookings();

    socket.on("booking-updated", () => fetchBookings());
    socket.on("booking-created", () => fetchBookings());

    return () => {
      socket.off("booking-updated");
      socket.off("booking-created");
    };
  }, []);

  // 🔹 Update status with optimistic UI
  const updateStatus = async (id, newStatus) => {
    // Optimistic UI
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
    );

    try {
      await axios.put(`${API}/${id}`, { status: newStatus });
    } catch (err) {
      console.error("Update failed:", err);
      fetchBookings(); // revert on failure
    }
  };

  // 🔹 Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.customerName.toLowerCase().includes(search.toLowerCase()) ||
        b.phone.includes(search) ||
        b.serviceTitle.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusTab === "All" ? true : b.status === statusTab;

      const bookingDate = new Date(b.date);
      const isAfterFrom = fromDate ? bookingDate >= new Date(fromDate) : true;
      const isBeforeTo = toDate ? bookingDate <= new Date(toDate) : true;

      return matchesSearch && matchesStatus && isAfterFrom && isBeforeTo;
    });
  }, [bookings, search, statusTab, fromDate, toDate]);

  // 🔹 Animated Dashboard metrics
  const metrics = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "Pending").length;
    const completed = bookings.filter((b) => b.status === "Completed").length;
    return { total, pending, completed };
  }, [bookings]);

  if (loading) return <p className="text-center mt-10">Loading bookings...</p>;

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Bookings</h1>

      {/* 🟢 DASHBOARD METRICS WITH ANIMATION */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {[
          { label: "Total Bookings", value: metrics.total, bg: "bg-green-600" },
          { label: "Pending", value: metrics.pending, bg: "bg-yellow-500" },
          { label: "Completed", value: metrics.completed, bg: "bg-blue-600" },
        ].map((metric) => (
          <motion.div
            key={metric.label}
            className={`${metric.bg} text-white p-4 rounded-lg flex-1 text-center shadow`}
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <p className="text-sm font-medium">{metric.label}</p>
            <motion.p
              key={metric.value} // animates on value change
              className="text-xl font-bold"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {metric.value}
            </motion.p>
          </motion.div>
        ))}
      </div>

      {/* 🔍 SEARCH + DATE FILTER */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search name / phone / service"
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {/* 📊 STATUS TABS */}
      <div className="flex gap-3 mb-6">
        {["All", "Pending", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              statusTab === tab ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 📱 MOBILE */}
      <div className="lg:hidden space-y-4">
        <AnimatePresence>
          {filteredBookings.map((b) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white shadow rounded-lg p-4"
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{b.serviceTitle}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded text-white ${
                    b.status === "Pending" ? "bg-yellow-500" : "bg-green-500"
                  }`}
                >
                  {b.status}
                </span>
              </div>
              <p className="text-sm">Name: {b.customerName}</p>
              <p className="text-sm">Phone: {b.phone}</p>
              <p className="text-sm">Date: {b.date}</p>
              <p className="text-sm">Time: {b.time}</p>
              {b.status !== "Completed" && (
                <button
                  onClick={() => updateStatus(b._id, "Completed")}
                  className="w-full mt-3 bg-green-600 text-white py-2 rounded"
                >
                  Mark Completed
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 🖥 DESKTOP TABLE */}
      <div className="hidden lg:block bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Service</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredBookings.map((b) => (
                <motion.tr
                  key={b._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-t"
                >
                  <td className="p-4">{b.serviceTitle}</td>
                  <td>{b.customerName}</td>
                  <td>{b.phone}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        b.status === "Pending" ? "bg-yellow-500" : "bg-green-500"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status !== "Completed" && (
                      <button
                        onClick={() => updateStatus(b._id, "Completed")}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
