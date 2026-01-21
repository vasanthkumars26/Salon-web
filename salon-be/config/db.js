// backend/config/db.js
const mongoose = require("mongoose");

// Environment variable for cloud Atlas or fallback to local
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/salon_app";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { tls: true });
 // NO options needed in Mongoose v7+
    console.log(
      ` MongoDB connected (${process.env.MONGO_URI ? "Atlas/Cloud" : "Local"})`
    );
  } catch (err) {
    console.error(" MongoDB connection failed", err);
    process.exit(1);
  }
};

module.exports = connectDB;
