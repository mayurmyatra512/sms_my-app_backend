import express from "express";
import StaffSalaryController from "../controllers/staffSalary.controller.js";

const staffSalaryOthersRouter = express.Router();
const staffSalaryController = new StaffSalaryController();

// Define routes for staff salary operations
staffSalaryOthersRouter.get('/status/:status', (req, res) => staffSalaryController.getStaffSalariesByStatus(req, res));
staffSalaryOthersRouter.get('/month/:month', (req, res) => staffSalaryController.getStaffSalariesByMonth(req, res));
staffSalaryOthersRouter.get('/year/:year', (req, res) => staffSalaryController.getStaffSalariesByYear(req, res));
staffSalaryOthersRouter.get('/staff/:staffId', (req, res) => staffSalaryController.getStaffSalariesByStaff(req, res));

export default staffSalaryOthersRouter;