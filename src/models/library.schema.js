import mongoose from "mongoose";

// 1. Category Schema
export const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Science", "Math", "History"
  description: { type: String },
}, { timestamps: true });

// 2. Book Schema
export const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  isbn: { type: String, unique: true }, // International Standard Book Number
  publisher: { type: String },
  year: { type: Number },
  copiesAvailable: { type: Number, default: 1 }, // Number of copies available
  totalCopies: { type: Number, default: 1 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
}, { timestamps: true });

// 3. Member Schema (Students / Teachers)
export const MemberSchema = new mongoose.Schema({
role: { type: String, enum: ["student", "teacher"], required: true },

  // dynamic reference (depends on role)
  roleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    refPath: "roleModel"
  },

  // This field tells mongoose which model to look at
  roleModel: { 
    type: String, 
    required: true, 
    enum: ["Student", "Teacher"] 
  },
}, { timestamps: true });

// 4. Borrow Record Schema
export const BorrowRecordSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true }, // usually +7 or +14 days
  returnDate: { type: Date },
  status: { 
    type: String, 
    enum: ["issued", "returned", "overdue", "active"], 
    default: "issued" 
  },
  fine: { type: Number, default: 0 }, // late fee if applicable
}, { timestamps: true });

