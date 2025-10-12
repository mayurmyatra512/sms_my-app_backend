
import mongoose from "mongoose";
import sectionSchema from "../models/section.schema.js";
import { dbName } from "../config/tenantManager.js";
import { getDbConnection } from "../config/mongodbconnection.js";
import classSchema from "../models/class.schema.js";


// // Get the  model from masterdb
// const schoolModel = mongoose.model("School", schoolSchema, "schools");

// get a Section Database Model
export const getSectionModel = async (companyId, companyName) => {
    try {
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        schoolDb.model("Class", classSchema, "classes");
        return schoolDb.model(`Section`, sectionSchema, `sections`);
    } catch (error) {
        console.error("Error getting section model:", error);
        throw new Error("Failed to get section model");
    }
}


export default class SectionRepository {
    // Create a new Section record
     async createSection(data, companyId, companyName) {
        try {
            const sectionModel = await getSectionModel(companyId, companyName);
            if (!sectionModel) throw new Error("section model not found");
            // Create a new section instance
            const sectionInstance = new sectionModel(data);
            return await sectionInstance.save();
        } catch (error) {
            console.error("Error creating section:", error);
            throw new Error("Failed to create section");
        }
    }

    // Get all Sections
     async getAllSections(companyId, companyName) {
        try {
            const sectionModel = await getSectionModel(companyId, companyName);
            if (!sectionModel) throw new Error("section model not found");
            return await sectionModel.find();
        } catch (error) {
            console.error("Error fetching sections:", error);
            throw new Error("Failed to fetch sections");
        }
    }

    // Get a Section by ID
     async getASection(id, companyId, companyName) {
        try {
            const sectionModel = await getSectionModel(companyId, companyName);
            if (!sectionModel) throw new Error("section model not found");
            return await sectionModel.findById(id);
        } catch (error) {
            console.error("Error fetching section by ID:", error);
            throw new Error("Failed to fetch section");
        }
    }

    // Update a Section by ID
     async updateASection(id, data, companyId, companyName) {
        try {
            const sectionModel = await getSectionModel(companyId, companyName);
            if (!sectionModel) throw new Error("section model not found");
            return await sectionModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating section by ID:", error);
            throw new Error("Failed to update section");
        }
    }

    // Delete a Section by ID
     async deleteASection(id, companyId, companyName) {
        try {
            const sectionModel = await getSectionModel(companyId, companyName);
            if (!sectionModel) throw new Error("section model not found");
            return await sectionModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting section by ID:", error);
            throw new Error("Failed to delete section");
        }
    }
    // Get a Section by Teacher ID
     async getSectionByTeacherId(teacherId, companyId, companyName) {
        try {
            const sectionModel = await getSectionModel(companyId, companyName);
            if (!sectionModel) throw new Error("section model not found");
            return await sectionModel.find({ secTeacherId: teacherId });
        } catch (error) {
            console.error("Error fetching section by ID:", error);
            throw new Error("Failed to fetch section");
        }
    }
    // Get a Section by School
     async getSectionBySchool(schoolId, companyId, companyName) {
        try {
            const sectionModel = await getSectionModel(companyId, companyName);
            if (!sectionModel) throw new Error("section model not found");
            return await sectionModel.find({ schoolId });
        } catch (error) {
            console.error("Error fetching section by ID:", error);
            throw new Error("Failed to fetch section");
        }
    }
    //add Sections
        async addSections(sections, companyId, companyName) {
            try {
                // insertMany handles bulk insert
                const SectionModel = await getSectionModel(companyId, companyName);
                if (!SectionModel) throw new Error("Section model not found");
                const savedSubjects = await SectionModel.insertMany(sections, { ordered: false });
                return savedSubjects;
            } catch (error) {
                throw new Error("Error adding sections: " + error.message);
            }
        }
}
