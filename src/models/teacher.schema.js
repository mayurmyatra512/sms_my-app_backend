import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  employeeCode: { type: String, required: true, unique: true },
  subjectId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject", model:"Subject" }],
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
  classId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class",model:"Class" }],
  sectionId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section", model:"Section" }],
  joiningDate: { type: Date },
  qualifications: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", model:"Department" },
  designation: { type: String },
  qualification: { type: String },
  experience: { type: String },
  salary: { type: Number },
  dateOfJoining: {
    type: Date,
    default: Date.now
  },
  paymentHistory:[
     {
    monthYear: { type: String, required: true }, // e.g., "MARCH 2024"
    amount:{type:Number},
    status:{type:String},
    date: {type:Date},
    method:{type:String},
    staffSalaryId: { type: mongoose.Schema.Types.ObjectId, ref: "StaffSalary", required: true }
  }
  ],
  staffSalaryId:{ type: mongoose.Schema.Types.ObjectId, ref: "StaffSalary", model:"StaffSalary" },
  emergencyContactName: { type: String },
  emergencyContactNumber: { type: String },
  emergencyContactRelation: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});


export default teacherSchema;

