
import { getDbConnection } from "../config/mongodbconnection.js";
import { dbName } from "../config/tenantManager.js";
import AssignmentSchema from "../models/assignment.schema.js";
import classSchema from "../models/class.schema.js";
import sectionSchema from "../models/section.schema.js";
import studentSchema from "../models/student.schema.js";
import subjectSchema from "../models/subject.schema.js";


// Get Attendance model for tenant (school)
export const getAssignmentModel = async (companyId, companyName) => {
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
        schoolDb.model("Subject", subjectSchema, "subjects")
        return schoolDb.model("Assignment", AssignmentSchema, "assignments");
    } catch (error) {
        console.error("Error getting assignment model:", error);
        throw new Error("Failed to get assignment model");
    }
};

export class AssignmentRepository {

    // Create a new assignment
    async createAssignment(data, companyId, companyName) {
        const Assignment = await getAssignmentModel(companyId, companyName);
        if (!Assignment) {
            throw Error("Assignment Model Not Found");
        }
        const assignment = new Assignment(data);
        return await assignment.save();
    }

    // Get assignments by teacher
    async getAssignmentsByTeacher(teacherId, companyId, companyName) {
        const Assignment = await getAssignmentModel(companyId, companyName);
        if (!Assignment) {
            throw Error("Assignment Model Not Found");
        }
        return await Assignment.find({ teacherId })
            .populate('classId', 'name')
            .populate('sectionId', 'name')
            .populate('subjectId', 'name code')
           .populate('submissions.studentId', 'fullName')
            .lean();
    }

    // Get assignments by class
    async getAssignmentsByClass(classId, sectionId, companyId, companyName) {
        const Assignment = await getAssignmentModel(companyId, companyName);
        if (!Assignment) {
            throw Error("Assignment Model Not Found");
        }
        return await Assignment.find({ classId, sectionId })
            .populate('subjectId', 'name code')
           .populate('submissions.studentId', 'fullName')
            .lean();
    }

    // Update assignment by ID
    async updateAssignment(assignmentId, data, companyId, companyName) {
        const Assignment = await getAssignmentModel(companyId, companyName);
        if (!Assignment) {
            throw Error("Assignment Model Not Found");
        }
        return await Assignment.findByIdAndUpdate(assignmentId, data, { new: true });
    }

    // Add or update a student's submission
    async updateSubmission(assignmentId, studentId, submissionData) {
        const Assignment = await getAssignmentModel(companyId, companyName);
        if (!Assignment) {
            throw Error("Assignment Model Not Found");
        }
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) throw new Error("Assignment not found");

        const submissionIndex = assignment.submissions.findIndex(s => s.studentId.toString() === studentId);
        if (submissionIndex >= 0) {
            // Update existing submission
            assignment.submissions[submissionIndex] = { ...assignment.submissions[submissionIndex], ...submissionData };
        } else {
            // Add new submission
            assignment.submissions.push({ studentId, ...submissionData });
        }

        return await assignment.save();
    }

    // Delete assignment
    async deleteAssignment(assignmentId, companyId, companyName) {
        const Assignment = await getAssignmentModel(companyId, companyName);
        if (!Assignment) {
            throw Error("Assignment Model Not Found");
        }
        return await Assignment.findByIdAndDelete(assignmentId);
    }
}
