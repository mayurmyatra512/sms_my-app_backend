import studentFeesSchema from "../models/studFees.schema.js";
import { dbName } from "../config/tenantManager.js";
import { getDbConnection } from "../config/mongodbconnection.js";
import studentSchema from "../models/student.schema.js";
import classSchema from "../models/class.schema.js";
import sectionSchema from "../models/section.schema.js";
import feeSchema from "../models/feeModel.schema.js";

// get a StudentFee Database Model
export const getStudentFeeModel = async (companyId, companyName) => {
    try {
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        // Register referenced models for population
        schoolDb.model("Student", studentSchema, "students");
        schoolDb.model("Class", classSchema, "classes");
        schoolDb.model("Section", sectionSchema, "sections");
        schoolDb.model("Fee", feeSchema, "fees")

        return schoolDb.model(`StudentFee`, studentFeesSchema, `studentFees`);
    } catch (error) {
        console.error("Error getting student fee model:", error);
        throw new Error("Failed to get student fee model");
    }
}

export default class StudentFeeRepository {
    // Create a new Fee record
    async createStudentFee(data, companyId, companyName) {
        try {
            const StudentFeeModel = await getStudentFeeModel(companyId, companyName);
            if (!StudentFeeModel) throw new Error("Student Fee model not found");
            // Create a new student fee instance
            const feeInstance = new StudentFeeModel(data);
            const resp = await feeInstance.save();

            return resp;
        } catch (error) {
            console.error("Error creating Student Fee:", error);
            throw new Error("Failed to create Student Fee");
        }
    }
    // Get all Student Fees
    async getAllStudentFees(companyId, companyName) {
        try {
            const StudentFeeModel = await getStudentFeeModel(companyId, companyName);
            if (!StudentFeeModel) throw new Error("Student Fee model not found");
            const resp = await StudentFeeModel.find()
                .populate({
                    path: "studentId",
                    populate: { path: "userId", model: "User" }
                })
                // .populate("classId")
                .populate("collectedBy")
                .populate("feeModelId")
                .exec();
            // console.log("Resp in repo from studentFee = ", resp);
            return resp;
        } catch (error) {
            console.error("Error fetching Student Fees:", error);
            throw new Error("Failed to fetch Student Fees");
        }
    }
    // Get a Student Fee by ID
    async getAStudentFee(id, companyId, companyName) {
        try {
            const StudentFeeModel = await getStudentFeeModel(companyId, companyName);
            if (!StudentFeeModel) throw new Error("Student Fee model not found");
            return await StudentFeeModel.findById(id);
        } catch (error) {
            console.error("Error fetching Student Fee by ID:", error);
            throw new Error("Failed to fetch Student Fee");
        }
    }

    // Update a Student Fee by ID
    async updateAStudentFee(id, data, companyId, companyName) {
        try {
            // console.log("data in updateAStudentFee = ", data);
            const StudentFeeModel = await getStudentFeeModel(companyId, companyName);
            if (!StudentFeeModel) throw new Error("Student Fee model not found");
            return await StudentFeeModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating Student Fee by ID:", error);
            throw new Error("Failed to update Student Fee");
        }
    }
    // Delete a Student Fee by ID
    async deleteAStudentFee(id, companyId, companyName) {
        try {
            const StudentFeeModel = await getStudentFeeModel(companyId, companyName);
            if (!StudentFeeModel) throw new Error("Student Fee model not found");
            return await StudentFeeModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting Student Fee by ID:", error);
            throw new Error("Failed to delete Student Fee");
        }
    }
}