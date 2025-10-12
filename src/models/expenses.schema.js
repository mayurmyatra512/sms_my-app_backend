import mongoose from "mongoose";

const expensesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    title: { type: String, required: true },
    department: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    vendor: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    invoiceNumber: { type: String, required: true },
    paymentDate: { type: Date },
    paymentMethod: { type: String, enum: ["Cash", "Credit Card", "Cheque", "Bank Transfer", "Other"], required: true },
    remarks: { type: String },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedDate: { type: Date }
});

expensesSchema.pre('save', function(next){
     if (this.status === "approved" || this.status === "rejected") {
    if (!this.approvedDate) {
      this.approvedDate = new Date();
    }
    if (!this.approvedBy) {
      return next(new Error("approvedBy is required when status is approved/rejected"));
    }
    if (!this.remark) {
      return next(new Error("remark is required when status is approved/rejected"));
    }
  }
  next();
})

export default expensesSchema;
