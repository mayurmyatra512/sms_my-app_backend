import mongoose from "mongoose";
import examResultSchema from "../models/examResult.schema.js";
import { dbName } from "../config/tenantManager.js";
import { getDbConnection } from "../config/mongodbconnection.js";
import examSchema from "../models/exam.schema.js";
import studentSchema from "../models/student.schema.js";
import subjectSchema from "../models/subject.schema.js";
import sectionSchema from "../models/section.schema.js";
import teacherSchema from "../models/teacher.schema.js";
import parentSchema from "../models/parent.schema.js";
import classSchema from "../models/class.schema.js";

// const ExamResultModel = mongoose.model("ExamResult", examResultSchema, "examResults");

// get a ExamResult Database Model
export const getExamResultModel = async (companyId, companyName) => {
    try {
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        schoolDb.model("Exam", examSchema, "exams");
        schoolDb.model("Student", studentSchema, "students");
        schoolDb.model("Subject", subjectSchema, "subjects");
        schoolDb.model("Section", sectionSchema, "sections");
        schoolDb.model("Teacher", teacherSchema, "teachers");
        schoolDb.model("Parent", parentSchema, "parents");
        schoolDb.model("Class", classSchema, "classes");

        return schoolDb.model(`ExamResult`, examResultSchema, `examResults`);
    } catch (error) {
        console.error("Error getting exam result model:", error);
        throw new Error("Failed to get exam result model");
    }
}




export default class ExamResultRepository {
    // Create a new ExamResult record
    async createExamResult(data, companyId, companyName) {
        try {
            const ExamResultModel = await getExamResultModel(companyId, companyName);
            if (!ExamResultModel) throw new Error("ExamResult model not found");

            const examResultInstance = new ExamResultModel(data);
            return await examResultInstance.save();
        } catch (error) {
            console.error("Error creating ExamResult:", error);
            throw new Error("Failed to create ExamResult");
        }
    }

    // Get all ExamResults
    async getAllExamResults(companyId, companyName) {
        try {
            const ExamResultModel = await getExamResultModel(companyId, companyName);
            if (!ExamResultModel) throw new Error("ExamResult model not found");

            const resp = await ExamResultModel.find()
                .populate({
                    path: "examId",
                    model: "Exam",
                    populate: [
                        { path: "classId", model: "Class" }
                    ]
                })
                .populate({
                    path: "studentId",
                    model: "Student",
                    populate: [
                        { path: "userId", model: "User" },
                        { path: "classId", model: "Class" },
                        { path: "sectionId", model: "Section" },
                        {
                            path: "parentId",
                            model: "Parent",
                            populate: { path: "userId", model: "User" }
                        }
                    ]
                })
                .populate({
                    path: "classId",
                    model: "Class"
                })
                // populate nested "subjects" array
                .populate({
                    path: "subjects.subjectId",
                    model: "Subject"
                })
                .populate({
                    path: "subjects.teacherId",
                    model: "Teacher",
                    populate: [
                        { path: "userId", model: "User" },
                        { path: "classId", model: "Class" },
                        { path: "sectionId", model: "Section" },
                    ]
                })
                .exec();

            // console.log("resp in repository of ExamResult = ", resp);
            return resp;
        } catch (error) {
            console.error("Error fetching ExamResults:", error);
            throw new Error("Failed to fetch ExamResults");
        }
    }

    // Get a ExamResult by ID
    async getAExamResult(id, companyId, companyName) {
        try {
            const ExamResultModel = await getExamResultModel(companyId, companyName);
            if (!ExamResultModel) throw new Error("ExamResult model not found");

            return await ExamResultModel.findById(id)
                .populate("examId")
                .populate("studentId")
                .populate("classId")
                .populate("subjects.subjectId")
                .populate("subjects.teacherId");
        } catch (error) {
            console.error("Error fetching ExamResult by ID:", error);
            throw new Error("Failed to fetch ExamResult");
        }
    }

