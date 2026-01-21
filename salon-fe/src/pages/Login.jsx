import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../config/firebase";

const Login = () => {
  const location = useLocation();
  const passedname = location.state?.name || "";
  const navigate = useNavigate();

  const [name, setName] = useState(passedname);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    auth.onAuthStateChanged((user) => {
      if (user) navigate("/home");
    });
  }, [navigate]);

  const handlelogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, pass)
      .then(() => navigate("/home"))
      .catch(() => setErr("Invalid email or password"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT IMAGE */}
        <div className="hidden md:block relative">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e"
            alt="Salon Hairstyling"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end p-8">
            <h2 className="text-white text-3xl font-bold leading-snug">
              Your Beauty, <br /> Our Passion 
            </h2>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="p-8 md:p-12 flex items-center">
          <form onSubmit={handlelogin} className="w-full space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome Back 💇‍♀️
            </h2>
            <p className="text-gray-500">
              Login to continue your salon experience
            </p>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Your name"
                required
                className="w-full rounded-xl p-3 border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="your@email.com"
                required
                className="w-full rounded-xl p-3 border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                type="password"
                placeholder="••••••••"
                required
                className="w-full rounded-xl p-3 border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>

            {err && (
              <p className="text-red-500 text-sm font-medium">{err}</p>
            )}

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full font-semibold transition"
            >
              Login
            </button>

            <p className="text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-pink-500 font-semibold hover:underline"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
