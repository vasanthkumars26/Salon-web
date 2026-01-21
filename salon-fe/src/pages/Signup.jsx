import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {auth} from "../config/firebase";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  // 🔐 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleUser = async (e) => {
    e.preventDefault();
    setErr("");

    if (pass !== cpass) {
      setErr("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      console.log("User registered:", { name, email });
      navigate("/");
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4 m-5">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT IMAGE */}
        <div className="hidden md:block relative">
          <img
            src="https://images.pexels.com/photos/6188366/pexels-photo-6188366.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            alt="Salon Makeup"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end p-8">
            <h2 className="text-white text-3xl font-bold leading-snug">
              Begin Your <br /> Beauty Journey 
            </h2>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="p-8 md:p-12 flex items-center">
          <form onSubmit={handleUser} className="w-full space-y-5">
            <h2 className="text-3xl font-bold text-gray-800">
              Create Account ✨
            </h2>
            <p className="text-gray-500">
              Join GlowUp Salon today
            </p>

            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
            />

            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={cpass}
              onChange={(e) => setCpass(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
            />

            {err && (
              <p className="text-red-500 text-sm font-medium">
                {err}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full font-semibold transition"
            >
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?
              <Link
                to="/"
                className="text-pink-500 font-semibold ml-2 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Signup;
