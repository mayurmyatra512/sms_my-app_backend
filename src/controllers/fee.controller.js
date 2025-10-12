
import { get } from "mongoose";
import { generateReceiptNumber, getStudentIdByFullName, getStudentIdByName } from "../config/helper.js";
import { getDataByToken } from "../config/jwtops.js";
import { Readable } from "stream";
import FeeRepository from "../repositories/fee.repository.js";
import StudentFeeRepository from "../repositories/studentFee.repository.js";

export default class FeeController {
    constructor() {
        this.feeRepository = new FeeRepository();
        this.studentFeeRepository = new StudentFeeRepository();
    }

    //Create a  new Fee
    async createFee(req, res) {
        try {
            const feeData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            feeData.studentId = await getStudentIdByFullName(feeData.name, decoded.schoolId, decoded.schoolName);
            feeData.feeType = feeData.category;
            console.log("FeeData =", feeData);
            const newFee = await this.feeRepository.createFee(feeData, decoded.schoolId, decoded.schoolName);
            if (!newFee) {
                return res.status(400).json({ message: "Failed to create Fee" });
            }

            const recieptNumber = await generateReceiptNumber(decoded.schoolCode, decoded.schoolId);
            console.log("Reciept Number = ", recieptNumber);
            const studentFeeData = {
                studentId: feeData.studentId,
                feeModelId: newFee._id,
                amount: feeData.amount,
                paidAmount: feeData.paidAmount || 0,
                balanceAmount: feeData.amount - (feeData.paidAmount || 0),
                paymentDate: feeData.paymentDate,
                paymentMethod: feeData.paymentMethod || 'Cash',
                receiptNumber: recieptNumber,
                collectedBy: decoded.id || "",
                notes: feeData.notes || ""
            }
            const resp = await this.studentFeeRepository.createStudentFee(studentFeeData, decoded.schoolId, decoded.schoolName);
            if (!resp) {
                return res.status(400).json({ message: "Failed to create Student Fee record" });
            }
            const updated = await this.feeRepository.updateStudentFeeId(newFee._id, resp._id, decoded.schoolId, decoded.schoolName);
            if (!updated) {
                return res.status(400).json({ message: "Failed to update Fee with Student Fee record" });
            }
            res.status(201).json({ feeStructure: newFee, studentFeeRecord: resp, message: "Fee and Student Fee record created successfully", updatedFee: updated });
        } catch (error) {
            console.error("Error creating fee:", error);
            res.status(500).json({ message: "Failed to create fee" });
        }
    }

    //Get All Fee
    async getAllFees(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const Fees = await this.feeRepository.getAllFees(decoded.schoolId, decoded.schoolName);
            res.status(200).json(Fees);
        } catch (error) {
            console.error("Error fetching fees:", error);
            res.status(500).json({ message: "Failed to fetch fees" });
        }
    }

    //Get a specific Fee
    async getFeeById(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const feeData = await this.feeRepository.getAFee(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!feeData) {
                return res.status(404).json({ message: "Fee not found" });
            }
            res.status(200).json(feeData);
        } catch (error) {
            console.error("Error fetching Fee:", error);
            res.status(500).json({ message: "Failed to fetch Fee" });
        }
    }

    //Update an Fee Record
    async updateAFee(req, res) {
        try {
            const feeData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const updatedFee = await this.feeRepository.updateAFee(req.params.id, feeData, decoded.schoolId, decoded.schoolName);
            if (!updatedFee) {
                return res.status(404).json({ message: "Fee not found" });
            }
            res.status(200).json(updatedFee);
        } catch (error) {
            console.error("Error fetching fee:", error);
            res.status(500).json({ message: "Failed to fetch fee" });
        }
    }

    //Delete an Fee Record
    async deleteFee(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const deletedFee = await this.feeRepository.deleteAFee(req.params.id, decoded.schoolId, decoded.schoolName);
            if (deletedFee.status !== "success") {
                return res.status(404).json({ message: "Fee not found" });
            }
            res.status(200).json({ message: "Fee deleted successfully" });
        } catch (error) {
            console.error("Error fetching fee:", error);
            res.status(500).json({ message: "Failed to fetch fee" });
        }
    }
    // Get fees by student ID
    async getFeesByStudent(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const studentId = req.params.studentId;
            console.log("Student Id = ", studentId); 
            const fees = await this.feeRepository.getFeesByStudentId(studentId, decoded.schoolId, decoded.schoolName);

            res.status(200).json(fees);
        } catch (error) {
            console.error("Error fetching fees by student:", error);
            res.status(500).json({ message: "Failed to fetch fees by student" });
        }
    }
    // Get fees by class ID
    async getFeesByClass(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const classId = req.params.classId;
            const fees = await this.feeRepository.getFeesByClassId(classId, decoded.schoolId, decoded.schoolName);
            res.status(200).json(fees);
        } catch (error) {
            console.error("Error fetching fees by class:", error);
            res.status(500).json({ message: "Failed to fetch fees by class" });
        }
    }
    // Get fees by type
    async getFeesByType(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const feesType = req.params.feesType;
            const fees = await this.feeRepository.getFeesByType(feesType, decoded.schoolId, decoded.schoolName);
            res.status(200).json(fees);
        } catch (error) {
            console.error("Error fetching fees by type:", error);
            res.status(500).json({ message: "Failed to fetch fees by type" });

        }
    }
    // Get fees by status
    async getFeesByStatus(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const feesStatus = req.params.feesStatus;
            const fees = await this.feeRepository.getFeesByStatus(feesStatus, decoded.schoolId, decoded.schoolName);
            res.status(200).json(fees);
        } catch (error) {
            console.error("Error fetching fees by status:", error);
            res.status(500).json({ message: "Failed to fetch fees by status" });

        }
    }
    // Get due fees
    async getDueFees(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const dueFees = await this.feeRepository.getDueFees(decoded.schoolId, decoded.schoolName);
            res.status(200).json(dueFees);
        } catch (error) {
            console.error("Error fetching due fees:", error);
            res.status(500).json({ message: "Failed to fetch due fees" });
        }
    }

    // get export fees to CSV
    async exportFeesToCSV(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const fees = await this.feeRepository.exportFeesToCSV(decoded.schoolId, decoded.schoolName);
            // 4. Set headers for CSV
            res.setHeader("Content-Type", "text/csv");
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=fees-report.csv"
            );

            // 5. Create Readable stream
            const stream = new Readable({ read() { } });

            // 6. Push CSV header
            stream.push("Student Name, Class, Fees Paid\n");
            // console.log("Fees = ", fees);
            // 7. Push data rows
            fees.forEach(fee => {
                const studentName = fee.studentId?.userId?.fullName || "N/A";
                const className = fee.classId?.name || "N/A";
                const amount = fee.amount || 0;
                stream.push(`${studentName}, ${className}, ${amount}\n`);
            });

            // 8. End stream
            stream.push(null);

            // 9. Pipe to response
            stream.pipe(res);

        } catch (error) {
            console.error("Error fetching fees data for export:", error);
            res.status(500).json({ message: "Failed to fetch fees data for export" });
        }
    }

}