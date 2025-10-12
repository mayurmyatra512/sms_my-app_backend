import { get } from "http";
import { getDataByToken } from "../config/jwtops.js";
import StudentFeeRepository from "../repositories/studentFee.repository.js";
import { getStudentIdByName, getUserIdByName } from "../config/helper.js";
import FeeRepository from "../repositories/fee.repository.js";

export default class StudentFeeController {
    constructor() {
        this.studentFeeRepository = new StudentFeeRepository();
        this.feeRepository = new FeeRepository();
    }
    //Create a  new StudentFee
    async createStudentFee(req, res) {
        try {
            const studentFeeData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            studentFeeData.studentId = await getStudentIdByName(studentFeeData.name, decoded.schoolId, decoded.schoolName);
            const newStudentFee = await this.studentFeeRepository.createStudentFee(studentFeeData, decoded.schoolId, decoded.schoolName);
            if (!newStudentFee) {
                return res.status(400).json({ message: "Failed to create Fee" });
            }
            res.status(201).json(newStudentFee);
        } catch (error) {
            console.error("Error creating student fee:", error);
            res.status(500).json({ message: "Failed to create student fee" });
        }
    }
    //Get All Student Fees
    async getAllStudentFees(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const studentFees = await this.studentFeeRepository.getAllStudentFees(decoded.schoolId, decoded.schoolName);
            res.status(200).json(studentFees);
        } catch (error) {
            console.error("Error fetching student fees:", error);
            res.status(500).json({ message: "Failed to fetch student fees" });
        }
    }

    //Get a specific Student Fee
    async getStudentFeeById(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const studentFeeData = await this.studentFeeRepository.getAStudentFee(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!studentFeeData) {
                return res.status(404).json({ message: "Fee not found" });
            }
            res.status(200).json(studentFeeData);
        } catch (error) {
            console.error("Error fetching student Fee:", error);
            res.status(500).json({ message: "Failed to fetch student Fee" });
        }
    }

    //Update a Student Fee Record
    async updateAStudentFee(req, res) {
        try {
            const feeData = req.body;
            // console.log("Fee Data in updateAStudentFee = ", feeData);
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            if(feeData.fullName ){
                feeData.studentId = await getUserIdByName(feeData.fullName, decoded.schoolId, decoded.schoolName);
                if (!feeData.studentId) {
                    return res.status(400).json({ message: "Invalid student name" });
                }
            }
            if(feeData.collectedBy ){
                feeData.collectedBy = await getUserIdByName(feeData.collectedBy, decoded.schoolId, decoded.schoolName);
                if (!feeData.collectedBy) {
                    return res.status(400).json({ message: "Invalid collectedBy name" });
                }
            }
            const updatedStudentFee = await this.studentFeeRepository.updateAStudentFee(req.params.id, feeData, decoded.schoolId, decoded.schoolName);
            if (!updatedStudentFee) {
                return res.status(404).json({ message: "Student Fee not found" });
            }
            if(feeData.paidAmount){
                let balanceAmount = updatedStudentFee.amount - feeData.paidAmount;
                if(balanceAmount < 0) balanceAmount = 0;
                updatedStudentFee.balanceAmount = balanceAmount;
                updatedStudentFee.paidAmount = feeData.paidAmount;
                await this.studentFeeRepository.updateAStudentFee(req.params.id, updatedStudentFee, decoded.schoolId, decoded.schoolName);
            }
            if(feeData.status){
                let status = feeData.status;
                const res = await this.feeRepository.updateStudentFeeStatus(updatedStudentFee.feeModelId, status, decoded.schoolId, decoded.schoolName);
                if(!res) {
                    return res.status(400).json({ message: "Failed to update Fee status" });
                }
            }
            // console.log("Updated Student Fee = ", updatedStudentFee);
            res.status(200).json(updatedStudentFee);
        } catch (error) {
            console.error("Error fetching student Fee:", error);
            res.status(500).json({ message: "Failed to fetch student Fee" });
        }
    }

    //Delete a Student Fee Record
    async deleteAStudentFee(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const deletedStudentFee = await this.studentFeeRepository.deleteAStudentFee(req.params.id, decoded.schoolId, decoded.schoolName);
            if (deletedStudentFee.status !== "success") {
                return res.status(404).json({ message: "Student Fee not found" });
            }
            res.status(200).json({ message: "Student Fee deleted successfully" });
        } catch (error) {
            console.error("Error fetching student Fee:", error);
            res.status(500).json({ message: "Failed to fetch student Fee" });
        }
    }
}