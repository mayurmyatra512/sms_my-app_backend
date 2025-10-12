import mongoose from "mongoose";
import attendanceSchema from "../models/attendance.schema.js";
import { getDbConnection } from "../config/mongodbconnection.js";
import { dbName } from "../config/tenantManager.js";
import studentSchema from "../models/student.schema.js";
import classSchema from "../models/class.schema.js";
import sectionSchema from "../models/section.schema.js";

// Get Attendance model for tenant (school)
export const getAttendanceModel = async (companyId, companyName) => {
    try {
        const db = await dbName(companyName, companyId);
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // Register referenced models for population
        schoolDb.model("Student", studentSchema, "students");
        schoolDb.model("Class", classSchema, "classes");
        schoolDb.model("Section", sectionSchema, "sections");
        return schoolDb.model("Attendance", attendanceSchema, "attendances");
    } catch (error) {
        console.error("Error getting attendance model:", error);
        throw new Error("Failed to get attendance model");
    }
};

export default class AttendanceRepository {
    // ✅ Create or update attendance (per class/section/date)
    async createOrUpdateAttendance(data, companyId, companyName) {
        try {
            const AttendanceModel = await getAttendanceModel(companyId, companyName);
            if (!AttendanceModel) throw new Error("Attendance model not found");
            console.log(data);
            // Check if attendance already exists for same class, section, date
            const existing = await AttendanceModel.findOne({
                classId: data.classId,
                sectionId: data.sectionId,
                date: new Date(data.date).setHours(0, 0, 0, 0)
            });

            if (existing) {
                // Update existing records
                existing.records = data.records;
                existing.updatedAt = new Date();
                return await existing.save();
            }

            // Create new attendance
            const attendance = new AttendanceModel(data);
            return await attendance.save();
        } catch (error) {
            console.error("Error creating/updating attendance:", error);
            throw new Error("Failed to create/update attendance");
        }
    }

    // ✅ Get all attendances
    async getAllAttendances(companyId, companyName) {
        try {
            const AttendanceModel = await getAttendanceModel(companyId, companyName);
            if (!AttendanceModel) throw new Error("Attendance model not found");

            const resp = await AttendanceModel.find()
                .populate("classId")
                .populate("sectionId")
                .populate({
                    path: "records.studentId",
                    populate: { path: "userId", model: "User" }
                })
                .exec();

            return resp;
        } catch (error) {
            console.error("Error fetching attendances:", error);
            throw new Error("Failed to fetch attendances");
        }
    }

    // ✅ Update a specific Attendance by ID
    async updateAAttendance(id, data, companyId, companyName) {
        try {
            console.log(data);
            const AttendanceModel = await getAttendanceModel(companyId, companyName);
            if (!AttendanceModel) throw new Error("Attendance model not found");

            // Replace whole record (safe if editing all records at once)
            const updatedAttendance = await AttendanceModel.findByIdAndUpdate(
                id,
                { $set: data },
                { new: true }
            )
                .populate({
                    path: "records.studentId",
                    populate: { path: "userId", model: "User" }
                })
                .populate("classId")
                .populate("sectionId");

            return updatedAttendance;
        } catch (error) {
            console.error("Error updating attendance by ID:", error);
            throw new Error("Failed to update attendance");
        }
    }

    // ✅ Get attendance by ID
    async getAAttendance(id, companyId, companyName) {
        try {
            const AttendanceModel = await getAttendanceModel(companyId, companyName);
            if (!AttendanceModel) throw new Error("Attendance model not found");

            return await AttendanceModel.findById(id)
                .populate("classId")
                .populate("sectionId")
                .populate({
                    path: "records.studentId",
                    populate: { path: "userId", model: "User" }
                });
        } catch (error) {
            console.error("Error fetching attendance by ID:", error);
            throw new Error("Failed to fetch attendance");
        }
    }

    // ✅ Delete attendance
    async deleteAAttendance(id, companyId, companyName) {
        try {
            const AttendanceModel = await getAttendanceModel(companyId, companyName);
            if (!AttendanceModel) throw new Error("Attendance model not found");

            const resp = await AttendanceModel.findByIdAndDelete(id);
            if (!resp) throw new Error("Attendance not found");

            return { status: "success", message: "Attendance deleted successfully" };
        } catch (error) {
            console.error("Error deleting attendance:", error);
            throw new Error("Failed to delete attendance");
        }
    }

    // ✅ Get attendance by student ID
    async getAttendanceByStudentId(studentId, companyId, companyName) {
        try {
            const AttendanceModel = await getAttendanceModel(companyId, companyName);
            if (!AttendanceModel) throw new Error("Attendance model not found");

            return await AttendanceModel.find({ "records.studentId": studentId })
                .populate("classId", "name")
                .populate("sectionId", "name")
                .populate({
                    path: "records.studentId",
                    populate: { path: "userId", model: "User" }
                });
        } catch (error) {
            console.error("Error fetching attendance by student ID:", error);
            throw new Error("Failed to fetch attendance by student ID");
        }
    }

    // ✅ Get attendance by class/section/date
    async getAttendanceByClassAndDate(classId, sectionId, date, companyId, companyName) {
        try {
            const AttendanceModel = await getAttendanceModel(companyId, companyName);
            if (!AttendanceModel) throw new Error("Attendance model not found");
            const res = await AttendanceModel.findOne({
                classId,
                sectionId,
                date
            })
                .populate("classId")
                .populate("sectionId")
                .populate({
                    path: "records.studentId",
                    populate: { path: "userId", model: "User" }
                })
                .exec();
            console.log("Repository of attendance = ", res);
            return res
        } catch (error) {
            console.error("Error fetching attendance by class/date:", error);
            throw new Error("Failed to fetch attendance");
        }
    }

    static async getAverageAttendanceRate(schoolId, schoolName) {
        const AttendanceModel = await getAttendanceModel(schoolId, schoolName);
        if (!AttendanceModel) throw new Error("Attendance model not found");
            
        try {
            const records = await AttendanceModel.aggregate([
                { $match: { schoolId } },
                {
                    $project: {
                        total: { $size: "$records" },
                        presentCount: {
                            $size: {
                                $filter: {
                                    input: "$records",
                                    as: "rec",
                                    cond: { $eq: ["$$rec.status", "present"] },
                                },
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalMarked: { $sum: "$total" },
                        totalPresent: { $sum: "$presentCount" },
                    },
                },
            ]);

            if (!records.length || records[0].totalMarked === 0) return 0;

            const { totalPresent, totalMarked } = records[0];
            const rate = (totalPresent / totalMarked) * 100;

            return Number(rate.toFixed(1)); // e.g., 94.2
        } catch (err) {
            console.error("Error calculating attendance rate:", err);
            return 0;
        }
    }
}
