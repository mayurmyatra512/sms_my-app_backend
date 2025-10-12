import mongoose from "mongoose";
import subjectSchema from "../models/subject.schema.js";
import { dbName } from "../config/tenantManager.js";
import { getDbConnection } from "../config/mongodbconnection.js";
import classSchema from "../models/class.schema.js";

// const SubjectModel = mongoose.model("Subject", subjectSchema, "subjects");

// get a Subject Database Model
export const getSubjectModel = async (companyId, companyName) => {
    try {
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        schoolDb.model("Class", classSchema, "classes");
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        return schoolDb.model(`Subject`, subjectSchema, `subjects`);
    } catch (error) {
        console.error("Error getting Subject model:", error);
        throw new Error("Failed to get Subject model");
    }
}
export default class SubjectRepository {
    // Create a new Subject record
     async createSubject(data, companyId, companyName) {
        try {
            // console.log("Data = ", data);
            const SubjectModel = await getSubjectModel(companyId, companyName);
            if (!SubjectModel) throw new Error("Subject model not found");
            // Create a new subject instance
            const subjectInstance = new SubjectModel(data);
            return await subjectInstance.save();
        } catch (error) {
            console.error("Error creating Subject:", error);
            throw new Error("Failed to create Subject");
        }
    }

    // Get all Subjects
     async getAllSubjects(companyId, companyName) {
        try {
            const SubjectModel = await getSubjectModel(companyId, companyName);
            if (!SubjectModel) throw new Error("Subject model not found");
            const resp =  await SubjectModel.find()
                        .populate("classId", "name code")
                        .exec();
            return resp
            
        } catch (error) {
            console.error("Error fetching Subjects:", error);
            throw new Error("Failed to fetch Subjects");
        }
    }

    // Get a Subject by ID
     async getASubject(id, companyId, companyName) {
        try {
            const SubjectModel = await getSubjectModel(companyId, companyName);
            if (!SubjectModel) throw new Error("Subject model not found");
            return await SubjectModel.findById(id);
        } catch (error) {
            console.error("Error fetching Subject by ID:", error);
            throw new Error("Failed to fetch Subject");
        }
    }

    // Update a Subject by ID
     async updateASubject(id, data, companyId, companyName) {
        try {
            const SubjectModel = await getSubjectModel(companyId, companyName);
            if (!SubjectModel) throw new Error("Subject model not found");
            return await SubjectModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating Subject by ID:", error);
            throw new Error("Failed to update Subject");
        }
    }
    // Delete a Subject by ID
     async deleteASubject(id, companyId, companyName) {
        try {
            const SubjectModel = await getSubjectModel(companyId, companyName);
            if (!SubjectModel) throw new Error("Subject model not found");
            return await SubjectModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting Subject by ID:", error);
            throw new Error("Failed to delete Subject");
        }
    }
    // Search Subject by Name
     async searchSubjectsByName(name, companyId, companyName){
        try {
            const SubjectModel = await getSubjectModel(companyId, companyName);
            if (!SubjectModel) throw new Error("Subject model not found");
            return await SubjectModel.find({name});
        } catch (error) {
             console.error("Error While Searching By Name:", error);
            throw new Error("Failed to search by name");
        }
    }
    // Search Subject by Code
     async searchSubjectsByCode(code, companyId, companyName){
        try {
            const SubjectModel = await getSubjectModel(companyId, companyName);
            if (!SubjectModel) throw new Error("Subject model not found");
            return await SubjectModel.find({code});
        } catch (error) {
             console.error("Error While Searching By Code:", error);
            throw new Error("Failed to search by Code");
        }
    }
    // Search Subject by Class
     async searchSubjectsByClass(classId, companyId, companyName){
        try {
            const SubjectModel = await getSubjectModel(companyId, companyName);
            if (!SubjectModel) throw new Error("Subject model not found");
            return await SubjectModel.find({classId});
        } catch (error) {
             console.error("Error While Searching By Class Id:", error);
            throw new Error("Failed to search by Class Id");
        }
    }

    //add Subjects
    async addSubjects(subjects, companyId, companyName) {
        try {
            // insertMany handles bulk insert
            const SubjectModel = await getSubjectModel(companyId, companyName);
            if (!SubjectModel) throw new Error("Subject model not found");
            const savedSubjects = await SubjectModel.insertMany(subjects, { ordered: false });
            // console.log({subjects, savedSubjects});
            return savedSubjects;
        } catch (error) {
            throw new Error("Error adding subjects: " + error.message);
        }
    }
}