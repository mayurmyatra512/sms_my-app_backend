// import mongoose from "mongoose";

// const attendanceSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student",model:"Student", required: true },
//   classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", model:"Class", required: true },
//   sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", model:"Section", required: true },
//   date: { type: Date, default: Date.now },
//   status: { type: String, enum: ["present", "absent", "late"], default: "present" },
//   remarks: { type: String }
// });

// export default attendanceSchema;

import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  status: { type: String, enum: ["present", "absent", "late"], default: "present" },
  remarks: { type: String, default: "" }
});

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
  records: [attendanceRecordSchema], // ✅ array of students with their attendance
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

attendanceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default attendanceSchema