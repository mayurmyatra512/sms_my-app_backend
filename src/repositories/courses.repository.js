import mongoose from "mongoose";
// import examResultSchema from "../models/examResult.schema.js";
import coursesSchema from "../models/courses.schema.js";
import { dbName } from "../config/tenantManager.js";
import { getDbConnection } from "../config/mongodbconnection.js";
import studentSchema from "../models/student.schema.js";
import subjectSchema from "../models/subject.schema.js";

// get a Courses Database Model
export const getCoursesModel = async (companyId, companyName) => {
    try {
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        schoolDb.model("Subject", subjectSchema, "subjects");
        return schoolDb.model(`Courses`, coursesSchema, `courses`);
    } catch (error) {
        console.error("Error getting courses model:", error);
        throw new Error("Failed to get courses model");
    }
}

export default class CoursesRepository {
    // Create a new Courses record
    async createCourses(data, companyId, companyName) {
        try {
            // console.log("Data = ", data);
            const CoursesModel = await getCoursesModel(companyId, companyName);
            if (!CoursesModel) throw new Error("Courses model not found");
            // Create a new courses instance
            const coursesInstance = new CoursesModel(data);
            return await coursesInstance.save();
        } catch (error) {
            console.error("Error creating courses:", error);
            throw new Error("Failed to create courses");
        }
    }
    // Get all Courses
    async getAllCourses(companyId, companyName) {
        try {
            const CoursesModel = await getCoursesModel(companyId, companyName);
            if (!CoursesModel) throw new Error("Courses model not found");
            const courses = await CoursesModel.find()
                .populate("subjectIds", "code name") // populate with specific fields (code, name)
                .exec();

            return courses;
        } catch (error) {
            console.error("Error fetching Courses:", error);
            throw new Error("Failed to fetch Courses");
        }
    }

    // Get a Courses by ID
    async getACourse(id, companyId, companyName) {
        try {
            const CoursesModel = await getCoursesModel(companyId, companyName);
            if (!CoursesModel) throw new Error("Courses model not found");
            return await CoursesModel.findById(id);
        } catch (error) {
            console.error("Error fetching Courses by ID:", error);
            throw new Error("Failed to fetch Courses");
        }
    }

    // Update a Courses by ID
    async updateACourse(id, data, companyId, companyName) {
        try {
            const CoursesModel = await getCoursesModel(companyId, companyName);
            if (!CoursesModel) throw new Error("Courses model not found");
            return await CoursesModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating Courses by ID:", error);
            throw new Error("Failed to update Courses");
        }
    }
    // Delete a Courses by ID
    async deleteACourse(id, companyId, companyName) {
        try {
            const CoursesModel = await getCoursesModel(companyId, companyName);
            if (!CoursesModel) throw new Error("Courses model not found");
            return await CoursesModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting Courses by ID:", error);
            throw new Error("Failed to delete Courses");
        }
    }
    // get Subjects By Course ID
    async getSubjectsByCourses(id, companyId, companyName) {
        try {
            // Validate input
            if (!id || !companyId) {
                throw new Error("Course ID and Company ID are required");
            }

            // Find the course and populate subjects
            const course = await Course.findOne({
                _id: id,
                schoolId: companyId, // assuming schoolId is linked with companyId
            })
                .populate({
                    path: "subjectIds",
                    select: "name code description credits", // only return needed fields
                })
                .lean();

            if (!course) {
                return {
                    success: false,
                    message: `Course not found for ${companyName || "this school"}`,
                    data: [],
                };
            }

            return {
                success: true,
                message: `Subjects fetched successfully for ${course.name}`,
                data: course.subjectIds || [],
            };
        } catch (error) {
            console.error("Error in getSubjectsByCourses:", error);
            return {
                success: false,
                message: "Failed to fetch subjects",
                error: error.message,
            };
        }
    }
}