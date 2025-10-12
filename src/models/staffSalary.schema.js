import mongoose from "mongoose";

const staffSalarySchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }, // teacher or other staff
  // month: { type: Number, min: 1, max: 12 }, // 1 = Jan, 12 = Dec
  // year: { type: Number },
  
  basicSalary: { type: Number, default:0 },
  allowances: { type: Number, default: 0 }, // e.g., HRA, Transport
  deductions: { type: Number, default: 0 }, // e.g., tax, PF
  netSalary: { type: Number, default: 0 },

  paymentDate: { type: Date },
  paidAmount: {type: Number,default: 0},
  pendingAmount:{type: Number,default: 0},
  paymentMethod: { type: String, enum: ["cash", "bank transfer", "cheque","upi payment"], default: "bank transfer" },
  status: { type: String, enum: ["paid", "pending"], default: "pending" },

  remarks: { type: String }
});

export default staffSalarySchema;