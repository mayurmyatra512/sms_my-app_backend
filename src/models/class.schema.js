import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Grade 10"
  capacity: { type: Number },
  section: [{ type: String }], // e.g. "A", "B"
  description: { type: String },
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", model:"Teacher" },
});

export default classSchema;