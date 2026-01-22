import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";

const API = "https://salon-server-gurw.onrender.com/api/enquiries";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Business Partnership",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  /* 🔹 Handle input change */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* 🔹 Submit enquiry */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await axios.post(API, formData);
      setSuccess("Your enquiry has been submitted successfully.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        type: "Business Partnership",
        message: "",
      });
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-6"
      >
        <div className="bg-white rounded-3xl shadow-xl p-10 md:p-14">
          <h2 className="text-4xl font-bold text-center mb-4">
            Business & Franchise Enquiries
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Connect with us for partnerships, franchises, or corporate bookings
          </p>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="John Doe"
                className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-pink-500 outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="john@example.com"
                className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-pink-500 outline-none"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            {/* Inquiry Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Inquiry Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-pink-500 outline-none"
              >
                <option>Business Partnership</option>
                <option>Franchise Opportunity</option>
                <option>Corporate / Bulk Booking</option>
                <option>General Enquiry</option>
              </select>
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Please describe your requirement..."
                className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-10 bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-full text-lg font-semibold transition disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Enquiry"}
              </button>

              {success && (
                <span className="text-green-600 font-medium">
                  {success}
                </span>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
