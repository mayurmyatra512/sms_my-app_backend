import mongoose, { model } from "mongoose";
import teacherSchema from "../models/teacher.schema.js";
import { dbName } from "../config/tenantManager.js";
import { getDbConnection } from "../config/mongodbconnection.js";
import subjectSchema from "../models/subject.schema.js";
import classSchema from "../models/class.schema.js";
import sectionSchema from "../models/section.schema.js";
import staffSalarySchema from "../models/staffSalary.schema.js";
import departmentSchema from "../models/departments.schema.js";

// const TeacherModel = mongoose.model("Teacher", teacherSchema, "teachers");

// get a Teacher Database Model

export const getTeacherModel = async (companyId, companyName) => {
    try {
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        schoolDb.model("Subject", subjectSchema, "subjects");
        schoolDb.model("Class", classSchema, "classes");
        schoolDb.model("Section", sectionSchema, "sections");
        schoolDb.model("StaffSalary", staffSalarySchema, "staffSalaries");
        schoolDb.model("Department", departmentSchema, "departments");


        return schoolDb.model(`Teacher`, teacherSchema, `teachers`);
    } catch (error) {
        console.error("Error getting Teacher model:", error);
        throw new Error("Failed to get Teacher model");
    }
}

export default class TeacherRepository {
    // Create a new Teacher record
    async createTeacher(data, companyId, companyName) {
        try {
            const TeacherModel = await getTeacherModel(companyId, companyName);
            if (!TeacherModel) throw new Error("Teacher model not found");
            // Create a new teacher instance
            const teacherInstance = new TeacherModel(data);
            return await teacherInstance.save();
        } catch (error) {
            console.error("Error creating Teacher:", error);
            throw new Error("Failed to create Teacher");
        }
    }

    // Get all Teachers
    async getAllTeachers(companyId, companyName) {
        try {
            const TeacherModel = await getTeacherModel(companyId, companyName);
            if (!TeacherModel) throw new Error("Teacher model not found");
            const res = await TeacherModel.find()
                    .populate("subjectId", "name code")
                    .populate("userId")
                    .populate("schoolId", "name address")
                    .populate("classId", "name")
                    .populate("sectionId", "name")
                    .populate("department", "name")
                    .populate("staffSalaryId")
                    .populate({
                        path: "paymentHistory.staffSalaryId",
                        model: "StaffSalary"
                    })
                .exec();

            // console.log("Teacher Data is repository = ",res);
            return res;
        } catch (error) {
            console.error("Error fetching Teachers:", error);
            throw new Error("Failed to fetch Teachers");
        }
    }

    // Get a Teacher by ID
    async getATeacher(id, companyId, companyName) {
        try {
            const TeacherModel = await getTeacherModel(companyId, companyName);
            if (!TeacherModel) throw new Error("Teacher model not found");
            return await TeacherModel.findById(id);
        } catch (error) {
            console.error("Error fetching Teacher by ID:", error);
            throw new Error("Failed to fetch Teacher");
        }
    }

