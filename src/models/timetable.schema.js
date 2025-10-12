import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", model:"Class", required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", model:"Section", required: true },
//   subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
//   teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
//   startTime: { type: Date, required: true },
//   endTime: { type: Date, required: true },
  day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], required: true },
    periods: [{
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", model:"Subject" },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", model:"Teacher" },
    duration: {type:String}
  }]
});

export default timetableSchema;