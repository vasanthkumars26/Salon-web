import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const SERVICES_API = "http://localhost:4000/api/services";
const BOOKINGS_API = "http://localhost:4000/api/bookings";
const BASE_URL = "http://localhost:4000";

/* 🔹 Page animation */
const pageTransition = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* 🔹 Card scroll animation */
const cardAnimation = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

/* 🔹 Modal animation */
const modalVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
};

/* 🔹 Skeleton Loader */
const SkeletonCard = () => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden animate-pulse">
    <div className="h-56 bg-gray-300" />
    <div className="p-6 space-y-3">
      <div className="h-5 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-5 bg-gray-300 rounded w-1/4" />
      <div className="h-10 bg-gray-400 rounded mt-4" />
    </div>
  </div>
);

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
  });

  /* 🔹 Fetch services */
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(SERVICES_API);
        setServices(res.data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  /* 🔹 Image fix */
  const getImageUrl = (image) => {
    if (!image) return "/no-image.png";
    if (image.startsWith("http")) return image;
    return `${BASE_URL}${image}`;
  };

  /* 🔹 Booking */
  const openBooking = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const closeBooking = () => {
    setShowModal(false);
    setSelectedService(null);
    setForm({ name: "", phone: "", date: "", time: "" });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedService) return;

    try {
      await axios.post(BOOKINGS_API, {
        serviceTitle: selectedService.name,
        price: selectedService.price,
        customerName: form.name,
        phone: form.phone,
        date: form.date,
        time: form.time,
        status: "Pending",
      });

      closeBooking();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. Try again.");
    }
  };

  return (
    <motion.section
      {...pageTransition}
      className="py-20 px-6 max-w-7xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-4 text-center">Our Services</h1>
      <p className="text-gray-600 text-center mb-12">
        Book your desired service instantly
      </p>

      {/* 🔹 SERVICES GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

        {!loading &&
          services.map((service, index) => (
            <motion.div
              key={service._id}
              variants={cardAnimation}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition"
            >
              <div className="h-56 bg-gray-100">
                <img
                  src={getImageUrl(service.image)}
                  alt={service.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => (e.target.src = "/no-image.png")}
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold">{service.name}</h3>
                <p className="text-gray-600 text-sm mt-2">
                  {service.description}
                </p>
                <p className="font-bold mt-3">₹{service.price}</p>

                <button
                  onClick={() => openBooking(service)}
                  className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
      </div>

      {/* 🔹 BOOKING MODAL */}
      <AnimatePresence>
        {showModal && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              variants={modalVariant}
              initial="hidden"
              animate="show"
              className="bg-white p-6 rounded-lg w-full max-w-md relative"
            >
              <button
                onClick={closeBooking}
                className="absolute top-2 right-3 text-xl"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-4">
                Book {selectedService.name}
              </h2>

              <form className="space-y-4" onSubmit={handleBooking}>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full border p-2 rounded"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="w-full border p-2 rounded"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
                <input
                  type="date"
                  required
                  className="w-full border p-2 rounded"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />
                <select
                  required
                  className="w-full border p-2 rounded"
                  value={form.time}
                  onChange={(e) =>
                    setForm({ ...form, time: e.target.value })
                  }
                >
                  <option value="">Select Time</option>
                  <option>10:00 AM</option>
                  <option>12:00 PM</option>
                  <option>2:00 PM</option>
                  <option>4:00 PM</option>
                  <option>6:00 PM</option>
                </select>

                <button className="w-full bg-black text-white py-2 rounded">
                  Confirm Booking
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 SUCCESS TOAST */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded shadow"
          >
            Appointment booked successfully 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Services;
