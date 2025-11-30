const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Teacher = require('./models/Teacher');
const TeacherPosition = require('./models/TeacherPosition');

async function fixData() {
  try {
    console.log('🔌 Đang kết nối MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teacher_management');
    console.log('✅ Đã kết nối MongoDB');

    // Fix teacherpositions
    console.log('\n📝 Đang sửa collection teacherpositions...');
    const result1 = await TeacherPosition.updateMany(
      { isDeleted: true },
      { $set: { isDeleted: false } }
    );
    console.log(`✅ Đã sửa ${result1.modifiedCount} documents trong teacherpositions`);

    // Fix teachers
    console.log('\n📝 Đang sửa collection teachers...');
    const result2 = await Teacher.updateMany(
      { isDeleted: true },
      { $set: { isDeleted: false } }
    );
    console.log(`✅ Đã sửa ${result2.modifiedCount} documents trong teachers`);

    // Fix users
    console.log('\n📝 Đang sửa collection users...');
    const result3 = await User.updateMany(
      { isDeleted: true },
      { $set: { isDeleted: false } }
    );
    console.log(`✅ Đã sửa ${result3.modifiedCount} documents trong users`);

    console.log('\n🎉 Hoàn thành! Tất cả dữ liệu đã được sửa.');
    console.log('💡 Bây giờ refresh lại frontend để xem dữ liệu.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

fixData();

