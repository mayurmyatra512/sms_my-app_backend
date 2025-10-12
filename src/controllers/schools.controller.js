import SchoolRepository from "../repositories/schools.repository.js";
// import { createSchoolDatabase } from "../config/tenantManager.js";

export default class SchoolsController {

    constructor() {
        this.schoolRepository = new SchoolRepository();
    }

    // Create a new school
    async createSchool(req, res) {
        try {
            const schoolData = req.body;
            const school = await this.schoolRepository.createSchool(schoolData);
            if (!school) {
                return res.status(400).json({ message: "Failed to create school" });
            }
            // Create the school database after saving the school
            // createSchoolDatabase(school.name);
            res.status(201).json(school);
        } catch (error) {
            console.error("Error creating school:", error);
            res.status(500).json({ message: "Failed to create school" });
        }
    }

    // Get all schools
    async getAllSchools(req, res) {
        try {
            const schools = await this.schoolRepository.getAllSchools();
            res.status(200).json(schools);
        } catch (error) {
            console.error("Error fetching schools:", error);
            res.status(500).json({ message: "Failed to fetch schools" });
        }
    }

    // Get a school by ID
    async getSchoolById(req, res) {
        try {
            const { id } = req.params;
            const school = await this.schoolRepository.getSchoolById(id);
            if (!school) {
                return res.status(404).json({ message: "School not found" });
            }
            res.status(200).json(school);
        } catch (error) {
            console.error("Error fetching school by ID:", error);
            res.status(500).json({ message: "Failed to fetch school" });
        }
    }

    // Update a school by ID
    async updateSchool(req, res) {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            const updatedSchool = await this.schoolRepository.updateSchool(id, updatedData);
            if (!updatedSchool) {
                return res.status(404).json({ message: "School not found" });
            }
            res.status(200).json(updatedSchool);
        } catch (error) {
            console.error("Error updating school:", error);
            res.status(500).json({ message: "Failed to update school" });
        }
    }

    // Delete a school by ID
    async deleteSchool(req, res) {
        try {
            const { id } = req.params;
            const deletedSchool = await this.schoolRepository.deleteSchool(id);
            if (!deletedSchool) {
                return res.status(404).json({ message: "School not found" });
            }
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting school:", error);
            res.status(500).json({ message: "Failed to delete school" });
        }
    }
}