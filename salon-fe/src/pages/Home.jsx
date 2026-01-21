import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Phone, MapPin, Clock } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const videoRef = useRef(null);

  /* 🔥 Scroll fade animation */
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 450], [1, 0]);
  const scale = useTransform(scrollY, [0, 450], [1, 1.05]);
  const navigate = useNavigate();

  /* ▶️ Play / Pause on scroll visibility */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        entry.isIntersecting
          ? video.play().catch(() => {})
          : video.pause();
      },
      { threshold: 0.35 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const services = [
    { name: "Haircut & Styling", price: "₹499" },
    { name: "Hair Smoothening", price: "₹2499" },
    { name: "Facial & Cleanup", price: "₹999" },
    { name: "Bridal Makeup", price: "₹7999" },
  ];

  const reviews = [
    { name: "Anjali", rating: 5, comment: "Amazing service! Staff are very professional." },
    { name: "Rahul", rating: 4, comment: "Clean salon and great haircut experience." },
    { name: "Priya", rating: 5, comment: "Best bridal makeup. Highly recommended!" },
  ];

  return (
    <div className="w-full bg-gray-50">

      {/* ================= HERO VIDEO ================= */}
      <section className="relative h-[100vh] overflow-hidden flex items-center justify-center">

        <motion.video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=1920"
          style={{ opacity, scale }}
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* WebM first */}
          <source
            src="https://videos.pexels.com/video-files/853989/853989-hd_1920_1080_25fps.webm"
            type="video/webm"
          />
          {/* MP4 fallback */}
          <source
            src="https://www.pexels.com/download/video/5450148/"
            
          />
        </motion.video>

        <motion.div
          style={{ opacity }}
          className="absolute inset-0 bg-black/60"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-center text-white px-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wide">
            Luxury Unisex Salon
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Redefining Style. Redefining You.
          </p>
          <button onClick={()=>navigate("/services")} className="bg-pink-600 hover:bg-pink-700 px-10 py-4 rounded-full text-lg font-semibold">
            Book Appointment
          </button>
        </motion.div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="max-w-7xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.img
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200"
          className="rounded-2xl shadow-lg"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
        />
        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-bold mb-4">About Our Salon</h2>
          <p className="text-gray-600 mb-4">
            Premium grooming and beauty services with certified professionals,
            luxury products, and modern techniques.
          </p>
          <p className="text-gray-600">
            Hair styling, skincare, bridal makeup & personalized consultations.
          </p>
        </motion.div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Signature Services</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {services.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 rounded-2xl p-8 shadow-md text-center"
              >
                <h3 className="text-xl font-semibold">{s.name}</h3>
                <p className="text-pink-600 font-bold text-lg">{s.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LOOKBOOK ================= */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Our Lookbook</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e",
              "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
              "https://images.unsplash.com/photo-1600948836101-f9ffda59d250",
              "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3",
              "https://images.unsplash.com/photo-1595475038784-bbe439ff41e6",
              "https://images.unsplash.com/photo-1519415943484-9fa1873496d4",
            ].map((img, i) => (
              <motion.img
                key={i}
                whileHover={{ scale: 1.05 }}
                src={img + "?q=80&w=900"}
                className="h-80 w-full object-cover rounded-2xl shadow-lg"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Loved by Our Clients</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((r, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="bg-white p-8 rounded-2xl shadow-md">
                <h4 className="font-semibold mb-2">{r.name}</h4>
                <div className="flex mb-3">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-600 italic">“{r.comment}”</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
     
    </div>
  );
}
