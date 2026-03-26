const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema(
  {
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    respondedByName: { type: String },
    respondedByRole: { type: String },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const GrievanceSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: { type: String },
    studentEmail: { type: String },
    studentCollege: { type: String },
    studentDepartment: { type: String },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Academic',
        'Administration',
        'Infrastructure',
        'Faculty',
        'Hostel',
        'Library',
        'Transportation',
        'Financial',
        'Examination',
        'Other',
      ],
    },
    level: {
      type: String,
      enum: ['department', 'college', 'university'],
      required: true,
    },
    targetDepartment: { type: String },
    targetCollege: { type: String },
    targetUniversity: { type: String },
    isAnonymous: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'In Progress', 'Resolved', 'Rejected', 'Closed'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    attachment: {
      filename: String,
      originalName: String,
      path: String,
      mimetype: String,
    },
    responses: [ResponseSchema],
    resolvedAt: { type: Date },
    viewedByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate ticket ID before save
GrievanceSchema.pre('save', async function () {
  if (!this.ticketId) {
    const count = await mongoose.model('Grievance').countDocuments();
    this.ticketId = `SGM-${String(count + 1).padStart(5, '0')}`;
  }
});

module.exports = mongoose.model('Grievance', GrievanceSchema);
