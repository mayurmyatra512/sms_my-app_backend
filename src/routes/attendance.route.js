import express from "express";
import AttendanceController from "../controllers/attandance.controller.js";

const attendanceRouter = express.Router();
const attendanceController = new AttendanceController();

// ✅ Get all attendances
attendanceRouter.get("/", (req, res) =>
  attendanceController.getAllAttendances(req, res)
);

// ✅ Get attendance by ID
attendanceRouter.get("/:id", (req, res) =>
  attendanceController.getAttendanceById(req, res)
);

// ✅ Create or update attendance (per class, section, date)
attendanceRouter.post("/", (req, res) =>
  attendanceController.createAttendance(req, res)
);

// ✅ Update attendance by ID
attendanceRouter.put("/:id", (req, res) =>
  attendanceController.updateAttendance(req, res)
);

// ✅ Delete attendance by ID
attendanceRouter.delete("/:id", (req, res) =>
  attendanceController.deleteAttendance(req, res)
);

export default attendanceRouter;