    // Update a ExamResult by ID
    async updateAExamResult(id, data, companyId, companyName) {
        try {
            const ExamResultModel = await getExamResultModel(companyId, companyName);
            if (!ExamResultModel) throw new Error("ExamResult model not found");

            return await ExamResultModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating ExamResult by ID:", error);
            throw new Error("Failed to update ExamResult");
        }
    }

    // Delete a ExamResult by ID
    async deleteAExamResult(id, companyId, companyName) {
        try {
            const ExamResultModel = await getExamResultModel(companyId, companyName);
            if (!ExamResultModel) throw new Error("ExamResult model not found");

            return await ExamResultModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting ExamResult by ID:", error);
            throw new Error("Failed to delete ExamResult");
        }
    }

    // Get ExamResults by Student ID
    async getExamResultsByStudentId(studentId, companyId, companyName) {
        try {
            const ExamResultModel = await getExamResultModel(companyId, companyName);
            if (!ExamResultModel) throw new Error("ExamResult model not found");

             const resp = await ExamResultModel.find({ studentId })
                .populate("examId")
                .populate("subjects.subjectId")
                .populate("subjects.teacherId");

                return resp
        } catch (error) {
            console.error("Error fetching ExamResults by Student ID:", error);
            throw new Error("Failed to fetch ExamResults by Student ID");
        }
    }

    // Get ExamResults by Subject ID (inside subjects array)
    async getExamResultsBySubjectId(subjectId, companyId, companyName) {
        try {
            const ExamResultModel = await getExamResultModel(companyId, companyName);
            if (!ExamResultModel) throw new Error("ExamResult model not found");

            return await ExamResultModel.find({ "subjects.subjectId": subjectId })
                .populate("examId")
                .populate("studentId")
                .populate("subjects.subjectId")
                .populate("subjects.teacherId");
        } catch (error) {
            console.error("Error fetching ExamResults by Subject ID:", error);
            throw new Error("Failed to fetch ExamResults by Subject ID");
        }
    }

    // Get ExamResults by Date (assuming examId has a date field)
    async getExamResultsByDate(date, companyId, companyName) {
        try {
            const ExamResultModel = await getExamResultModel(companyId, companyName);
            if (!ExamResultModel) throw new Error("ExamResult model not found");

            // assuming examId has `date` field
            return await ExamResultModel.find()
                .populate({
                    path: "examId",
                    match: { date: date }, // filter inside populate
                })
                .populate("studentId")
                .populate("subjects.subjectId")
                .populate("subjects.teacherId");
        } catch (error) {
            console.error("Error fetching ExamResults by date:", error);
            throw new Error("Failed to fetch ExamResults by date");
        }
    }

    async addResults(examResults, companyId, companyName){
         try {
            const ExamResultModel = await getExamResultModel(companyId, companyName);
            if (!ExamResultModel) throw new Error("ExamResult model not found");
             
            const savedResults = await ExamResultModel.insertMany(examResults);
            return savedResults;
            
        } catch (error) {
            console.error("Error fetching ExamResults by date:", error);
            throw new Error("Failed to fetch ExamResults by date");
        }
    }
}

// export default class ExamResultRepository {

//     // Create a new ExamResult record
//     async createExamResult(data, companyId, companyName) {
//         try {
//             const ExamResultModel = await getExamResultModel(companyId, companyName);
//             if (!ExamResultModel) throw new Error("ExamResult model not found");
//             // Create a new exam result instance
//             const examResultInstance = new ExamResultModel(data);
//             return await examResultInstance.save();
//         } catch (error) {
//             console.error("Error creating ExamResult:", error);
//             throw new Error("Failed to create ExamResult");
//         }
//     }

