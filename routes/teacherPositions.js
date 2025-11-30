const express = require('express');
const router = express.Router();
const TeacherPosition = require('../models/TeacherPosition');

// GET /teacher-positions - Get all teacher positions
router.get('/', async (req, res) => {
  try {
    const positions = await TeacherPosition.find({ isDeleted: false })
      .sort({ createdAt: -1 });

    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /teacher-positions - Create new teacher position
router.post('/', async (req, res) => {
  try {
    const { name, code, des, isActive } = req.body;

    // Check if code already exists
    const existing = await TeacherPosition.findOne({ code, isDeleted: false });
    if (existing) {
      return res.status(400).json({ error: 'Mã vị trí đã tồn tại' });
    }

    const position = new TeacherPosition({
      name,
      code,
      des: des || '',
      isActive: isActive !== undefined ? isActive : true,
      isDeleted: false
    });

    const savedPosition = await position.save();
    res.status(201).json(savedPosition);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Mã vị trí đã tồn tại' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

