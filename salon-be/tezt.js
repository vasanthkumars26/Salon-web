const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, { tls: true })
  .then(() => console.log("✅ Connected to Atlas"))
  .catch(err => console.error(err));