const Complaint = require("../models/Complaint");

// ✅ Create Complaint
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    console.log("User from token:", req.user); // debug

    const complaint = await Complaint.create({
      title,
      description,
      category,
      user: req.user.id || req.user._id,
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error(error); // show error in terminal
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get My Complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Complaints (Admin Use Later)
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user", "name email");

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Complaint Status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      message: "Complaint status updated",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};