const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const User = require('../models/User');

// Helper function to generate random 10-digit code
function generateTeacherCode() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// GET /teachers - Get all teachers with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const teachers = await Teacher.find({ isDeleted: false })
      .populate('userId', 'name email phoneNumber address dob identity')
      .populate('teacherPositions', 'name code des')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Teacher.countDocuments({ isDeleted: false });

    // Format response
    const formattedTeachers = teachers.map(teacher => {
      const user = teacher.userId;
      return {
        _id: teacher._id,
        code: teacher.code,
        ten: user.name,
        email: user.email,
        sdt: user.phoneNumber,
        trangThaiHoatDong: teacher.isActive ? 'Đang hoạt động' : 'Không hoạt động',
        diaChi: user.address,
        viTriCongTac: teacher.teacherPositions.map(pos => pos.name).join(', ') || 'Chưa có',
        hocVan: teacher.degrees.map(degree => ({
          trinhDo: degree.type,
          truongTheoHoc: degree.school,
          chuyenNganh: degree.major,
          namTotNghiep: degree.year,
          daTotNghiep: degree.isGraduated
        }))
      };
    });

    res.json({
      teachers: formattedTeachers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /teachers - Create new teacher
router.post('/', async (req, res) => {
  try {
    const { name, email, phoneNumber, address, identity, dob, role, startDate, endDate, teacherPositions, degrees, isActive } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email đã tồn tại trong hệ thống' });
    }

    // Generate unique teacher code
    let code;
    let codeExists = true;
    while (codeExists) {
      code = generateTeacherCode();
      const existing = await Teacher.findOne({ code, isDeleted: false });
      if (!existing) {
        codeExists = false;
      }
    }

    // Create user
    const user = new User({
      name,
      email,
      phoneNumber,
      address,
      identity,
      dob: new Date(dob),
      role: role || 'TEACHER',
      isDeleted: false
    });

    const savedUser = await user.save();

    // Create teacher
    const teacher = new Teacher({
      userId: savedUser._id,
      code,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      teacherPositions: teacherPositions || [],
      degrees: degrees || [],
      isActive: isActive !== undefined ? isActive : true,
      isDeleted: false
    });

    const savedTeacher = await teacher.save();

    // Populate and return
    const result = await Teacher.findById(savedTeacher._id)
      .populate('userId', 'name email phoneNumber address dob identity')
      .populate('teacherPositions', 'name code des');

    res.status(201).json(result);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Mã giáo viên hoặc email đã tồn tại' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

