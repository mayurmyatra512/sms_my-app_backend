import mongoose from "mongoose";
import feeSchema from "../models/feeModel.schema.js";
import { dbName } from "../config/tenantManager.js";
import { getDbConnection } from "../config/mongodbconnection.js";
import { ObjectId } from "mongodb";
import { getClassModel } from "./class.repository.js";
import studentSchema from "../models/student.schema.js";
import classSchema from "../models/class.schema.js";
import sectionSchema from "../models/section.schema.js";
import studentFeesSchema from "../models/studFees.schema.js";
import { populate } from "dotenv";

// const FeeModel = mongoose.model("Fee", feeSchema, "fees");

// get a Fee Database Model
export const getFeeModel = async (companyId, companyName) => {
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
        schoolDb.model("StudentFee", studentFeesSchema, "studentFees");

        return schoolDb.model(`Fee`, feeSchema, `fees`);
    } catch (error) {
        console.error("Error getting fee model:", error);
        throw new Error("Failed to get fee model");
    }
}

export default class FeeRepository {
    // Create a new Fee record
    async createFee(data, companyId, companyName) {
        try {
            // console.log("Data in repo = ", data);
            const FeeModel = await getFeeModel(companyId, companyName);
            if (!FeeModel) throw new Error("Fee model not found");
            // Create a new fee instance
            const feeInstance = new FeeModel(data);
            return await feeInstance.save();
        } catch (error) {
            console.error("Error creating Fee:", error);
            throw new Error("Failed to create Fee");
        }
    }

    // Get all Fees
    async getAllFees(companyId, companyName) {
        try {
            const FeeModel = await getFeeModel(companyId, companyName);
            if (!FeeModel) throw new Error("Fee model not found");
            const resp = await FeeModel.find()

                .populate("classId")
                .populate({
                    path: "studentId",
                    populate: { path: "userId", model: "User" }
                })
                .exec()
            // console.log("Resp in repo = ", resp);
            return resp;
        } catch (error) {
            console.error("Error fetching Fees:", error);
            throw new Error("Failed to fetch Fees");
        }
    }

    // Get a Fee by ID
    async getAFee(id, companyId, companyName) {
        try {
            const FeeModel = await getFeeModel(companyId, companyName);
            if (!FeeModel) throw new Error("Fee model not found");
            return await FeeModel.findById(id);
        } catch (error) {
            console.error("Error fetching Fee by ID:", error);
            throw new Error("Failed to fetch Fee");
        }
    }

    // Update a Fee by ID
    async updateAFee(id, data, companyId, companyName) {
        try {
            const FeeModel = await getFeeModel(companyId, companyName);
            if (!FeeModel) throw new Error("Fee model not found");
            return await FeeModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating Fee by ID:", error);
            throw new Error("Failed to update Fee");
        }
    }

    // Delete a Fee by ID
    async deleteAFee(id, companyId, companyName) {
        try {
            const FeeModel = await getFeeModel(companyId, companyName);
            if (!FeeModel) throw new Error("Fee model not found");
            return await FeeModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting Fee by ID:", error);
            throw new Error("Failed to delete Fee");
        }
    }
    async updateStudentFeeId(feeId, studentFeeId, companyId, companyName) {
        try {
            const FeeModel = await getFeeModel(companyId, companyName);
            if (!FeeModel) throw new Error("Fee model not found");
            const resp = await FeeModel.findOneAndUpdate(
                { _id: new ObjectId(feeId) },
                { studentFees: new ObjectId(studentFeeId) },
                { new: true }
            );
            // console.log("Resp in repo = ", resp);
            return resp;
        } catch (error) {
            console.error("Error updating Fee by ID:", error);
            throw new Error("Failed to update Fee");
        }
    }

