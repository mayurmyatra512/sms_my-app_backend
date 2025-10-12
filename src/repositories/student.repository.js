import mongoose from "mongoose";
import studentSchema from "../models/student.schema.js";
import { dbName } from "../config/tenantManager.js";
import { getDbConnection } from "../config/mongodbconnection.js";
import classSchema from "../models/class.schema.js";
import sectionSchema from "../models/section.schema.js";
import parentSchema from "../models/parent.schema.js";
import { UserModel } from "../config/helper.js";
import { getParentModel } from "./parent.repository.js";

// const StudentModel = mongoose.model("Student", studentSchema, "students");

// get a Student Database Model
export const getStudentModel = async (companyId, companyName) => {
    try {
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        schoolDb.model("Class", classSchema, "classes");
        schoolDb.model("Section", sectionSchema, "sections");
        schoolDb.model("Parent", parentSchema, "parents");
        return schoolDb.model(`Student`, studentSchema, `students`);
    } catch (error) {
        console.error("Error getting student model:", error);
        throw new Error("Failed to get student model");
    }
}

export default class StudentRepository {
    // Create a new Student record
    async createStudent(data, companyId, companyName) {
        try {
            // console.log("Student data: ", data);
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            // Create a new student instance
            const studentInstance = new StudentModel(data);
            return await studentInstance.save();
        } catch (error) {
            console.error("Error creating Student:", error);
            throw new Error("Failed to create Student");
        }
    }

    // Get all Students
    async getAllStudents(companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");

            const db = await dbName(companyName, companyId);
            const schoolDb = getDbConnection(db);

            // Register referenced models on this connection
            schoolDb.model("Class", classSchema, "classes");
            schoolDb.model("Section", sectionSchema, "sections"); // If you have this
            // schoolDb.model("User", userSchema, "users");
            schoolDb.model("Parent", parentSchema, "parents"); // If parent is a user
            // schoolDb.model("School", schoolSchema, "schools");


            const resp = await StudentModel.find()
                .populate("userId")
                .populate("classId", "name")
                .populate("sectionId", "name")
                .populate({
                    path: "parentId",
                    populate: {
                        path: "userId",
                        // model: UserModel
                    }

                })
                .populate("schoolId", "name")
                .exec();
            // console.log("New Students fetched: ", resp);
            return resp;
        } catch (error) {
            console.error("Error fetching Students:", error);
            throw new Error("Failed to fetch Students");
        }
    }

    // Get a Student by ID
    async getAStudent(id, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.findById(id);
        } catch (error) {
            console.error("Error fetching Student by ID:", error);
            throw new Error("Failed to fetch Student");
        }
    }

    // Update a Student by ID
    async updateAStudent(id, data, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating Student by ID:", error);
            throw new Error("Failed to update Student");
        }
    }
    // Delete a Student by ID
    async deleteAStudent(id, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting Student by ID:", error);
            throw new Error("Failed to delete Student");
        }
    }
    // Get Students by Class
    async getStudentsByClass(classId, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.find({ classId });
        } catch (error) {
            console.error("Error fetching Students by Class:", error);
            throw new Error("Failed to fetch Students by Class");
        }
    }
    // Get Students by Section
    async getStudentsBySection(sectionId, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.find({ sectionId });
        } catch (error) {
            console.error("Error fetching Students by Section:", error);
            throw new Error("Failed to fetch Students by Section");
        }
    }
    // Get Students by Name
    async getStudentsByName(userId, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.find({ userId });
        } catch (error) {
            console.error("Error fetching Students by Name:", error);
            throw new Error("Failed to fetch Students by Name");
        }
    }
    // Get Students by roll Number
    async getStudentsByRollNumber(rollNumber, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.find({ rollNumber });
        } catch (error) {
            console.error("Error fetching Students by Roll Number:", error);
            throw new Error("Failed to fetch Students by Roll Number");
        }
    }
    // Get Students by class and section
    async getStudentsByClassAndSection(classId, sectionId, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.find({ classId, sectionId });
        } catch (error) {
            console.error("Error fetching Students by Class and Section:", error);
            throw new Error("Failed to fetch Students by Class and Section");
        }
    }
    // Get Students by admission Number
    async getStudentsByAdmissionNumber(admissionNumber, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.find({ admissionNumber });
        } catch (error) {
            console.error("Error fetching Students by Admission Number:", error);
            throw new Error("Failed to fetch Students by Admission Number");
        }
    }
    // Get Students by Status
    async getStudentsByStatus(status, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.find({ status });
        } catch (error) {
            console.error("Error fetching Students by Status:", error);
            throw new Error("Failed to fetch Students by Status");
        }
    }
    // Get Students by Gender
    async getStudentsByGender(gender, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.find({ gender });
        } catch (error) {
            console.error("Error fetching Students by Gender:", error);
            throw new Error("Failed to fetch Students by Gender");
        }
    }
    // Get Students by DateOfBirth
    async getStudentsByDateOfBirth(dateOfBirth, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.find({ dateOfBirth });
        } catch (error) {
            console.error("Error fetching Students by Date Of Birth:", error);
            throw new Error("Failed to fetch Students by Date Of Birth");
        }
    }
    // Get Students by Parent
    async getStudentsByParent(parentId, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.find({ parentId });
        } catch (error) {
            console.error("Error fetching Students by Parent:", error);
            throw new Error("Failed to fetch Students by Parent");
        }
    }
    // Get Students by School
    async getStudentsBySchool(schoolId, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.find({ schoolId });
        } catch (error) {
            console.error("Error fetching Students by School:", error);
            throw new Error("Failed to fetch Students by School");
        }
    }
    // Get Students by Blood Group
    async getStudentsByBloodGroup(bloodGroup, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.find({ bloodGroup });
        } catch (error) {
            console.error("Error fetching Students by Blood Group:", error);
            throw new Error("Failed to fetch Students by Blood Group");
        }
    }
    // Get a Student by userID
    async getStudentByUserId(userId, companyId, companyName) {
        try {
            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");
            return await StudentModel.findOne({ userId: userId })
                .populate("classId", "name")
                .populate("sectionId", "name")
                .populate("parentId", "userId")
                .populate("userId")
                .exec();


        } catch (error) {
            console.error("Error fetching Student by ID:", error);
            throw new Error("Failed to fetch Student");
        }
    }
    // Get a Children by parentID
    async getChildrenByParentId(parentId, companyId, companyName) {
        try {

            const StudentModel = await getStudentModel(companyId, companyName);
            if (!StudentModel) throw new Error("Student model not found");

            const Parent = await getParentModel(companyId, companyName);
            if (!Parent) throw new Error("Student model not found");

            // Step 1: Find parent document by userId
            const parent = await Parent.findOne({ userId: parentId });
            if (!parent) throw new Error("Parent not found");

            // Step 2: Find all students linked to this parentId
            const students = await StudentModel.find({ parentId: parent._id }).select("_id userId");
            console.log("Repository for Children = ",students);
            return students.map(s => s._id); // or return students if you need more info
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async countStudents(schoolId, schoolName) {
        const StudentModel = await getStudentModel(schoolId, schoolName);
            if (!StudentModel) throw new Error("Student model not found");
    return await StudentModel.countDocuments({ schoolId });
  }

  static async getRecentStudents(schoolId, schoolName) {
    const StudentModel = await getStudentModel(schoolId, schoolName);
            if (!StudentModel) throw new Error("Student model not found");
    return await StudentModel.find({ schoolId }).sort({ createdAt: -1 }).limit(5);
  }
}