import mongoose from "mongoose";
import { hashPassword } from "../config/jwtops.js";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    role: { type: String, enum: ["student", "teacher", "admin", "parent"], required: true },

    // Profile reference (link to role-specific schema)
    profileId: { type: mongoose.Schema.Types.ObjectId, refPath: "profileModel" },
    profileModel: { type: String, enum: ["Admin", "Parent", "Student", "Teacher"], default: null },

    //Auth
    password: { type: String, required: true },

    //Other details
    address: { type: String },
    dob: { type: Date },
    isActive: { type: Boolean, default: true },
    gender: { type: String, enum: ["male", "female", "other"] },

    // School relation
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },

    // Extras
    profileImage: { type: String }, // optional profile pic
    lastLogin: { type: Date },

    // Extra info
    medicalInfo: { type: String },
    additionalNotes: { type: String },


    // profileImage: { type: String },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        // Hash the password before saving
        this.password = await hashPassword(this.password); // Assume hashPassword is a function that hashes the password
        console.log("encrypted Password = ", this.password)
    }
    next();
});

userSchema.index({ email: 1, role: 1 }, { unique: true }); // Ensure unique email per role

// userSchema.methods.toJSON = function() {
//     const obj = this.toObject();
//     delete obj.password; // Exclude password from the JSON representation
//     return obj;
// };

export default userSchema;
