import express from "express";
import StudentFeeController from "../controllers/studentFee.controller.js";

const studentFeeRouter = express.Router();
const studentFeeController = new StudentFeeController();

// Define routes for fee operations
studentFeeRouter.get('/', (req, res) => studentFeeController.getAllStudentFees(req, res));
studentFeeRouter.get('/:id', (req, res) => studentFeeController.getStudentFeeById(req, res));
studentFeeRouter.post('/', (req, res) => studentFeeController.createStudentFee(req, res));
studentFeeRouter.put('/:id', (req, res) => studentFeeController.updateAStudentFee(req, res));
studentFeeRouter.delete('/:id', (req, res) => studentFeeController.deleteAStudentFee(req, res));


export default studentFeeRouter;