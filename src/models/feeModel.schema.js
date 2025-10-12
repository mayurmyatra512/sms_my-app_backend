import mongoose, { model } from "mongoose";

const feeSchema = new mongoose.Schema({
  feeName: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  feeType: { type: String, enum: ['Academic', 'Facility', 'Transport', 'Hostel', 'Sports', 'Library', 'Examination', 'Other'], required: true },
  amount: { type: Number, required: true },
  // balanceAmount: { type: Number, default: function() { return this.amount - this.paidAmount; } },
  studentFees: { type: mongoose.Schema.Types.ObjectId, ref: "StudentFee", model: "StudentFee" },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", model: "Class"},
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["paid", "unpaid", "partial", "overdue", "pending"], default: "unpaid" },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default feeSchema;
