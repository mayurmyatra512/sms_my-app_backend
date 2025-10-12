import mongoose from "mongoose";

const parentSchema = new mongoose.Schema({
  // Link to User schema
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String },
  gardianFirstName: { type: String },
  gardianLastName: { type: String },
  fullName: { type: String, required: true },
  alternatePhone: { type: String },
  fatherOccupation: { type: String },
  gardiaanRelation: { type: String, enum: ["Father", "Mother", "Gardian"], default: "Father" }, // e.g., father, mother, guardian
  emergencyContact: { type: String },

  // Relations
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },

  createdAt: { type: Date, default: Date.now },
});


export default parentSchema;

