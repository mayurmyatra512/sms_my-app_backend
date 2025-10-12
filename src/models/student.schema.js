import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    admissionNumber: { type: String, required: true, unique: true },
    studentCode: {type: String, required: true },
    rollNumber: { type: String },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", model:"Class" },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", model:"Section" },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", model:"Parent" },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    bloodGroup: { type: String },
    dateOfAdmission: { type: Date, default: Date.now },
    // Additional fields can be added as needed
    address: { type: String },
    phoneNumber: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
});

export default studentSchema;