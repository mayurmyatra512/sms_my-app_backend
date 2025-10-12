import { getDbConnection } from "../config/mongodbconnection.js";
import { dbName } from "../config/tenantManager.js";
import parentSchema from "../models/parent.schema.js";

// get a Parent Database Model
export const getParentModel = async (companyId, companyName) => {
    try {
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        return schoolDb.model(`Parent`, parentSchema, `parents`);
    } catch (error) {
        console.error("Error getting parent model:", error);
        throw new Error("Failed to get parent model");
    }
}

export default class ParentRepository {
    // Create a new Parent record
    async createParent(data, companyId, companyName) {
        try {
            // console.log("Parent data: ", data);
            const ParentModel = await getParentModel(companyId, companyName);
            if (!ParentModel) throw new Error("parent model not found");
            // Create a new parent instance
            const parentInstance = new ParentModel(data);
            return await parentInstance.save();
        } catch (error) {
            console.error("Error creating parent:", error);
            throw new Error("Failed to create parent");
        }
    }

    // Get all Parents
    async getAllParents(companyId, companyName) {
        const ParentModel = await getParentModel(companyId, companyName);
        if (!ParentModel) throw new Error("Parent model not found");
        return ParentModel.find().populate("userId").populate("schoolId");
    }

    // Get a Parent by Id
    async getParentById(id, companyId, companyName){
        const ParentModel = await getParentModel(companyId, companyName);
        if (!ParentModel) throw new Error("Parent model not found");
        return ParentModel.findById(id).populate("userId").populate("schoolId");
    }

    // Update a Parent using Id
    async updateParent(id, updateData, companyId, companyName){
        const ParentModel = await getParentModel(companyId, companyName);
        if (!ParentModel) throw new Error("Parent model not found");
        return ParentModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    // Delete a Parent
    async deleteParent(id, companyId, companyName){
        const ParentModel = await getParentModel(companyId, companyName);
        if (!ParentModel) throw new Error("Parent model not found");
        return ParentModel.findByIdAndDelete(id);
    }
}