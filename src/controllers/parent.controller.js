import { getParentIdByName, getSchoolIdByName } from "../config/helper.js";
import { getDataByToken } from "../config/jwtops.js";
import ParentRepository from "../repositories/parent.repository.js";

export default class ParentController {
    constructor() {
        this.parentRepository = new ParentRepository()
    }

    //Create a new Parent 
    async createParent(req, res) {
        try {
            const parentData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            parentData.userId = await getParentIdByName(parentData.firstName, decoded.schoolId, decoded.schoolName)
            parentData.schoolId = await getSchoolIdByName(parentData.schoolName, decoded.schoolId, decoded.schoolName);
            const parent = await this.parentRepository.createParent(parentData, decoded.schoolId, decoded.schoolName);
            res.status(201).json({ success: true, data: parent });
        } catch (error) {
            console.log("Error in controller: ", error)
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Get All Parents
    async getAllParents(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const parents = await this.parentRepository.getAllParents(decoded.schoolId, decoded.schoolName);
            res.json({ success: true, data: parents });
        } catch (error) {
            console.log("Error in controller: ", error)
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Get a Parent By Id
    async getParentById(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const parent = await this.parentRepository.getParentById(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!parent) return res.status(404).json({ success: false, message: "Parent not found" });
            res.json({ success: true, data: parent });
        } catch (error) {
            console.log("Error in controller: ", error)
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Update a Parent
    async updateParent(req, res) {
        try {
            const updatedData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            updatedData.userId = await getParentIdByName(updatedData.firstName, decoded.schoolId, decoded.schoolName)
            updatedData.schoolId = await getSchoolIdByName(updatedData.schoolName, decoded.schoolId, decoded.schoolName);
            const updatedParent = await this.parentRepository.updateParent(req.params.id, updatedData, decoded.schoolId, decoded.schoolName);
            if (!updatedParent) return res.status(404).json({ success: false, message: "Parent not found" });
            res.json({ success: true, data: updatedParent });
        } catch (error) {
            console.log("Error in controller: ", error)
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Delet a Parent
    async deleteParent(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const deletedParent = await this.parentRepository.deleteParent(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!deletedParent) return res.status(404).json({ success: false, message: "Parent not found" });
            res.json({ success: true, message: "Parent deleted successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}