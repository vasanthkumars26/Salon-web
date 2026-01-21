import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { FaShoppingCart, FaBars, FaTimes, FaBell } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import axios from "axios";

const ADMIN_UID = "YuGcmQdwEHd8zeLcsk1Oiq62v9b2";
const API_BOOKINGS = "http://localhost:4000/api/bookings";
const API_ENQUIRIES = "http://localhost:4000/api/enquiries";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const { cart } = useCart();
  const navigate = useNavigate();

  /* 🔐 Auth Listener */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        setIsAdmin(user.uid === ADMIN_UID);
      } else {
        setLoggedIn(false);
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  /* 🔔 Fetch Admin Notifications */
  const fetchNotifications = async () => {
    if (!isAdmin) return;
    try {
      const bookings = await axios.get(API_BOOKINGS);
      const pendingBookings = bookings.data.filter(b => b.status === "Pending");

      const enquiries = await axios.get(API_ENQUIRIES);
      const newEnquiries = enquiries.data.filter(e => e.status === "New");

      setNotifications([...pendingBookings, ...newEnquiries]);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  /* 🛒 Cart Count */
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const logout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-black text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* LOGO */}
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/home")}
        >
          GlowUp Salon
        </h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/home" className="hover:text-pink-400">Home</Link>
          <Link to="/services" className="hover:text-pink-400">Services</Link>
          <Link to="/products" className="hover:text-pink-400">Products</Link>

          {isAdmin && (
            <Link to="/admin" className="hover:text-pink-400 relative flex items-center">
              Admin
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </Link>
          )}

          <Link to="/contact" className="hover:text-pink-400">Contact</Link>

          {/* CART */}
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-xl hover:text-pink-400" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-[10px] rounded-full px-2">
                {cartCount}
              </span>
            )}
          </Link>

          {/* AUTH */}
          {loggedIn ? (
            <button
              onClick={logout}
              className="bg-pink-500 px-4 py-1 rounded-full hover:bg-pink-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/"
              className="bg-pink-500 px-4 py-1 rounded-full hover:bg-pink-600"
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-4 text-center">
          <Link to="/home" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>

          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="relative flex justify-center">
              Admin
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </Link>
          )}

          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            Cart ({cartCount})
          </Link>

          {loggedIn ? (
            <button
              onClick={logout}
              className="bg-pink-500 px-4 py-2 rounded-full"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="bg-pink-500 px-4 py-2 rounded-full"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
