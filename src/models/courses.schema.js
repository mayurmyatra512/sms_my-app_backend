import mongoose from "mongoose";

const coursesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // Course name
    code: { type: String, required: true, unique: true, trim: true }, // Unique course code (like ENG101)
    description: { type: String, trim: true },

    // classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true }, // Related Class
    // teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Teacher responsible
    subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }], // Subjects under the course

    duration: { type: String, required: true }, // e.g., 12 weeks
    credits: { type: Number, default: 0 }, // Academic credits if needed
    // schedule: [
    //   {
    //     day: { type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], required: true },
    //     startTime: { type: String, required: true }, // "09:00"
    //     endTime: { type: String, required: true },   // "10:30"
    //   },
    // ],
    Department:{type: String},
    level: { 
      type: String,
      enum: ["Diploma", "Postgraduation", "Graduation"],
      default: "Diploma" }, 

    capacity: { type: Number, default: 30 }, // Max number of students
    // enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Students enrolled

    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },

    isActive: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default coursesSchema
