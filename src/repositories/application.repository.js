import { getDbConnection } from "../config/mongodbconnection.js";
import { dbName } from "../config/tenantManager.js";
import applicationSchema from "../models/application.schema.js";

// get a Application Database Model
export const getApplicationModel = async (companyId, companyName) => {
    try {
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        return schoolDb.model(`Application`, applicationSchema, `applications`);
    } catch (error) {
        console.error("Error getting application model:", error);
        throw new Error("Failed to get application model");
    }
}

export default class ApplicationRepository {
    // Create a new Application record
    async createApplication(data, companyId, companyName) {
        try {
            const ApplicationModel = await getApplicationModel(companyId, companyName);
            if (!ApplicationModel) throw new Error("application model not found");
            // Create a new application instance
            const applicationInstance = new ApplicationModel(data);
            return await applicationInstance.save();
        } catch (error) {
            console.error("Error creating application:", error);
            throw new Error("Failed to create application");
        }
    }

    // Get all Applications
    async getAllApplications(companyId, companyName) {
        const ApplicationModel = await getApplicationModel(companyId, companyName);
        if (!ApplicationModel) throw new Error("Application model not found");
        return ApplicationModel.find().populate("schoolId");
    }

    // Get a Application by Id
    async getApplicationById(id, companyId, companyName){
        const ApplicationModel = await getApplicationModel(companyId, companyName);
        if (!ApplicationModel) throw new Error("Application model not found");
        return ApplicationModel.findById(id).populate("schoolId");
    }

    // Update a Application using Id
    async updateApplication(id, updateData, companyId, companyName){
        const ApplicationModel = await getApplicationModel(companyId, companyName);
        if (!ApplicationModel) throw new Error("Application model not found");
        return ApplicationModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    // Delete a Application
    async deleteApplication(id, companyId, companyName){
        const ApplicationModel = await getApplicationModel(companyId, companyName);
        if (!ApplicationModel) throw new Error("Application model not found");
        return ApplicationModel.findByIdAndDelete(id);
    }
    //updateApplicationStatus
    async updateApplicationStatus(id, status, companyId, companyName){
        const ApplicationModel = await getApplicationModel(companyId, companyName);
        if (!ApplicationModel) throw new Error("Application model not found");
        return ApplicationModel.findByIdAndUpdate(id, {status: status, documents: "Complete"});
    }
    //add Multiple Applications
    async createMultipleApplications(data, companyId, companyName){
        try {
            const ApplicationModel = await getApplicationModel(companyId, companyName);
            if (!ApplicationModel) throw new Error("application model not found");
            // Create a new application instance
            // const applicationInstance = new ApplicationModel(data);
            return await ApplicationModel.insertMany(data, { ordered: false });
        } catch (error) {
            console.error("Error creating application:", error);
            throw new Error("Failed to create application");
        }
    }
}