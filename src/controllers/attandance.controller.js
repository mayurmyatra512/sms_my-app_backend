import mongoose from "mongoose";
import { getClassIdByName, getSectionIdByName } from "../config/helper.js";
import { getDataByToken } from "../config/jwtops.js";
import AttendanceRepository from "../repositories/attendance.repository.js";

export default class AttendanceController {
    constructor() {
        this.attendanceRepository = new AttendanceRepository();
    }

    // ✅ Create or Update attendance for a class/section/date
    async createAttendance(req, res) {
        try {
            const attendanceData = req.body; // { date, className, sectionName, records: [{ studentId, status }] }
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);

            // Resolve Class & Section IDs
            attendanceData.classId = await getClassIdByName(
                attendanceData.className,
                decoded.schoolId,
                decoded.schoolName
            );
            attendanceData.sectionId = await getSectionIdByName(
                attendanceData.sectionName,
                decoded.schoolId,
                decoded.schoolName
            );

            const attendance = await this.attendanceRepository.createOrUpdateAttendance(
                attendanceData,
                decoded.schoolId,
                decoded.schoolName
            );

            if (!attendance) {
                return res.status(400).json({ message: "Failed to create attendance" });
            }

            res.status(201).json(attendance);
        } catch (error) {
            console.error("Error creating attendance:", error);
            res.status(500).json({ message: "Failed to create attendance" });
        }
    }

    // ✅ Get all attendance records
    async getAllAttendances(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            const attendanceRecords = await this.attendanceRepository.getAllAttendances(
                decoded.schoolId,
                decoded.schoolName
            );
            res.status(200).json(attendanceRecords);
        } catch (error) {
            console.error("Error fetching attendance records:", error);
            res.status(500).json({ message: "Failed to fetch attendance records" });
        }
    }

    // ✅ Get attendance by ID
    async getAttendanceById(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);

            const attendance = await this.attendanceRepository.getAAttendance(
                req.params.id,
                decoded.schoolId,
                decoded.schoolName
            );

            if (!attendance) {
                return res.status(404).json({ message: "Attendance not found" });
            }

            res.status(200).json(attendance);
        } catch (error) {
            console.error("Error fetching attendance by ID:", error);
            res.status(500).json({ message: "Failed to fetch attendance by ID" });
        }
    }

    // ✅ Update attendance by ID
    async updateAttendance(req, res) {
        try {
            const attendanceData = req.body;
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            console.log("Attendance Data = ", attendanceData);
            const updatedAttendance = await this.attendanceRepository.updateAAttendance(
                req.params.id,
                attendanceData,
                decoded.schoolId,
                decoded.schoolName
            );

            if (!updatedAttendance) {
                return res.status(404).json({ message: "Attendance not found" });
            }

            res.status(200).json(updatedAttendance);
        } catch (error) {
            console.error("Error updating attendance:", error);
            res.status(500).json({ message: "Failed to update attendance" });
        }
    }

    // ✅ Delete attendance by ID
    async deleteAttendance(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);

            const deletedAttendance = await this.attendanceRepository.deleteAAttendance(
                req.params.id,
                decoded.schoolId,
                decoded.schoolName
            );

            if (deletedAttendance.status !== "success") {
                return res.status(404).json({ message: "Attendance not found" });
            }

            res.status(200).json({ message: "Attendance deleted successfully" });
        } catch (error) {
            console.error("Error deleting attendance:", error);
            res.status(500).json({ message: "Failed to delete attendance" });
        }
    }

    // ✅ Get attendance by student ID
    async  getAttendanceByStudentId(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            const studentId = req.params.studentId;

            const attendanceRecords = await this.attendanceRepository.getAttendanceByStudentId(
                studentId,
                decoded.schoolId,
                decoded.schoolName
            );

            if (!attendanceRecords || attendanceRecords.length === 0) {
                return res.status(404).json({ message: "No attendance records found for this student" });
            }

            let totalClasses = 0;
            let presentCount = 0;
            let studentName = null;

            attendanceRecords.forEach(att => {
                totalClasses += 1;

                const record = att.records.find(r => r.studentId?._id?.toString() === studentId);

                if (record) {
                    // pick up student's full name once
                    if (!studentName) {
                        studentName = record.studentId?.userId?.fullName || null;
                    }

                    if (record.status === "present") {
                        presentCount += 1;
                    }
                }
            });

            const attendancePercentage = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

            const first = attendanceRecords[0];

            const response = {
                studentId,
                studentName, // ✅ added here
                className: first.classId?.name || null,
                sectionName: first.sectionId?.name || null,
                totalClasses,
                presentCount,
                attendancePercentage: attendancePercentage.toFixed(2),
                records: attendanceRecords
            };

            res.status(200).json(response);
        } catch (error) {
            console.error("Error fetching attendance by student ID:", error);
            res.status(500).json({ message: "Failed to fetch attendance by student ID" });
        }
    }

    // ✅ Get attendance by class + section + date
    async getAttendanceByClassAndDate(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            const { classId, sectionId, date } = req.params;
            const resClassId = await getClassIdByName(classId, decoded.schoolId, decoded.schoolName);
            const resSectionId = await getSectionIdByName(sectionId, decoded.schoolId, decoded.schoolName);
            const classVal = resClassId._id
            const sectionVal = resSectionId._id

            const attendance = await this.attendanceRepository.getAttendanceByClassAndDate(
                classVal,
                sectionVal,
                date,
                decoded.schoolId,
                decoded.schoolName
            );

            if (!attendance) {
                return res.status(404).json({ message: "No attendance record found for this class/section/date" });
            }
            console.log("Attendance  =  ", attendance)
            res.status(200).json(attendance);
        } catch (error) {
            console.error("Error fetching attendance by class/date:", error);
            res.status(500).json({ message: "Failed to fetch attendance by class/date" });
        }
    }
}
