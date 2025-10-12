import mongoose from "mongoose";

// const examResultSchema = new mongoose.Schema({
//     examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam",model:"Exam", required: true },
//     studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", model:"Student", required: true },
//     subjectId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject", model:"Subject", required: true }],
//     teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", model:"Teacher", required: true },
//     marksObtained: { type: Number, required: true },
//     totalMarks: { type: Number, required: true },
//     name: { type: String, required: true }, // e.g. "Mid Term"
//     classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class",model:"Class", required: true },
//     grade: { type: String, enum: ["A+", "A", "B+", "B", "C", "D", "F"], required: true }
// });


const examResultSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    name: { type: String, required: true }, // e.g. "Mid Term"

    subjects: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        teacherId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Teacher",
          required: true,
        },
        marksObtained: { type: Number, required: true },
        totalMarks: { type: Number, required: true },
        grade: {
          type: String,
          enum: ["A+", "A", "B+", "B", "C", "D", "F"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);
export default examResultSchema;