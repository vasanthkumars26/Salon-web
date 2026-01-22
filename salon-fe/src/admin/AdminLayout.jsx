import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BOOKINGS = "https://salon-server-gurw.onrender.com/api/bookings";
const API_ORDERS = "https://salon-server-gurw.onrender.com/api/orders";
const API_ENQUIRIES = "https://salon-server-gurw.onrender.com/api/enquiries";

const AdminLayout = () => {
  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* 🔹 Fetch pending bookings */
  const fetchBookings = async () => {
    try {
      const res = await axios.get(API_BOOKINGS);
      const pending = res.data.filter((b) => b.status === "Pending");
      setBookings(pending);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  /* 🔹 Fetch pending enquiries */
  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(API_ENQUIRIES);
      const pending = res.data.filter((e) => e.status === "New");
      setEnquiries(pending);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    }
  };

  /* 🔹 Fetch orders count */
  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_ORDERS);
      setOrdersCount(res.data.length);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchEnquiries();
    fetchOrders();

    const interval = setInterval(() => {
      fetchBookings();
      fetchEnquiries();
      fetchOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  /* 🔹 Clear notifications */
  const clearNotifications = async () => {
    try {
      // Mark bookings as seen
      await Promise.all(
        bookings.map((b) =>
          axios.put(`${API_BOOKINGS}/${b._id}`, { status: "Seen" })
        )
      );

      // Mark enquiries as seen
      await Promise.all(
        enquiries.map((e) =>
          axios.put(`${API_ENQUIRIES}/${e._id}`, { status: "Contacted" })
        )
      );

      fetchBookings();
      fetchEnquiries();
      setShowDropdown(false);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  const totalNotifications = bookings.length + enquiries.length;

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* 🔹 Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* 🔹 Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          h-full w-64 bg-white shadow p-6
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-4">
          <Link to="/admin" onClick={() => setSidebarOpen(false)}>Dashboard</Link>
          <Link to="/admin/users" onClick={() => setSidebarOpen(false)}>Users</Link>
          <Link to="/admin/services" onClick={() => setSidebarOpen(false)}>Services</Link>

          {/* 🔹 BOOKINGS */}
          <Link
            to="/admin/bookings"
            onClick={() => setSidebarOpen(false)}
            className="flex justify-between items-center"
          >
            Bookings
            {bookings.length > 0 && (
              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                {bookings.length}
              </span>
            )}
          </Link>

          {/* 🔹 ENQUIRIES */}
          <Link
            to="/admin/enquiries"
            onClick={() => setSidebarOpen(false)}
            className="flex justify-between items-center"
          >
            Enquiries
            {enquiries.length > 0 && (
              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                {enquiries.length}
              </span>
            )}
          </Link>

          {/* 🔹 ORDERS */}
          <Link
            to="/api/orders"
            onClick={() => setSidebarOpen(false)}
            className="flex justify-between items-center"
          >
            Orders
            {ordersCount > 0 && (
              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                {ordersCount}
              </span>
            )}
          </Link>

          <Link to="/admin/revenue" onClick={() => setSidebarOpen(false)}>Revenue</Link>
          <Link to="/admin/settings" onClick={() => setSidebarOpen(false)}>Settings</Link>
        </nav>
      </aside>

      {/* 🔹 Main Content */}
      <div className="flex-1 flex flex-col">
        {/* 🔹 Top Bar */}
        <div className="flex items-center justify-between bg-white shadow px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-2xl"
            >
              ☰
            </button>
            <h1 className="text-xl lg:text-3xl font-bold">
              Admin Dashboard
            </h1>
          </div>

          {/* 🔹 Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              🔔
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalNotifications}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50">
                {totalNotifications > 0 ? (
                  <>
                    <div className="flex justify-between items-center p-3 border-b">
                      <span className="font-semibold">Notifications</span>
                      <button
                        onClick={clearNotifications}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {bookings.map((b) => (
                        <div key={b._id} className="p-3 border-b hover:bg-gray-100">
                          <p className="font-semibold">{b.customerName}</p>
                          <p className="text-sm text-gray-600">{b.serviceTitle}</p>
                          <p className="text-xs text-gray-400">{b.date} at {b.time}</p>
                        </div>
                      ))}
                      {enquiries.map((e) => (
                        <div key={e._id} className="p-3 border-b hover:bg-gray-100">
                          <p className="font-semibold">{e.name}</p>
                          <p className="text-sm text-gray-600">{e.type}</p>
                          <p className="text-xs text-gray-400">{e.email}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="p-3 text-gray-500 text-sm">
                    No new notifications
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 🔹 Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
