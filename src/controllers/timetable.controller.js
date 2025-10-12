import { getClassIdByName } from "../config/helper.js";
import { getDataByToken } from "../config/jwtops.js";
import TimetableRepository from "../repositories/timetable.repository.js";
export default class TimetableController{
    constructor(){
        this.timetableRepository = new TimetableRepository();
    }

    //Create a  new Timetable
     async createTimetable(req, res){
        try {
            const timetableData = req.body;
            console.log("Timetable Data = ", timetableData);
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const newTimetable = await this.timetableRepository.createTimetable(timetableData, decoded.schoolId, decoded.schoolName);
            if (!newTimetable) {
                return res.status(400).json({ message: "Failed to create Timetable" });
            }
            console.log("Time Table Added = ", newTimetable);
            res.status(201).json(newTimetable);        
        } catch (error) {
            console.error("Error creating Timetable:", error);
            res.status(500).json({ message: "Failed to create Timetable" });
        }
    }

    //Get All Timetable
     async getAllTimetables(req, res){
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            // console.log("======================================== Reached Get Time Tables==============================================");
            const timetables = await this.timetableRepository.getAllTimetables(decoded.schoolId, decoded.schoolName);
            console.log("Time Table Data = ", timetables);
            res.status(200).json(timetables);
        } catch (error) {
            console.error("Error fetching Timetables:", error);
            res.status(500).json({ message: "Failed to fetch Timetables" });
        }
    }

    //Get a specific Timetable
     async getTimetableById(req, res){
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const timetableData = await this.timetableRepository.getATimetable(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!timetableData) {
                return res.status(404).json({ message: "Timetable not found" });
            }
            res.status(200).json(timetableData);
        } catch (error) {
            console.error("Error fetching Timetable:", error);
            res.status(500).json({ message: "Failed to fetch Timetable" });
        }
    }

    //Update an Timetable Record
     async updateTimetable(req, res){
        try {
            const timetableData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            console.log("======================================== Reached Get Time Tables==============================================");

            const updatedTimetable = await this.timetableRepository.updateATimetable(req.params.id, timetableData, decoded.schoolId, decoded.schoolName);
            if (!updatedTimetable) {
                return res.status(404).json({ message: "Timetable not found" });
            }
            res.status(200).json(updatedTimetable);
        } catch (error) {
            console.error("Error updating Timetable:", error);
            res.status(500).json({ message: "Failed to fetch Timetable" });
        }
    }

    //Delete an Timetable Record
     async deleteTimetable(req, res){
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const deletedTimetable = await this.timetableRepository.deleteATimetable(req.params.id, decoded.schoolId, decoded.schoolName);
            if (deletedTimetable.status !== "success") {
                return res.status(404).json({ message: "Timetable not found" });
            }
            res.status(200).json({ message: "Timetable deleted successfully" });
        } catch (error) {
            console.error("Error fetching Timetable:", error);
            res.status(500).json({ message: "Failed to fetch Timetable" });
        }
    }
    // Get Timetable by class Name
     async getTimetableByClassId(req, res){
        try {
            const {className} = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const classId = await getClassIdByName(className, companyId, companyName);
            const timetableData = await this.timetableRepository.getTimetableByClassId(classId, decoded.schoolId, decoded.schoolName);
            if (!timetableData) {
                return res.status(404).json({ message: "Timetable not found" });
            }
            res.status(200).json(timetableData);
        } catch (error) {
            console.error("Error fetching Timetable:", error);
            res.status(500).json({ message: "Failed to fetch Timetable" });
        }
    }
}