const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect, isAdmin } = require('../middleware/auth');

// @route   GET /api/announcements
// @desc    Get all active announcements
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const query = { isActive: true, $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] };
    if (req.user.role === 'student') {
      query.targetAudience = { $in: ['all', 'students'] };
    }

    const announcements = await Announcement.find(query).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/announcements
// @desc    Create announcement
// @access  Private (admin)
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { title, content, targetAudience, expiresAt } = req.body;
    const announcement = await Announcement.create({
      title, content, targetAudience, expiresAt: expiresAt || null,
      postedBy: req.user._id,
      postedByName: req.user.name,
    });
    res.status(201).json({ success: true, message: 'Announcement created', announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Private (admin)
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!announcement) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Private (admin)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
