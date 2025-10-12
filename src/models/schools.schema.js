import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
    name: { type: String, required: true }, // School Name
    code: { type: String, unique: true, required: true }, // Short Code like "SPS001"
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        pincode: String,
    },
    contact: {
        phone: String,
        email: String,
        website: String,
    },
    logo: { type: String }, // Path or URL to logo
    academicYear: {
        startMonth: { type: Number, default: 6 }, // e.g. June
        endMonth: { type: Number, default: 3 } // e.g. March
    },
    timezone: { type: String, default: "Asia/Kolkata" },
    currency: {
        type: String, default: "INR",
        enum: ["INR", "USD", "EUR", "GBP", "AUD", "CAD"]  // Extend as needed
    },

    settings: {
        gradingSystem: { type: String, enum: ["percentage", "grades"], default: "percentage" },
        maxStudentsPerClass: { type: Number, default: 50 },
        feeDueDays: { type: Number, default: 10 },
    },

    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdAt: { type: Date, default: Date.now },
    location: { type: String, required: true },
    established: { type: Date, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student", model:"Student" }],
});

export default schoolSchema;
