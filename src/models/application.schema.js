import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  studentFirstName: { type: String, required: true },
  studentLastName: { type: String, required: true },
  studentFullName: { type: String }, // optional, can be computed
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  grade: { type: String, required: true },
  address: { type: String, required: true },

  parentName: { type: String, required: true },
  parentPhone: { type: String, required: true },
  parentEmail: { type: String },

  previousSchool: { type: String },
  medicalInfo: { type: String },
  additionalNotes: { type: String },

  applicationDate: { type: Date, default: Date.now },
  schoolId:{ type: mongoose.Schema.Types.ObjectId, ref: "School" },
  documents: { type: String, enum: ["Complete", "Incomplete"], default: "Incomplete" },
  status: { type: String, enum: ["pending", "approved", "rejected", "draft"], default: "pending" },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to auto-set studentFullName
applicationSchema.pre("save", function(next) {
  this.studentFullName = `${this.studentFirstName} ${this.studentLastName}`;
  next();
});

// Pre-save hook to compute full name
applicationSchema.pre("save", function (next) {
  this.studentFullName = `${this.studentFirstName} ${this.studentLastName}`;
  this.updatedAt = new Date();
  next();
});

// Pre-update hook to update updatedAt
applicationSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

export default applicationSchema;

