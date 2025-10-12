
import mongoose from "mongoose";
import schoolSchema from "../models/schools.schema.js";
import { createSchoolDatabase } from "../config/tenantManager.js";

// Get the School model from masterdb
const schoolModel = mongoose.model("School", schoolSchema, "schools");


export default class SchoolRepository {
    // Create a new school
     async createSchool(data) {
        try {
            const school = new schoolModel(data);
            // console.log("Scool in repository =  ",school)
            createSchoolDatabase(school); // Ensure the school database is created
            return await school.save();
        } catch (error) {
            console.error("Error creating school:", error);
            throw new Error("Failed to create school");
        }
    }

    // Get all schools
     async getAllSchools() {
        try {
             return await schoolModel.find();
        } catch (error) {
            console.error("Error fetching schools:", error);
            throw new Error("Failed to fetch schools");   
        }
    }

    // Get a school by ID
     async getSchoolById(id) {
        try {
            return await schoolModel.findById(id);
        } catch (error) {
            console.error("Error fetching school by ID:", error);
            throw new Error("Failed to fetch school");
        }
    }

    // Update a school by ID
     async updateSchool(id, data) {
        try {
            return await schoolModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating school:", error);
            throw new Error("Failed to update school");
        }
    }

    // Delete a school by ID
     async deleteSchool(id) {
        try {
            return await schoolModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting school:", error);
            throw new Error("Failed to delete school");
        }
    }
};
