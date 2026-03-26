const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Grievance = require('../models/Grievance');
const { protect, isAdmin } = require('../middleware/auth');

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// @route   POST /api/grievances
// @desc    Lodge a new complaint
// @access  Private (students)
router.post('/', protect, upload.single('attachment'), async (req, res) => {
  try {
    const {
      title, description, category, level,
      targetDepartment, targetCollege, targetUniversity, isAnonymous, priority,
    } = req.body;

    const grievanceData = {
      student: req.user._id,
      studentName: isAnonymous === 'true' ? 'Anonymous' : req.user.name,
      studentEmail: isAnonymous === 'true' ? null : req.user.email,
      studentCollege: req.user.college,
      studentDepartment: req.user.department,
      title, description, category, level,
      targetDepartment, targetCollege, targetUniversity,
      isAnonymous: isAnonymous === 'true',
      priority: priority || 'Medium',
    };

    if (req.file) {
      grievanceData.attachment = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
      };
    }

    const grievance = await Grievance.create(grievanceData);

    res.status(201).json({
      success: true,
      message: 'Complaint lodged successfully',
      grievance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/grievances/my
// @desc    Get current student's grievances
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const query = { student: req.user._id };
    if (status) query.status = status;
    if (category) query.category = category;

    const total = await Grievance.countDocuments(query);
    const grievances = await Grievance.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      grievances,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/grievances/admin/all
// @desc    Get all grievances (admin)
// @access  Private (admin)
router.get('/admin/all', protect, isAdmin, async (req, res) => {
  try {
    const { status, category, level, page = 1, limit = 10, search } = req.query;
    const query = {};

    // Filter by admin's jurisdiction
    if (req.user.role === 'department_admin') {
      query.level = 'department';
      query.targetDepartment = req.user.adminDepartment;
    } else if (req.user.role === 'college_admin') {
      query.level = { $in: ['department', 'college'] };
      query.targetCollege = req.user.adminCollege;
    } else if (req.user.role === 'university_admin') {
      query.level = { $in: ['department', 'college', 'university'] };
      query.targetUniversity = req.user.adminUniversity;
    }
    // main_admin sees all

    if (status) query.status = status;
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Grievance.countDocuments(query);
    const grievances = await Grievance.find(query)
      .populate('student', 'name email college department')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Stats
    const stats = await Grievance.aggregate([
      { $match: req.user.role === 'main_admin' ? {} : query },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      grievances,
      stats,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/grievances/:id/status
// @desc    Update grievance status (admin)
// @access  Private (admin)
router.put('/:id/status', protect, isAdmin, async (req, res) => {
  try {
    const {
      status,
      response,
      priority,
      targetDepartment,
      targetCollege,
      targetUniversity,
    } = req.body;
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).json({ success: false, message: 'Grievance not found' });

    if (status) grievance.status = status;
    if (priority) grievance.priority = priority;
    if (targetDepartment !== undefined) grievance.targetDepartment = targetDepartment;
    if (targetCollege !== undefined) grievance.targetCollege = targetCollege;
    if (targetUniversity !== undefined) grievance.targetUniversity = targetUniversity;
    if (status === 'Resolved') grievance.resolvedAt = new Date();
    grievance.viewedByAdmin = true;

    if (response) {
      grievance.responses.push({
        respondedBy: req.user._id,
        respondedByName: req.user.name,
        respondedByRole: req.user.role,
        message: response,
      });
    }

    await grievance.save();
    res.json({ success: true, message: 'Grievance updated', grievance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/grievances/admin/stats
// @desc    Get dashboard statistics
// @access  Private (admin)
router.get('/admin/stats', protect, isAdmin, async (req, res) => {
  try {
    const baseQuery = req.user.role === 'main_admin' ? {} :
      req.user.role === 'department_admin'
        ? { level: 'department', targetDepartment: req.user.adminDepartment }
        : req.user.role === 'college_admin'
        ? { targetCollege: req.user.adminCollege }
        : { targetUniversity: req.user.adminUniversity };

    const [total, pending, resolved, inProgress, byCategory, recent] = await Promise.all([
      Grievance.countDocuments(baseQuery),
      Grievance.countDocuments({ ...baseQuery, status: 'Pending' }),
      Grievance.countDocuments({ ...baseQuery, status: 'Resolved' }),
      Grievance.countDocuments({ ...baseQuery, status: { $in: ['Under Review', 'In Progress'] } }),
      Grievance.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Grievance.find(baseQuery)
        .populate('student', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('ticketId title status createdAt studentName category'),
    ]);

    res.json({
      success: true,
      stats: { total, pending, resolved, inProgress, byCategory, recent },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/grievances/:id
// @desc    Get single grievance
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id).populate('student', 'name email');

    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    if (req.user.role === 'student' && grievance.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, grievance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/grievances/:id
// @desc    Update a grievance (student can update if Pending)
// @access  Private
router.put('/:id', protect, upload.single('attachment'), async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).json({ success: false, message: 'Grievance not found' });

    if (grievance.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (grievance.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Can only edit Pending complaints' });
    }

    const { title, description, category } = req.body;
    if (title) grievance.title = title;
    if (description) grievance.description = description;
    if (category) grievance.category = category;

    if (req.file) {
      grievance.attachment = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
      };
    }

    await grievance.save();
    res.json({ success: true, message: 'Complaint updated', grievance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