//     // Get all ExamResults
//     async getAllExamResults(companyId, companyName) {
//         try {
//             const ExamResultModel = await getExamResultModel(companyId, companyName);
//             if (!ExamResultModel) throw new Error("ExamResult model not found");
//             const resp = await ExamResultModel.find()
//                 .populate({
//                     path: "examId",
//                     model: "Exam",
//                     populate:[
//                         { path: "classId",model: "Class" },
//                         { path: "subjectId",model: "Subject" },
//                     ]
//                 })
//                 .populate({
//                     path: "studentId",
//                     model: "Student",
//                     populate: [
//                         { path: "userId", model: "User" },
//                         { path: "classId", model: "Class" },
//                         { path: "sectionId", model: "Section" },
//                         {
//                             path: "parentId",
//                             model: "Parent",
//                             populate: { path: "userId", model: "User" }
//                         }
//                     ]
//                 })
//                 .populate({
//                     path: "subjectId",
//                     model: "Subject"
//                 })
//                 .populate({
//                     path: "classId",
//                     model: "Class"
//                 })
//                 .populate({
//                     path: "teacherId",
//                     model: "Teacher",
//                     populate:[
//                         { path: "userId", model: "User" },
//                         { path: "classId", model: "Class" },
//                         { path: "sectionId", model: "Section" },
//                     ]
//                 })
//                 .exec();

//             console.log("resp in repository of eResult = ", resp)
//             return resp
//         } catch (error) {
//             console.error("Error fetching ExamResults:", error);
//             throw new Error("Failed to fetch ExamResults");
//         }
//     }

//     // Get a ExamResult by ID
//     async getAExamResult(id, companyId, companyName) {
//         try {
//             const ExamResultModel = await getExamResultModel(companyId, companyName);
//             if (!ExamResultModel) throw new Error("ExamResult model not found");
//             return await ExamResultModel.findById(id);
//         } catch (error) {
//             console.error("Error fetching ExamResult by ID:", error);
//             throw new Error("Failed to fetch ExamResult");
//         }
//     }

//     // Update a ExamResult by ID
//     async updateAExamResult(id, data, companyId, companyName) {
//         try {
//             const ExamResultModel = await getExamResultModel(companyId, companyName);
//             if (!ExamResultModel) throw new Error("ExamResult model not found");
//             return await ExamResultModel.findByIdAndUpdate(id, data, { new: true });
//         } catch (error) {
//             console.error("Error updating ExamResult by ID:", error);
//             throw new Error("Failed to update ExamResult");
//         }
//     }
//     // Delete a ExamResult by ID
//     async deleteAExamResult(id, companyId, companyName) {
//         try {
//             const ExamResultModel = await getExamResultModel(companyId, companyName);
//             if (!ExamResultModel) throw new Error("ExamResult model not found");
//             return await ExamResultModel.findByIdAndDelete(id);
//         } catch (error) {
//             console.error("Error deleting ExamResult by ID:", error);
//             throw new Error("Failed to delete ExamResult");
//         }
//     }
//     // Get ExamResults by Student ID
//     async getExamResultsByStudentId(studentId, companyId, companyName) {
//         try {
//             const ExamResultModel = await getExamResultModel(companyId, companyName);
//             if (!ExamResultModel) throw new Error("ExamResult model not found");
//             return await ExamResultModel.find({ studentId });
//         } catch (error) {
//             console.error("Error fetching ExamResults by Student ID:", error);
//             throw new Error("Failed to fetch ExamResults by Student ID");
//         }
//     }
//     // Get ExamResults by Subject ID
//     async getExamResultsBySubjectId(subjectId, companyId, companyName) {
//         try {
//             const ExamResultModel = await getExamResultModel(companyId, companyName);
//             if (!ExamResultModel) throw new Error("ExamResult model not found");
//             return await ExamResultModel.find({ subjectId });
//         } catch (error) {
//             console.error("Error fetching ExamResults by Subject ID:", error);
//             throw new Error("Failed to fetch ExamResults by Subject ID");
//         }
//     }
//     // Get ExamResults by Date
//     async getExamResultsByDate(date, companyId, companyName) {
//         try {
//             const ExamResultModel = await getExamResultModel(companyId, companyName);
//             if (!ExamResultModel) throw new Error("ExamResult model not found");
//             return await ExamResultModel.find({ date });
//         } catch (error) {
//             console.error("Error fetching ExamResults by date:", error);
//             throw new Error("Failed to fetch ExamResults by date");
//         }
//     }
// }