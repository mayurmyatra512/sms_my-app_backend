import mongoose from "mongoose";
import timetableSchema from "../models/timetable.schema.js";
import { dbName } from "../config/tenantManager.js";
import { getDbConnection } from "../config/mongodbconnection.js";
import subjectSchema from "../models/subject.schema.js";
import teacherSchema from "../models/teacher.schema.js";
import classSchema from "../models/class.schema.js";
import sectionSchema from "../models/section.schema.js";

// const TimetableModel = mongoose.model("Timetable", timetableSchema, "timetables");

// get a Timetable Database Model
export const getTimetableModel = async (companyId, companyName) => {
    try {
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        schoolDb.model("Subject", subjectSchema, "subjects");
        schoolDb.model("Teacher", teacherSchema, "teachers");
        schoolDb.model("Class", classSchema, "classes");
        schoolDb.model("Section", sectionSchema, "sections");

        return schoolDb.model(`Timetable`, timetableSchema, `timetables`);
    } catch (error) {
        console.error("Error getting Timetable model:", error);
        throw new Error("Failed to get Timetable model");
    }
}
export default class TimetableRepository {
    // Create a new Timetable record
     async createTimetable(data, companyId, companyName) {
        try {
            const TimetableModel = await getTimetableModel(companyId, companyName);
            if (!TimetableModel) throw new Error("Timetable model not found");
            // Create a new timetable instance
            const timetableInstance = new TimetableModel(data);
            return await timetableInstance.save();
        } catch (error) {
            console.error("Error creating Timetable:", error);
            throw new Error("Failed to create Timetable");
        }
    }

    // Get all Timetables
     async getAllTimetables(companyId, companyName) {
        try {
            const TimetableModel = await getTimetableModel(companyId, companyName);
            if (!TimetableModel) throw new Error("Timetable model not found");
            const resp = await TimetableModel.find()
            .populate("classId", "name code")
            .populate("sectionId", "name code")
            .populate("periods.subjectId", "name code")
            .populate({
                path: "periods.teacherId",
                populate: {path: "userId", model: "User"}
            })
            .exec();
            return resp
        } catch (error) {
            console.error("Error fetching Timetables:", error);
            throw new Error("Failed to fetch Timetables");
        }
    }

    // Get a Timetable by ID
     async getATimetable(id, companyId, companyName) {
        try {
            const TimetableModel = await getTimetableModel(companyId, companyName);
            if (!TimetableModel) throw new Error("Timetable model not found");
            return await TimetableModel.findById(id);
        } catch (error) {
            console.error("Error fetching Timetable by ID:", error);
            throw new Error("Failed to fetch Timetable");
        }
    }

    // Update a Timetable by ID
     async updateATimetable(id, data, companyId, companyName) {
        try {
            const TimetableModel = await getTimetableModel(companyId, companyName);
            if (!TimetableModel) throw new Error("Timetable model not found");
            return await TimetableModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating Timetable by ID:", error);
            throw new Error("Failed to update Timetable");
        }
    }
    // Delete a Timetable by ID
     async deleteATimetable(id, companyId, companyName) {
        try {
            const TimetableModel = await getTimetableModel(companyId, companyName);
            if (!TimetableModel) throw new Error("Timetable model not found");
            return await TimetableModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting Timetable by ID:", error);
            throw new Error("Failed to delete Timetable");
        }
    }
    // Delete a Timetable by class
     async getTimetableByClassId(classId, companyId, companyName) {
        try {
            const TimetableModel = await getTimetableModel(companyId, companyName);
            if (!TimetableModel) throw new Error("Timetable model not found");
            return await TimetableModel.find({ classId });
        } catch (error) {
            console.error("Error deleting Timetable by Class:", error);
            throw new Error("Failed to delete Timetable");
        }
    }
}