    // Get fees by student ID
    async getFeesByStudentId(studentId, companyId, companyName) {
        try {
            const FeeModel = await getFeeModel(companyId, companyName);
            if (!FeeModel) throw new Error("Fee model not found");
            console.log("StudentId = ", studentId);
            const resp = await FeeModel.find({ studentId: studentId })
                .populate({
                    path: "studentId",
                    populate: ("userId")
                })
                .populate("studentFees")
                .populate("classId")
                .exec()

            console.log("Fees Data = ", resp);
            return resp
        } catch (error) {
            console.error("Error fetching fees by student ID:", error);
            throw new Error("Failed to fetch fees by student ID");

        }
    }
    // Get fees by class ID
    async getFeesByClassId(classId, companyId, companyName) {
        try {
            const FeeModel = await getFeeModel(companyId, companyName);
            if (!FeeModel) throw new Error("Fee model not found");
            return await FeeModel.find({ classId });
        } catch (error) {
            console.error("Error fetching fees by class ID:", error);
            throw new Error("Failed to fetch fees by class ID");

        }
    }
    // Get fees by type
    async getFeesByType(type, companyId, companyName) {
        try {
            const FeeModel = await getFeeModel(companyId, companyName);
            if (!FeeModel) throw new Error("Fee model not found");
            return await FeeModel.find({ type });
        } catch (error) {
            console.error("Error fetching fees by type:", error);
            throw new Error("Failed to fetch fees by type");
        }
    }
    // Get fees by status
    async getFeesByStatus(status, companyId, companyName) {
        try {
            const FeeModel = await getFeeModel(companyId, companyName);
            if (!FeeModel) throw new Error("Fee model not found");
            return await FeeModel.find({ status });
        } catch (error) {
            console.error("Error fetching fees by status:", error);
            throw new Error("Failed to fetch fees by status");
        }
    }
    // Get due fees
    async getDueFees(companyId, companyName) {
        try {
            const FeeModel = await getFeeModel(companyId, companyName);
            if (!FeeModel) throw new Error("Fee model not found");
            const today = new Date();
            return await FeeModel.find({ dueDate: { $lt: today }, status: "unpaid" });
        } catch (error) {
            console.error("Error fetching due fees:", error);
            throw new Error("Failed to fetch due fees");
        }
    }
    async updateStudentFeeStatus(feeId, status, companyId, companyName) {
        try {
            const FeeModel = await getFeeModel(companyId, companyName);
            if (!FeeModel) throw new Error("Fee model not found");
            const resp = await FeeModel.findOneAndUpdate(
                { _id: new ObjectId(feeId) },
                { status: status },
                { new: true }
            );
            // console.log("Resp in repo = ", resp);
            return resp;
        } catch (error) {
            console.error("Error updating Fee status by ID:", error);
            throw new Error("Failed to update Fee status");
        }
    }

    // export fees to CSV
    async exportFeesToCSV(companyId, companyName) {
        try {
            // const { companyId, companyName } = req.params;

            // 2. Register models on tenant DB (if not already registered)
            const FeeModel = await getFeeModel(companyId, companyName);
            if (!FeeModel) throw new Error("Fee model not found");

            const ClassModel = await getClassModel(companyId, companyName)
            if (!ClassModel) throw new Error("Class model not found");

            // 3. Fetch fees with populate (now models exist on same connection)

            const fees = await FeeModel.find()
                .populate({
                    path: "studentId",
                    populate: {
                        path: "userId",
                        model: "User"
                    }
                })
                .populate({ path: "classId", model: ClassModel })
                .lean();

            if (!fees || fees.length === 0) {
                throw new Error("No fee records found for export");
            }
            // console.log("Fees to export = ",fees);
            return fees

        } catch (error) {
            console.error("Error fetching fees for export:", error);
            res.status(500).json({ error: "Failed to fetch fees for export" });
        }
    }

    static async getMonthlyRevenue(schoolId, schoolName) {
        const FeeModel = await getFeeModel(schoolId, schoolName);
            if (!FeeModel) throw new Error("Fee model not found");
            
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const payments = await FeeModel.aggregate([
            {
                $match: {
                    schoolId,
                    status: "completed",
                    createdAt: {
                        $gte: new Date(currentYear, currentMonth, 1),
                        $lt: new Date(currentYear, currentMonth + 1, 1),
                    },
                },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        return payments[0]?.total || 0;
    }

    static async getRecentPayments(schoolId, schoolName) {
        const FeeModel = await getFeeModel(schoolId, schoolName);
            if (!FeeModel) throw new Error("Fee model not found");
           
        return await FeeModel.find({ schoolId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("studentId.userId", "fullName");
    }
}