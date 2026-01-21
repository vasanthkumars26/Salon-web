import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* USER PAGES */
import Home from "./pages/Home";
import Services from "./pages/Services";
import Products from "./pages/Products";
import Appointment from "./pages/Appointment";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

/* ADMIN */
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Users from "./admin/Users";
import ServicesAdmin from "./admin/Services";
import Bookings from "./admin/Bookings";
import Revenue from "./admin/Revenue";
import Settings from "./admin/Settings";

/* 🔥 PRESENCE HOOK */
import useUserPresence from "./hooks/useUserPresence";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminOrders from "./admin/Orders";
import AdminEnquiries from "./admin/AdminEnquiries";

function App() {
  /* 🔐 Track logged-in user presence globally */
  useUserPresence();

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* USER PAGES */}
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/enquiries" element={<AdminEnquiries />} />
       <Route path="/api/orders" element={<AdminOrders />} />
        {/* ADMIN DASHBOARD */}
        <Route path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminOrders/>
              </AdminLayout>
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
