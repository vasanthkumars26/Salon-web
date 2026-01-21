const express = require("express");
const router = express.Router();
const Enquiry = require("../models/Enquiry");

/* CREATE enquiry */
router.post("/", async (req, res) => {
  const enquiry = new Enquiry(req.body);
  await enquiry.save();
  res.json({ success: true });
});

/* GET all enquiries (ADMIN) */
router.get("/", async (req, res) => {
  const enquiries = await Enquiry.find().sort({ createdAt: -1 });
  res.json(enquiries);
});

/* UPDATE status */
router.put("/:id", async (req, res) => {
  await Enquiry.findByIdAndUpdate(req.params.id, {
    status: req.body.status,
  });
  res.json({ success: true });
});

module.exports = router;
