import { getSchoolIdByName } from "../config/helper.js";
import { getDataByToken } from "../config/jwtops.js";
import ApplicationRepository from "../repositories/application.repository.js";

export default class ApplicationController {
    constructor() {
        this.applicationRepository = new ApplicationRepository()
    }

    //Create a new Application 
    async createApplication(req, res) {
        try {
            const applicationData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            applicationData.schoolId = decoded.schoolId;
            applicationData.studentFirstName = applicationData.firstName;
            applicationData.studentLastName = applicationData.lastName;

            const application = await this.applicationRepository.createApplication(applicationData, decoded.schoolId, decoded.schoolName);
            res.status(201).json({ success: true, data: application });
        } catch (error) {
            console.log("Error in controller: ", error)
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Get All Applications
    async getAllApplications(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const applications = await this.applicationRepository.getAllApplications(decoded.schoolId, decoded.schoolName);
            res.json({ success: true, data: applications });
        } catch (error) {
            console.log("Error in controller: ", error)
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Get a Application By Id
    async getApplicationById(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const application = await this.applicationRepository.getApplicationById(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!application) return res.status(404).json({ success: false, message: "application not found" });
            res.json({ success: true, data: application });
        } catch (error) {
            console.log("Error in controller: ", error)
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Update a Application
    async updateApplication(req, res) {
        try {
            const updatedData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            // updatedData.schoolId = await getSchoolIdByName(updatedData.schoolName, decoded.schoolId, decoded.schoolName);
            const updatedApplication = await this.applicationRepository.updateApplication(req.params.id, updatedData, decoded.schoolId, decoded.schoolName);
            if (!updatedApplication) return res.status(404).json({ success: false, message: "Parent not found" });
            res.json({ success: true, data: updatedApplication });
        } catch (error) {
            console.log("Error in controller: ", error)
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Delete a Application
    async deleteApplication(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const deletedApplication = await this.applicationRepository.deleteApplication(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!deletedApplication) return res.status(404).json({ success: false, message: "Parent not found" });
            res.json({ success: true, message: "Application deleted successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Update a Application
    async updateApplicationStatus(req, res) {
        try {
            const status = req.body.status;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const updatedApplicationStatus = await this.applicationRepository.updateApplicationStatus(req.params.id, status, decoded.schoolId, decoded.schoolName);
            if (!updatedApplicationStatus) return res.status(404).json({ success: false, message: "Parent not found" });
            res.json({ success: true, data: updatedApplicationStatus });
        } catch (error) {
            console.log("Error in controller: ", error)
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //add Multiple Applications
    async createMultipleApplications(req, res){
         try {
            const applicationData = req.body.applications;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            applicationData.schoolId = decoded.schoolId;
            const application = await this.applicationRepository.createMultipleApplications(applicationData, decoded.schoolId, decoded.schoolName);
            res.status(201).json({ success: true, data: application });
        } catch (error) {
            console.log("Error in controller: ", error)
            res.status(500).json({ success: false, message: error.message });
        }
    }

}