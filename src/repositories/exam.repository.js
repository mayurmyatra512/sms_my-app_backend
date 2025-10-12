import mongoose from "mongoose";
import examSchema from "../models/exam.schema.js";
import { dbName } from "../config/tenantManager.js";
import { getDbConnection } from "../config/mongodbconnection.js";
import { getSubjectModel } from "./subject.repository.js";
import { ObjectId } from "mongodb";
import studentSchema from "../models/student.schema.js";
import subjectSchema from "../models/subject.schema.js";
import classSchema from "../models/class.schema.js";

// const ExamModel = mongoose.model("Exam", examSchema, "exams");

export const getExamModel = async (companyId, companyName) => {
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
        return schoolDb.model(`Exam`, examSchema, `exams`);
    } catch (error) {
        console.error("Error getting exam model:", error);
        throw new Error("Failed to get exam model");
    }
}

export default class ExamRepository {
    // Create a new Exam record
    async createExam(data, companyId, companyName) {
        try {
            const examModel = await getExamModel(companyId, companyName);
            // console.log(data);
            if (!examModel) throw new Error("Exam model not found");
            // Create a new exam instance
            const examInstance = new examModel(data);
            return await examInstance.save();
        } catch (error) {
            console.error("Error creating Exam:", error);
            throw new Error("Failed to create Exam");
        }
    }


    // Get all Exams
    async getAllExams(companyId, companyName) {
        try {
            const ExamModel = await getExamModel(companyId, companyName);
            if (!ExamModel) throw new Error("Exam model not found");
            const SubjectModel = await getSubjectModel(companyId, companyName);
            if (!SubjectModel) throw new Error("Subject model not found");
            const exams = await ExamModel.find()
                .populate("subjectId", "code name")
                .populate("classId", "name") // populate with specific fields (name)
                .exec();

            // exams.subject = await SubjectModel.findById(new ObjectId(exams.subjectId)).select("code name");
           
            return exams
        } catch (error) {
            console.error("Error fetching Exams:", error);
            throw new Error("Failed to fetch Exams");
        }
    }

    // Get a Exam by ID
    async getAExam(id, companyId, companyName) {
        try {
            const ExamModel = await getExamModel(companyId, companyName);
            if (!ExamModel) throw new Error("Exam model not found");
            return await ExamModel.findById(id);
        } catch (error) {
            console.error("Error fetching Exam by ID:", error);
            throw new Error("Failed to fetch Exam");
        }
    }

    // Update a Exam by ID
    async updateAExam(id, data, companyId, companyName) {
        try {
            const ExamModel = await getExamModel(companyId, companyName);
            if (!ExamModel) throw new Error("Exam model not found");
            return await ExamModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating Exam by ID:", error);
            throw new Error("Failed to update Exam");
        }
    }

    // Delete a Exam by ID
    async deleteAExam(id, companyId, companyName) {
        try {
            const ExamModel = await getExamModel(companyId, companyName);
            if (!ExamModel) throw new Error("Exam model not found");
            return await ExamModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting Exam by ID:", error);
            throw new Error("Failed to delete Exam");
        }
    }

    // Get exams by teacher ID
    async getExamsByTeacherId(teacherId, companyId, companyName) {
        try {
            const ExamModel = await getExamModel(companyId, companyName);
            if (!ExamModel) throw new Error("Exam model not found");
            return await ExamModel.find({ teacherId: teacherId });
        } catch (error) {
            console.error("Error fetching exams by teacher ID:", error);
            throw new Error("Failed to fetch exams by teacher ID");
        }
    }

    // Get exams by student ID
    async getExamsByStudentId(studentId, companyId, companyName) {
        try {
            const ExamModel = await getExamModel(companyId, companyName);
            if (!ExamModel) throw new Error("Exam model not found");
            return await ExamModel.find({ studentId: studentId });
        } catch (error) {
            console.error("Error fetching exams by student ID:", error);
            throw new Error("Failed to fetch exams by student ID");
        }
    }

    // Get exams by subject ID
    async getExamsBySubjectId(subjectId, companyId, companyName) {
        try {
            const ExamModel = await getExamModel(companyId, companyName);
            if (!ExamModel) throw new Error("Exam model not found");
            return await ExamModel.find({ subjectId: subjectId });
        } catch (error) {
            console.error("Error fetching exams by subject ID:", error);
            throw new Error("Failed to fetch exams by subject ID");
        }
    }

    // Get exams by date
    async getExamsByDate(date, companyId, companyName) {
        try {
            const ExamModel = await getExamModel(companyId, companyName);
            if (!ExamModel) throw new Error("Exam model not found");
            return await ExamModel.find({ date: date });
        } catch (error) {
            console.error("Error fetching exams by date:", error);
            throw new Error("Failed to fetch exams by date");
        }
    }
}