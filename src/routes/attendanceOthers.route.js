import express from "express";
import AttendanceController from "../controllers/attandance.controller.js";


const attendanceOtherRouter = express.Router();
const attendanceController = new AttendanceController();

// ✅ Get attendance by Student ID
attendanceOtherRouter.get("/student/:studentId", (req, res) =>
  attendanceController.getAttendanceByStudentId(req, res)
);

// // ✅ Get attendance by Class ID (all sections)
// attendanceOtherRouter.get("/class/:classId", (req, res) =>
//   attendanceController.getAttendanceByClassId(req, res)
// );

// // ✅ Get attendance by Date (all classes/sections)
// attendanceOtherRouter.get("/date/:date", (req, res) =>
//   attendanceController.getAttendanceByDate(req, res)
// );

// ✅ Get attendance by Class + Section + Date
attendanceOtherRouter.get(
  "/class/:classId/section/:sectionId/date/:date",
  (req, res) => attendanceController.getAttendanceByClassAndDate(req, res)
);

export default attendanceOtherRouter;
