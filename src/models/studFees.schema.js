import mongoose from "mongoose";

const studentFeesSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    feeModelId: { type: mongoose.Schema.Types.ObjectId, ref: "Fee", model:"Fee" },
    amount: { type: Number },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: function() { return this.amount - this.paidAmount; } },
    paymentDate: { type: Date },
    paymentMethod: { type: String, enum: ['Cash', 'Bank Transfer', 'Cheque', 'Online Payment', 'UPI', 'Card Payment'] },
    receiptNumber: { type: String, unique: true },
    collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

});

export default studentFeesSchema;