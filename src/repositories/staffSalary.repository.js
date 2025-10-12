import mongoose from "mongoose";
import staffSalarySchema from "../models/staffSalary.schema.js";
import { dbName } from "../config/tenantManager.js";
import { getDbConnection } from "../config/mongodbconnection.js";
import teacherSchema from "../models/teacher.schema.js";
import subjectSchema from "../models/subject.schema.js";
import classSchema from "../models/class.schema.js";
import sectionSchema from "../models/section.schema.js";
import departmentSchema from "../models/departments.schema.js";

// const StaffSalaryModel = mongoose.model("StaffSalary", staffSalarySchema, "staffSalaries");

// get a StaffSalary Database Model
export const getStaffSalaryModel = async (companyId, companyName) => {
    try {
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        schoolDb.model("Teacher", teacherSchema, "teachers");
        schoolDb.model("Subject", subjectSchema, "subjects");
        schoolDb.model("Class", classSchema, "classes");
        schoolDb.model("Section", sectionSchema, "sections");
        schoolDb.model("Department", departmentSchema, "departments");

        return schoolDb.model(`StaffSalary`, staffSalarySchema, `staffSalaries`);
    } catch (error) {
        console.error("Error getting staff salary model:", error);
        throw new Error("Failed to get staff salary model");
    }
}

export default class StaffSalaryRepository {
    // Create a new StaffSalary record
    async createStaffSalary(data, companyId, companyName) {
        try {
            const StaffSalaryModel = await getStaffSalaryModel(companyId, companyName);
            if (!StaffSalaryModel) throw new Error("StaffSalary model not found");
            // Create a new staff salary instance
            const staffSalaryInstance = new StaffSalaryModel(data);
            return await staffSalaryInstance.save();
        } catch (error) {
            console.error("Error creating StaffSalary:", error);
            throw new Error("Failed to create StaffSalary");
        }
    }


    // Get all StaffSalarys
    async getAllStaffSalaries(companyId, companyName) {
        try {
            const StaffSalaryModel = await getStaffSalaryModel(companyId, companyName);
            if (!StaffSalaryModel) throw new Error("StaffSalary model not found");
            const resp = await StaffSalaryModel.find()
                .populate({
                    path: "staffId", // staffId -> Teacher
                    model: "Teacher",
                    populate: [
                        { path: "userId", model: "User" },
                        { path: "subjectId", model: "Subject" },
                        { path: "classId", model: "Class" },
                        { path: "sectionId", model: "Section" },
                        { path: "department", model: "Department" },
                    ],
                });
            return resp
        } catch (error) {
            console.error("Error fetching StaffSalarys:", error);
            throw new Error("Failed to fetch StaffSalarys");
        }
    }

    // Get a StaffSalary by ID
    async getAStaffSalary(id, companyId, companyName) {
        try {
            const StaffSalaryModel = await getStaffSalaryModel(companyId, companyName);
            if (!StaffSalaryModel) throw new Error("StaffSalary model not found");
            return await StaffSalaryModel.findById(id);
        } catch (error) {
            console.error("Error fetching StaffSalary by ID:", error);
            throw new Error("Failed to fetch StaffSalary");
        }
    }

    // Update a StaffSalary by ID
    async updateAStaffSalary(id, data, companyId, companyName) {
        try {
            const StaffSalaryModel = await getStaffSalaryModel(companyId, companyName);
            if (!StaffSalaryModel) throw new Error("StaffSalary model not found");
            return await StaffSalaryModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating StaffSalary by ID:", error);
            throw new Error("Failed to update StaffSalary");
        }
    }
    // Delete a StaffSalary by ID
    async deleteAStaffSalary(id, companyId, companyName) {
        try {
            const StaffSalaryModel = await getStaffSalaryModel(companyId, companyName);
            if (!StaffSalaryModel) throw new Error("StaffSalary model not found");
            return await StaffSalaryModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting StaffSalary by ID:", error);
            throw new Error("Failed to delete StaffSalary");
        }
    }
    // Get Staff Salaries by Status
    async getStaffSalariesByStatus(status, companyId, companyName) {
        try {
            const StaffSalaryModel = await getStaffSalaryModel(companyId, companyName);
            if (!StaffSalaryModel) throw new Error("StaffSalary model not found");
            return await StaffSalaryModel.find({ status });
        } catch (error) {
            console.error("Error fetching Staff Salaries by status:", error);
            throw new Error("Failed to fetch Staff Salaries by status");
        }
    }
    // Get Staff Salaries by Month
    async getStaffSalariesByMonth(month, companyId, companyName) {
        try {
            const StaffSalaryModel = await getStaffSalaryModel(companyId, companyName);
            if (!StaffSalaryModel) throw new Error("StaffSalary model not found");
            return await StaffSalaryModel.find({ month });
        } catch (error) {
            console.error("Error fetching Staff Salaries by month:", error);
            throw new Error("Failed to fetch Staff Salaries by month");
        }
    }
    // Get Staff Salaries by Year
    async getStaffSalariesByYear(year, companyId, companyName) {
        try {
            const StaffSalaryModel = await getStaffSalaryModel(companyId, companyName);
            if (!StaffSalaryModel) throw new Error("StaffSalary model not found");
            return await StaffSalaryModel.find({ year });
        } catch (error) {
            console.error("Error fetching Staff Salaries by year:", error);
            throw new Error("Failed to fetch Staff Salaries by year");
        }
    }

    // Get Staff Salaries by Staff ID
    async getStaffSalariesByStaff(staffId, companyId, companyName) {
        try {
            const StaffSalaryModel = await getStaffSalaryModel(companyId, companyName);
            if (!StaffSalaryModel) throw new Error("StaffSalary model not found");
            return await StaffSalaryModel.find({ staff: staffId });
        } catch (error) {
            console.error("Error fetching Staff Salaries by staff ID:", error);
            throw new Error("Failed to fetch Staff Salaries by staff ID");
        }
    }
}