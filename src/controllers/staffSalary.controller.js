import StaffSalaryRepository from "../repositories/staffSalary.repository.js";
import { getDataByToken } from "../config/jwtops.js";
import TeacherRepository from "../repositories/teacher.repository.js";

export default class StaffSalaryController {
    constructor(){
        this.staffSalaryRepository = new StaffSalaryRepository();
        this.teacherRepository = new TeacherRepository();
    }

    //Create a  new Staff Salary
     async createStaffSalary(req, res){
        try {
            const StaffSalaryData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const newStaffSalary = await this.staffSalaryRepository.createStaffSalary(StaffSalaryData, decoded.schoolId, decoded.schoolName);
            if (!newStaffSalary) {
                return res.status(400).json({ message: "Failed to create Staff Salary" });
            }
            res.status(201).json(newStaffSalary);        
        } catch (error) {
            console.error("Error creating staff Salary:", error);
            res.status(500).json({ message: "Failed to create staff Salary" });
        }
    }

    //Get All Fee
     async getAllStaffSalaries(req, res){
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const StaffSalaries = await this.staffSalaryRepository.getAllStaffSalaries(decoded.schoolId, decoded.schoolName);
            res.status(200).json(StaffSalaries);
        } catch (error) {
            console.error("Error fetching fees:", error);
            res.status(500).json({ message: "Failed to fetch fees" });
        }
    }

    //Get a specific Fee
     async getStaffSalaryById(req, res){
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const staffSalaryData = await this.feeRepository.getAFee(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!staffSalaryData) {
                return res.status(404).json({ message: "Fee not found" });
            }
            res.status(200).json(staffSalaryData);
        } catch (error) {
            console.error("Error fetching Fee:", error);
            res.status(500).json({ message: "Failed to fetch Fee" });
        }
    }

    //Update an Fee Record
     async updateStaffSalary(req, res){
        try {
            const staffSalaryData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const updatedStaffSalary = await this.staffSalaryRepository.updateAStaffSalary(req.params.id, staffSalaryData, decoded.schoolId, decoded.schoolName);
            if (!updatedStaffSalary) {
                return res.status(404).json({ message: "staff salary not updated" });
            }
            const paymentData = {
                monthYear: staffSalaryData.monthYear,
                amount:updatedStaffSalary.paidAmount,
                status:updatedStaffSalary.status,
                date:updatedStaffSalary.paymentDate,
                method: updatedStaffSalary.paymentMethod,
                staffSalaryId: updatedStaffSalary._id
            }
            const paymentHistory = await this.teacherRepository.addPaymentHistory(updatedStaffSalary.staffId, paymentData, decoded.schoolId, decoded.schoolName)
             if (!paymentHistory) {
                return res.status(404).json({ message: "staff salary not updated in techer payment History" });
            }
            // console.log("Payment of History = ",paymentHistory)
            res.status(200).json(updatedStaffSalary);
        } catch (error) {
            console.error("Error fetching staff salary:", error);
            res.status(500).json({ message: "Failed to fetch staff salary" });
        }
    }

    //Delete an StaffSalary Record
     async deleteStaffSalary(req, res){
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const deletedStaffSalary = await this.staffSalaryRepository.deleteAStaffSalary(req.params.id, decoded.schoolId, decoded.schoolName);
            if (deletedStaffSalary.status !== "success") {
                return res.status(404).json({ message: "Staff Salary not found" });
            }
            res.status(200).json({ message: "Staff Salary deleted successfully" });
        } catch (error) {
            console.error("Error fetching staff salary:", error);
            res.status(500).json({ message: "Failed to fetch staff salary" });
        }
    }
    // Get Staff Salaries by Status
     async getStaffSalariesByStatus(req, res) {
        try {
            const { status } = req.params;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const staffSalaries = await this.staffSalaryRepository.getStaffSalariesByStatus(status, decoded.schoolId, decoded.schoolName);
            res.status(200).json(staffSalaries);
        } catch (error) {
            console.error("Error fetching staff salaries by status:", error);
            res.status(500).json({ message: "Failed to fetch staff salaries by status" });
        }
    }
    // Get Staff Salaries by Month
      async getStaffSalariesByMonth(req, res) {
        try {
            const { month } = req.params;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const staffSalaries = await this.staffSalaryRepository.getStaffSalariesByMonth(month, decoded.schoolId, decoded.schoolName);
            res.status(200).json(staffSalaries);
        } catch (error) {
            console.error("Error fetching staff salaries by month:", error);
            res.status(500).json({ message: "Failed to fetch staff salaries by month" });
        }
    }
    // Get Staff Salaries by Year
     async getStaffSalariesByYear(req, res) {
        try {
            const { year } = req.params;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const staffSalaries = await this.staffSalaryRepository.getStaffSalariesByYear(year, decoded.schoolId, decoded.schoolName);
            res.status(200).json(staffSalaries);
        } catch (error) {
            console.error("Error fetching staff salaries by year:", error);
            res.status(500).json({ message: "Failed to fetch staff salaries by year" });
        }
    }
    // Get Staff Salaries by Staff ID
 async getStaffSalariesByStaff(req, res) {
        try {
            const { staff } = req.params;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const staffSalaries = await this.staffSalaryRepository.getStaffSalariesByStaff(staff, decoded.schoolId, decoded.schoolName);
            res.status(200).json(staffSalaries);
        } catch (error) {
            console.error("Error fetching staff salaries by staff ID:", error);
            res.status(500).json({ message: "Failed to fetch staff salaries by staff ID" });
        }
    }

}