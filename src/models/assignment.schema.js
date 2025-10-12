import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },               // Assignment title
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }, // Class reference
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true }, // Section reference
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }, // Subject reference
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }, // Teacher who created it
  totalMarks: { type: Number, default: 100 },           // Total marks
  dueDate: { type: Date, required: true },             // Due date of assignment
  submissions: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      submittedDate: { type: Date },
      grade: { type: Number },
      remarks: { type: String, default: '' },
      status: { type: String, enum: ['pending', 'submitted', 'graded'], default: 'pending' },
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

AssignmentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default AssignmentSchema;