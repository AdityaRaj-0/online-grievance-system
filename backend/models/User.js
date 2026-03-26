const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'department_admin', 'college_admin', 'university_admin', 'main_admin'],
      default: 'student',
    },
    // Student specific fields
    studentId: { type: String, trim: true },
    phone: { type: String, trim: true },
    college: { type: String, trim: true },
    university: { type: String, trim: true },
    department: { type: String, trim: true },
    year: { type: String, trim: true },
    // Admin specific fields
    adminDepartment: { type: String, trim: true },
    adminCollege: { type: String, trim: true },
    adminUniversity: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    profilePic: { type: String, default: null },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
