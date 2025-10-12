import express from "express";
import StaffSalaryController from "../controllers/staffSalary.controller.js";

const staffSalaryRouter = express.Router();
const staffSalaryController = new StaffSalaryController();

// Define routes for staff salary operations
staffSalaryRouter.get('/', (req, res) => staffSalaryController.getAllStaffSalaries(req, res));
staffSalaryRouter.get('/:id', (req, res) => staffSalaryController.getStaffSalaryById(req, res));
staffSalaryRouter.post('/', (req, res) => staffSalaryController.createStaffSalary(req, res));
staffSalaryRouter.put('/:id', (req, res) => staffSalaryController.updateStaffSalary(req, res));
staffSalaryRouter.delete('/:id', (req, res) => staffSalaryController.deleteStaffSalary(req, res));

export default staffSalaryRouter;
