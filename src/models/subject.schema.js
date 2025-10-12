import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
  description: { type: String },
  credits: {type:Number},
  department: { type: String },
  classId: {type: mongoose.Schema.Types.ObjectId, ref: "Class", model:"Class" },
  level: {type: String},
  isActive: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
  // classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" }
});

export default subjectSchema;