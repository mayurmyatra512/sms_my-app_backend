import mongoose from "mongoose";

const { Schema, model } = mongoose;

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      minlength: [2, "Department name must be at least 2 characters"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Department code is required"],
      minlength: [2, "Code must be at least 2 characters"],
      maxlength: [10, "Code cannot exceed 10 characters"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    headOfDepartment: {
      type: String,
      required: [true, "Head of Department is required"],
      trim: true,
    },
    budget: {
      type: Number, // stored as number, form can pass string but convert before saving
      required: [true, "Budget is required"],
      min: [0, "Budget must be a positive number"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    establishedDate: {
      type: Date,
      required: [true, "Established date is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "under-review"],
      default: "active",
    },
    category: {
      type: String,
      enum: ["academic", "administrative", "support", "research"],
      default: "academic",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      minlength: [10, "Phone number must be at least 10 digits"],
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

export default departmentSchema;