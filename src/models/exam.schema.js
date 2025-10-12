import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g. "Mid Term"
    subjectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Subject", 
        model:"Subject"
    }, // Subjects under the course
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class",model:"Class", required: true },
    date: { type: Date },
    duration: { type: String, default: "120" },
    maxMarks: { type: Number, default: 100 },
    description: { type: String },
    // endDate: { type: Date }  
});

export default examSchema;