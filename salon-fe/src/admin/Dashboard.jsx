import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API = "http://localhost:4000/api/bookings";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(API);
      setBookings(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- CALCULATIONS ----------
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === "Pending").length;

  const activeServices = [
    ...new Set(bookings.map(b => b.serviceTitle)),
  ].length;

  const monthRevenue = bookings
    .filter(
      b =>
        b.status === "Completed" &&
        new Date(b.date).getMonth() === new Date().getMonth()
    )
    .reduce((sum, b) => sum + (b.servicePrice || 0), 0);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading)
    return <p className="text-center mt-10">Loading dashboard...</p>;

  const stats = [
    { title: "Total Bookings", value: totalBookings, sub: "All time" },
    { title: "Pending Bookings", value: pendingBookings, sub: "Awaiting action" },
    { title: "Active Services", value: activeServices, sub: "Currently booked" },
    {
      title: "Revenue",
      value: `₹${monthRevenue.toLocaleString("en-IN")}`,
      sub: "This month",
    },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow border"
          >
            <p className="text-gray-500 text-sm">{s.title}</p>
            <h2 className="text-3xl font-bold mt-2">{s.value}</h2>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* RECENT BOOKINGS */}
      <div className="bg-white rounded-xl shadow border">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
          <span className="text-sm text-gray-500">Live updates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr
                  key={b._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">{b.customerName}</td>
                  <td>{b.serviceTitle}</td>
                  <td>{b.date}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        b.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}

              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-400">
                    No bookings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
