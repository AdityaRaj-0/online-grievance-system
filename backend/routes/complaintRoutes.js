const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");

// Create complaint (User)
router.post("/", protect, createComplaint);

// Get logged-in user's complaints
router.get("/my", protect, getMyComplaints);

// Get all complaints (Admin use later)
router.get("/", protect, getAllComplaints);

// Update complaint status
router.put("/:id", protect, updateComplaintStatus);

module.exports = router;