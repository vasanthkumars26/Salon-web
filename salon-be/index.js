const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const http = require("http"); // ✅ Needed for Socket.IO
const { Server } = require("socket.io"); // ✅ Socket.IO server

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const bookingsRoute = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/services");

const app = express();

/* 🔹 MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* ✅ SERVE UPLOADS */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* 🔹 DB */
connectDB();

/* 🔹 ROUTES */
app.get("/", (req, res) => {
  res.send("Salon Backend Running 🚀");
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bookings", bookingsRoute);
app.use("/api/services", serviceRoutes);
app.use("/api/enquiries", require("./routes/enquiryRoutes"));


/* 🔹 ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

/* 🔹 HTTP SERVER + SOCKET.IO */
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }, // allow your frontend origin
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Optional: listen for events from client
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Example: emit events from your routes
// In bookingRoutes, after creating/updating a booking:
// io.emit("booking-created", newBooking);
// io.emit("booking-updated", updatedBooking);

server.listen(4000, () => {
  console.log("Server running on port 4000");
});