    // Update a Teacher by ID
    async updateATeacher(id, data, companyId, companyName) {
        try {
            const TeacherModel = await getTeacherModel(companyId, companyName);
            if (!TeacherModel) throw new Error("Teacher model not found");
            return await TeacherModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating Teacher by ID:", error);
            throw new Error("Failed to update Teacher");
        }
    }
    // Delete a Teacher by ID
    async deleteATeacher(id, companyId, companyName) {
        try {
            const TeacherModel = await getTeacherModel(companyId, companyName);
            if (!TeacherModel) throw new Error("Teacher model not found");
            return await TeacherModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting Teacher by ID:", error);
            throw new Error("Failed to delete Teacher");
        }
    }
    // Search Teacher By Name
    async getTeacherByName(userId, companyId, companyName) {
        try {
            const TeacherModel = await getTeacherModel(companyId, companyName);
            if (!TeacherModel) throw new Error("Teacher model not found");
            return await TeacherModel.find({ userId });
        } catch (error) {
            console.error("Error fetching Teacher by Name:", error);
            throw new Error("Failed to fetch Teacher");
        }
    }
    // Search Teacher By Emp code
    async getTeacherByEmpCode(empCode, companyId, companyName) {
        try {
            const TeacherModel = await getTeacherModel(companyId, companyName);
            if (!TeacherModel) throw new Error("Teacher model not found");
            return await TeacherModel.find({ empCode });
        } catch (error) {
            console.error("Error fetching Teacher by Employee Code:", error);
            throw new Error("Failed to fetch Teacher");
        }
    }
    // Search Teacher By School
    async getTeacherBySchool(schoolId, companyId, companyName) {
        try {
            const TeacherModel = await getTeacherModel(companyId, companyName);
            if (!TeacherModel) throw new Error("Teacher model not found");
            return await TeacherModel.find({ schoolId });
        } catch (error) {
            console.error("Error fetching Teacher by School:", error);
            throw new Error("Failed to fetch Teacher");
        }
    }
    // Search Teacher By Subjects
    async getTeacherBySubjects(schoolId, companyId, companyName) {
        try {
            const TeacherModel = await getTeacherModel(companyId, companyName);
            if (!TeacherModel) throw new Error("Teacher model not found");
            if (matchAll) {
                // Teachers must have ALL the given subjects
                return await TeacherModel.find({ subjects: { $all: subjectIds } }).populate("subjectId");
            } else {
                // Teachers must have ANY of the given subjects
                return await TeacherModel.find({ subjects: { $in: subjectIds } }).populate("subjectId");
            }
        } catch (error) {
            console.error("Error fetching Teacher by School:", error);
            throw new Error("Failed to fetch Teacher");
        }
    }
    // Search Teacher By Qualification
    async getTeacherByQualification(qualifications, companyId, companyName) {
        try {
            const TeacherModel = await getTeacherModel(companyId, companyName);
            if (!TeacherModel) throw new Error("Teacher model not found");
            return await TeacherModel.find({ qualifications });
        } catch (error) {
            console.error("Error fetching Teacher by School:", error);
            throw new Error("Failed to fetch Teacher");
        }
    }

    // Add Pyment History
    async addPaymentHistory(teacherId, paymentData, companyId, companyName) {
        try {
            const TeacherModel = await getTeacherModel(companyId, companyName);
            if (!TeacherModel) throw new Error("Teacher model not found");

            const updatedTeacher = await TeacherModel.findByIdAndUpdate(
                teacherId,
                { $push: { paymentHistory: paymentData } },
                { new: true } // return updated doc
            );

            return updatedTeacher;
        } catch (error) {
            console.error("Error updating paymentHistory:", error);
            throw new Error("Failed to update payment history");
        }
    }

    async getTeacherByUserId(userId, companyId, companyName) {
         try {
            const TeacherModel = await getTeacherModel(companyId, companyName);
            if (!TeacherModel) throw new Error("Teacher model not found");
            const res = await TeacherModel.findOne({userId: userId})
                    .populate("subjectId", "name code")
                    .populate("userId")
                    .populate("schoolId", "name address")
                    .populate("classId", "name")
                    .populate("sectionId", "name")
                    .populate("department", "name")
                    .populate("staffSalaryId")
                    .populate({
                        path: "paymentHistory.staffSalaryId",
                        model: "StaffSalary"
                    })
                .exec();

            // console.log("Teacher Data is repository = ",res);
            return res;
        } catch (error) {
            console.error("Error fetching Teachers:", error);
            throw new Error("Failed to fetch Teachers");
        }
    }
    static async countActiveTeachers(schoolId, schoolName) {
        const TeacherModel = await getTeacherModel(schoolId, schoolName);
            if (!TeacherModel) throw new Error("Teacher model not found");
    return await TeacherModel.countDocuments({ schoolId, status: "active" });
  }
}